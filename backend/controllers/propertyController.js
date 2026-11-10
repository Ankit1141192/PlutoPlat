const Property = require('../models/Property');
const ApiResponse = require('../utils/apiResponse');
const { logAudit } = require('../utils/auditLogger');
const { sendNotification } = require('../utils/notificationService');

/**
 * Format property document for clean frontend consumption
 */
const normalizeProperty = (prop) => {
  const p = prop.toObject ? prop.toObject() : prop;
  const id = p._id ? p._id.toString() : (p.id || String(Date.now()));

  let locStr = 'Kanpur, Uttar Pradesh';
  if (typeof p.location === 'string') {
    locStr = p.location;
  } else if (p.location && typeof p.location === 'object') {
    const parts = [p.location.city, p.location.state].filter(Boolean);
    locStr = parts.length > 0 ? parts.join(', ') : (p.location.address || 'Kanpur, UP');
  }

  const primaryImage = p.image || (p.images && p.images[0]) || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80';

  return {
    ...p,
    id,
    _id: id,
    location: locStr,
    locationDetails: p.location,
    image: primaryImage,
    images: p.images && p.images.length > 0 ? p.images : [primaryImage],
    type: p.type || p.propertyType || 'Villas',
    purpose: p.purpose || (p.listingType === 'rent' ? 'Rent' : 'Buy'),
    numericPrice: p.numericPrice || (typeof p.price === 'number' ? p.price : 8500000),
    price: p.price || (p.numericPrice ? `₹${(p.numericPrice / 10000000).toFixed(2)} Cr` : 'Price on Request'),
    featured: p.featured || p.isFeatured || false,
    verified: p.verified !== undefined ? p.verified : (p.isVerified !== undefined ? p.isVerified : true),
  };
};

/**
 * Create a new property
 * POST /api/v1/properties
 */
