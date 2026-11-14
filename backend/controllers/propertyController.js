const Property = require('../models/Property');
const ApiResponse = require('../utils/apiResponse');
const { logAudit } = require('../utils/auditLogger');
const { sendNotification } = require('../utils/notificationService');
const { emitPropertyEvent } = require('../utils/socketService');

const KNOWN_GEO = {
  'civil lines': { lat: 26.4740, lng: 80.3350 },
  'swaroop nagar': { lat: 26.4820, lng: 80.3150 },
  'vip road': { lat: 26.4790, lng: 80.3420 },
  'tilak nagar': { lat: 26.4710, lng: 80.3200 },
  'kanpur': { lat: 26.4499, lng: 80.3319 },
  'delhi': { lat: 28.6139, lng: 77.2090 },
  'new delhi': { lat: 28.6015, lng: 77.2285 },
  'golf links': { lat: 28.5990, lng: 77.2340 },
  'mumbai': { lat: 19.0760, lng: 72.8777 },
  'worli': { lat: 19.0178, lng: 72.8178 },
  'bandra': { lat: 19.0596, lng: 72.8295 },
  'dubai': { lat: 25.2048, lng: 55.2708 },
  'palm jumeirah': { lat: 25.1124, lng: 55.1390 },
  'marina': { lat: 25.0805, lng: 55.1403 },
  'hyderabad': { lat: 17.3850, lng: 78.4867 },
  'jubilee hills': { lat: 17.4319, lng: 78.4073 },
  'goa': { lat: 15.2993, lng: 74.1240 },
  'bangalore': { lat: 12.9716, lng: 77.5946 },
  'bengaluru': { lat: 12.9716, lng: 77.5946 },
  'california': { lat: 34.0522, lng: -118.2437 },
  'beverly hills': { lat: 34.0736, lng: -118.4004 },
  'new york': { lat: 40.7128, lng: -74.0060 },
  'manhattan': { lat: 40.7831, lng: -73.9712 },
  'miami': { lat: 25.7617, lng: -80.1918 },
  'miami beach': { lat: 25.7907, lng: -80.1300 },
  'aspen': { lat: 39.1911, lng: -106.8175 },
};

const resolveCoordinates = (location, explicitCoords) => {
  if (explicitCoords && typeof explicitCoords === 'object') {
    const lat = Number(explicitCoords.lat !== undefined ? explicitCoords.lat : explicitCoords.latitude);
    const lng = Number(explicitCoords.lng !== undefined ? explicitCoords.lng : (explicitCoords.longitude !== undefined ? explicitCoords.longitude : explicitCoords.langitude));
    if (!isNaN(lat) && !isNaN(lng) && (lat !== 0 || lng !== 0)) {
      return { lat, lng };
    }
  }
  const locStr = (
    typeof location === 'string'
      ? location
      : `${location?.city || ''} ${location?.address || ''} ${location?.state || ''}`
  ).toLowerCase();

  for (const [key, coords] of Object.entries(KNOWN_GEO)) {
    if (locStr.includes(key)) {
      const jitterLat = (Math.random() - 0.5) * 0.008;
      const jitterLng = (Math.random() - 0.5) * 0.008;
      return {
        lat: Number((coords.lat + jitterLat).toFixed(6)),
        lng: Number((coords.lng + jitterLng).toFixed(6)),
      };
    }
  }
  const jitterLat = (Math.random() - 0.5) * 0.015;
  const jitterLng = (Math.random() - 0.5) * 0.015;
  return {
    lat: Number((26.474 + jitterLat).toFixed(6)),
    lng: Number((80.335 + jitterLng).toFixed(6)),
  };
};

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
  const coords = resolveCoordinates(p.location, {
    lat: p.latitude !== undefined ? p.latitude : p.coordinates?.lat,
    lng: p.longitude !== undefined ? p.longitude : (p.langitude !== undefined ? p.langitude : p.coordinates?.lng),
  });

  return {
    ...p,
    id,
    _id: id,
    location: locStr,
    locationDetails: p.location,
    latitude: coords.lat,
    longitude: coords.lng,
    langitude: coords.lng,
    coordinates: coords,
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
    const coordinates = resolveCoordinates(req.body.location, req.body.coordinates);

    const propertyData = {
      ...req.body,
      owner: req.user._id,
      postedBy: req.user._id,
      status,
      isVerified,
      coordinates,
    };

    const property = await Property.create(propertyData);
    const normalized = normalizeProperty(property);

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

    // Broadcast property_created over Socket.IO to update catalogs dynamically
    try {
      emitPropertyEvent('property_created', normalized);
    } catch (e) {}

    const message = 'Property created and published successfully. Visible on the public portal.';

    return ApiResponse.success(res, message, { property: normalized }, 201);
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

    const normalized = normalizeProperty(property);
    try {
      emitPropertyEvent('property_updated', normalized);
    } catch (e) {}

    return ApiResponse.success(res, `Property status updated to ${finalStatus}.`, {
      property: normalized,
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
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isSuperAdmin && !isAdmin) {
      return ApiResponse.error(res, 'Forbidden: You can only edit your own listings.', 403);
    }

    if (!isSuperAdmin && !isAdmin) {
      req.body.status = 'pending';
      req.body.isVerified = false;
      req.body.verified = false;
    }

    // Sync explicit coordinates or latitude/longitude
    if (req.body.latitude !== undefined || req.body.longitude !== undefined || req.body.langitude !== undefined) {
      const lat = Number(req.body.latitude !== undefined ? req.body.latitude : (property.latitude || property.coordinates?.lat)) || 26.474;
      const lng = Number(req.body.longitude !== undefined ? req.body.longitude : (req.body.langitude !== undefined ? req.body.langitude : (property.longitude || property.coordinates?.lng))) || 80.335;
      req.body.latitude = lat;
      req.body.longitude = lng;
      req.body.coordinates = { lat, lng };
    } else if (req.body.location || req.body.coordinates) {
      property.coordinates = resolveCoordinates(req.body.location || property.location, req.body.coordinates);
      req.body.latitude = property.coordinates.lat;
      req.body.longitude = property.coordinates.lng;
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

    const normalized = normalizeProperty(property);
    try {
      emitPropertyEvent('property_updated', normalized);
    } catch (e) {}

    return ApiResponse.success(res, 'Property updated successfully.', {
      property: normalized,
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
    const targetId = req.params.id;
    const mongoose = require('mongoose');
    const User = require('../models/User');

    let property = null;
    if (mongoose.Types.ObjectId.isValid(targetId)) {
      property = await Property.findById(targetId);
    }
    if (!property) {
      property = await Property.findOne({
        $or: [{ _id: targetId }, { slug: targetId }, { title: targetId }],
      });
    }

    if (!property) {
      return ApiResponse.error(res, 'Property not found.', 404);
    }

    const isOwner = property.owner && property.owner.toString() === req.user._id.toString();
    const isElevated = req.user.role === 'admin' || req.user.role === 'super_admin';

    if (!isOwner && !isElevated) {
      return ApiResponse.error(res, 'Forbidden: You cannot delete this listing.', 403);
    }

    await Property.findByIdAndDelete(property._id);

    // Pull from all users' saved properties
    await User.updateMany(
      { savedProperties: property._id },
      { $pull: { savedProperties: property._id } }
    ).catch(() => {});

    try {
      emitPropertyEvent('property_deleted', { id: property._id, _id: property._id });
    } catch (e) {}

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

    return ApiResponse.success(res, 'Property deleted successfully.', {
      deletedId: property._id,
    });
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