const createProperty = async (req, res, next) => {
  try {
    const userRole = req.user.role;

    if (userRole === 'user') {
      return ApiResponse.error(
        res,
        'Access denied: Buyers cannot post property listings. Please register as an authorized agent or contact the administrator.',
        403
      );
    }

    const isSuperAdmin = userRole === 'super_admin';
    const status = isSuperAdmin ? (req.body.status || 'active') : (req.body.status || 'approved');
    const isVerified = isSuperAdmin ? (req.body.isVerified !== undefined ? req.body.isVerified : true) : true;

    const propertyData = {
      ...req.body,
      owner: req.user._id,
      postedBy: req.user._id,
      status,
      isVerified,
    };

    const property = await Property.create(propertyData);

    await logAudit({
      actor: req.user._id,
      actorRole: req.user.role,
      action: 'CREATE',
      module: 'PROPERTY',
      targetId: property._id,
      targetType: 'Property',
      description: `Created property listing: ${property.title} (Status: ${status})`,
      req,
    });

    const locText = typeof property.location === 'string'
      ? property.location
      : property.location?.city || 'Kanpur, UP';

    // Dispatch notifications
    await sendNotification({
      recipientRole: 'super_admin',
      title: 'New Listing Added to Platform',
      message: `${req.user.name} (${userRole}) added "${property.title}" in ${locText}.`,
      type: 'property',
      category: 'Listing Updates',
      link: `/properties`,
    });

    await sendNotification({
      recipientRole: 'user',
      title: 'New Property Available',
      message: `"${property.title}" in ${locText} is now published and open for viewing.`,
      type: 'property',
      category: 'Off-Market',
      link: `/property/${property._id}`,
    });

    const message = 'Property created and published successfully. Visible on the public portal.';

    return ApiResponse.success(res, message, { property: normalizeProperty(property) }, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Get all properties with filters & pagination
 * GET /api/v1/properties
 */
const getProperties = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 50,
      propertyType,
      type,
      listingType,
      purpose,
      city,
      location,
      minPrice,
      maxPrice,
      search,
      status,
      owner,
      featured,
    } = req.query;

    const query = {};

    // RBAC status filtering
    const isSuperAdmin = req.user && req.user.role === 'super_admin';
    const isAdmin = req.user && req.user.role === 'admin';

    if (isSuperAdmin) {
      if (status && status !== 'all') {
        query.status = status;
      }
      if (owner) {
        query.owner = owner;
      }
    } else if (isAdmin && owner && req.user._id.toString() === owner) {
      query.owner = req.user._id;
      if (status && status !== 'all') {
        query.status = status;
      }
    } else {
      // Default public: show all active/approved/listed properties (hide only rejected/archived)
      query.status = { $nin: ['rejected', 'archived'] };
    }

    // Property Type filter
    const targetType = type || propertyType;
    if (targetType && targetType !== 'All') {
      query.$or = query.$or || [];
      const typeRegex = new RegExp(targetType, 'i');
      query.$or.push({ type: typeRegex }, { propertyType: typeRegex });
    }

    // Purpose / ListingType filter
    const targetPurpose = purpose || listingType;
    if (targetPurpose && targetPurpose !== 'All') {
      const pLower = targetPurpose.toLowerCase();
      const mapped = pLower === 'buy' || pLower === 'sale' ? ['sale', 'buy', 'Buy'] : ['rent', 'Rent'];
      query.$or = query.$or || [];
      query.$or.push({ purpose: { $in: mapped } }, { listingType: { $in: mapped } });
    }

    // Location / City filter
    const locFilter = location || city;
    if (locFilter && locFilter.trim()) {
      const locRegex = new RegExp(locFilter.trim(), 'i');
      const locConditions = [
        { 'location.city': locRegex },
        { 'location.state': locRegex },
        { 'location.address': locRegex },
        { location: locRegex },
        { title: locRegex },
        { subtitle: locRegex },
        { description: locRegex },
      ];
      if (query.$or) {
        query.$and = [{ $or: query.$or }, { $or: locConditions }];
        delete query.$or;
      } else {
        query.$or = locConditions;
      }
    }

    // Price range filter
    if (minPrice || maxPrice) {
      const priceQuery = {};
      if (minPrice) priceQuery.$gte = Number(minPrice);
      if (maxPrice) priceQuery.$lte = Number(maxPrice);
      query.numericPrice = priceQuery;
    }

    // Featured filter
    if (featured === 'true') {
      query.$or = query.$or || [];
      query.$or.push({ featured: true }, { isFeatured: true });
    }

    // General search text
    if (search && search.trim()) {
      const sRegex = new RegExp(search.trim(), 'i');
      const searchConditions = [
        { title: sRegex },
        { subtitle: sRegex },
        { description: sRegex },
        { 'location.city': sRegex },
        { 'location.address': sRegex },
        { location: sRegex },
      ];
      if (query.$and) {
        query.$and.push({ $or: searchConditions });
      } else if (query.$or) {
        query.$and = [{ $or: query.$or }, { $or: searchConditions }];
        delete query.$or;
      } else {
        query.$or = searchConditions;
      }
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(200, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [rawProperties, total] = await Promise.all([
      Property.find(query)
        .populate('owner', 'name email phone profileImage role')
        .skip(skip)
        .limit(limitNum)
        .sort({ isFeatured: -1, featured: -1, createdAt: -1 }),
      Property.countDocuments(query),
    ]);

    const properties = rawProperties.map(normalizeProperty);

    return ApiResponse.success(res, 'Properties fetched successfully.', {
      properties,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single property by ID
 * GET /api/v1/properties/:id
 */
const getPropertyById = async (req, res, next) => {
  try {
    let property = null;
    const { id } = req.params;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      property = await Property.findById(id).populate('owner', 'name email phone profileImage role');
    } else {
      property = await Property.findOne({ slug: id }) || await Property.findOne({ id });
    }

    if (!property) {
      return ApiResponse.error(res, 'Property not found.', 404);
    }

    property.views = (property.views || 0) + 1;
    await property.save();

    return ApiResponse.success(res, 'Property fetched successfully.', {
      property: normalizeProperty(property),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get logged-in user's own properties
 * GET /api/v1/properties/my/listings
 */
const getMyProperties = async (req, res, next) => {
  try {
    const rawProperties = await Property.find({ owner: req.user._id }).sort({ createdAt: -1 });
    const properties = rawProperties.map(normalizeProperty);
    return ApiResponse.success(res, 'Your property listings fetched successfully.', { properties });
  } catch (error) {
    next(error);
  }
};

/**
 * Moderate Property (SuperAdmin only)
 * PATCH /api/v1/properties/:id/moderate
 */
const moderateProperty = async (req, res, next) => {
  try {
    const { status, rejectionReason } = req.body;

    if (!['active', 'approved', 'rejected', 'pending'].includes(status)) {
      return ApiResponse.error(res, "Invalid moderation status. Choose 'active', 'approved', 'rejected', or 'pending'.", 400);
    }

    const property = await Property.findById(req.params.id);
    if (!property) {
      return ApiResponse.error(res, 'Property not found.', 404);
    }

    const finalStatus = status === 'approved' ? 'active' : status;
    property.status = finalStatus;
    property.isVerified = finalStatus === 'active';
    property.verified = finalStatus === 'active';

    if (finalStatus === 'rejected' && rejectionReason) {
      property.rejectionReason = rejectionReason;
    } else if (finalStatus === 'active') {
      property.rejectionReason = '';
    }

    await property.save();

    await logAudit({
      actor: req.user._id,
      actorRole: req.user.role,
      action: finalStatus === 'active' ? 'APPROVE' : 'REJECT',
      module: 'PROPERTY',
      targetId: property._id,
      targetType: 'Property',
      description: `Moderated property: ${property.title} to ${finalStatus.toUpperCase()}`,
      req,
    });

    return ApiResponse.success(res, `Property status updated to ${finalStatus}.`, {
      property: normalizeProperty(property),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update property
 * PUT /api/v1/properties/:id
 */
const updateProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return ApiResponse.error(res, 'Property not found.', 404);
    }

    const isOwner = property.owner && property.owner.toString() === req.user._id.toString();
    const isSuperAdmin = req.user.role === 'super_admin';

    if (!isOwner && !isSuperAdmin) {
      return ApiResponse.error(res, 'Forbidden: You can only edit your own listings.', 403);
    }

    if (!isSuperAdmin) {
      req.body.status = 'pending';
      req.body.isVerified = false;
      req.body.verified = false;
    }

    Object.assign(property, req.body);
    await property.save();

    await logAudit({
      actor: req.user._id,
      actorRole: req.user.role,
      action: 'UPDATE',
      module: 'PROPERTY',
      targetId: property._id,
      targetType: 'Property',
      description: `Updated property: ${property.title}`,
      req,
    });

    return ApiResponse.success(res, 'Property updated successfully.', {
      property: normalizeProperty(property),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete property
 * DELETE /api/v1/properties/:id
 */
const deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return ApiResponse.error(res, 'Property not found.', 404);
    }

    const isOwner = property.owner && property.owner.toString() === req.user._id.toString();
    const isSuperAdmin = req.user.role === 'super_admin';

    if (!isOwner && !isSuperAdmin) {
      return ApiResponse.error(res, 'Forbidden: You cannot delete this listing.', 403);
    }

    await Property.findByIdAndDelete(req.params.id);

    await logAudit({
      actor: req.user._id,
      actorRole: req.user.role,
      action: 'DELETE',
      module: 'PROPERTY',
      targetId: property._id,
      targetType: 'Property',
      description: `Deleted property: ${property.title}`,
      req,
    });

    return ApiResponse.success(res, 'Property deleted successfully.');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProperty,
  getProperties,
  getPropertyById,
  getMyProperties,
  moderateProperty,
  updateProperty,
  deleteProperty,
  normalizeProperty,
};
