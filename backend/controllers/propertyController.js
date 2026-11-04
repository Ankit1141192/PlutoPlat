const Property = require('../models/Property');
const ApiResponse = require('../utils/apiResponse');
const { logAudit } = require('../utils/auditLogger');

/**
 * Create a new property
 * POST /api/v1/properties
 * RBAC:
 * - user: Forbidden (Buyers cannot create listings)
 * - admin: Allowed (Always created with status='pending' and isVerified=false)
 * - super_admin: Allowed (Directly approved or custom status)
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
    const status = isSuperAdmin ? (req.body.status || 'active') : 'pending';
    const isVerified = isSuperAdmin ? (req.body.isVerified !== undefined ? req.body.isVerified : true) : false;

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

    const message = isSuperAdmin
      ? 'Property created and verified successfully.'
      : 'Property listing submitted for SuperAdmin moderation. It will be published upon approval.';

    return ApiResponse.success(res, message, { property }, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Get all properties with filters & pagination
 * GET /api/v1/properties
 * RBAC:
 * - Public / Buyers: Only retrieve active & verified listings
 * - Admin: View all active, or filter their own listings by status
 * - SuperAdmin: Full access to all statuses (pending moderation queue, active, rejected)
 */
const getProperties = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      propertyType,
      listingType,
      city,
      minPrice,
      maxPrice,
      search,
      status,
      owner,
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
      // Admin looking at their own listings
      query.owner = req.user._id;
      if (status && status !== 'all') {
        query.status = status;
      }
    } else {
      // Default public / buyer query: only verified & active properties
      query.status = 'active';
      query.isVerified = true;
      query.isAvailable = true;
    }

    if (propertyType) query.propertyType = propertyType;
    if (listingType) query.listingType = listingType;
    if (city) query['location.city'] = new RegExp(city, 'i');
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { 'location.city': new RegExp(search, 'i') },
        { 'location.state': new RegExp(search, 'i') },
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [properties, total] = await Promise.all([
      Property.find(query)
        .populate('owner', 'name email phone profileImage role')
        .skip(skip)
        .limit(limitNum)
        .sort({ createdAt: -1 }),
      Property.countDocuments(query),
    ]);

    return ApiResponse.success(res, 'Properties fetched successfully.', {
      properties,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
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
    const property = await Property.findById(req.params.id).populate(
      'owner',
      'name email phone profileImage role'
    );

    if (!property) {
      return ApiResponse.error(res, 'Property not found.', 404);
    }

    // Increment views safely
    property.views = (property.views || 0) + 1;
    await property.save();

    return ApiResponse.success(res, 'Property fetched successfully.', { property });
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
    const properties = await Property.find({ owner: req.user._id }).sort({ createdAt: -1 });
    return ApiResponse.success(res, 'Your property listings fetched successfully.', { properties });
  } catch (error) {
    next(error);
  }
};

/**
 * Moderate Property (SuperAdmin only)
 * PATCH /api/v1/properties/:id/moderate
 * Approve or Reject a listing submitted by agents
 */
const moderateProperty = async (req, res, next) => {
  try {
    const { status, rejectionReason } = req.body;

    if (!['active', 'rejected', 'pending'].includes(status)) {
      return ApiResponse.error(res, "Invalid moderation status. Choose 'active', 'rejected', or 'pending'.", 400);
    }

    const property = await Property.findById(req.params.id);
    if (!property) {
      return ApiResponse.error(res, 'Property not found.', 404);
    }

    property.status = status;
    property.isVerified = status === 'active';
    if (status === 'rejected' && rejectionReason) {
      property.rejectionReason = rejectionReason;
    } else if (status === 'active') {
      property.rejectionReason = '';
    }

    await property.save();

    await logAudit({
      actor: req.user._id,
      actorRole: req.user.role,
      action: status === 'active' ? 'APPROVE' : 'REJECT',
      module: 'PROPERTY',
      targetId: property._id,
      targetType: 'Property',
      description: `Moderated property: ${property.title} to ${status.toUpperCase()}`,
      req,
    });

    return ApiResponse.success(res, `Property status updated to ${status}.`, { property });
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

    const isOwner = property.owner.toString() === req.user._id.toString();
    const isSuperAdmin = req.user.role === 'super_admin';

    if (!isOwner && !isSuperAdmin) {
      return ApiResponse.error(res, 'Forbidden: You can only edit your own listings.', 403);
    }

    // If an admin edits their listing, reset status to pending for re-moderation unless super_admin
    if (!isSuperAdmin) {
      req.body.status = 'pending';
      req.body.isVerified = false;
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

    return ApiResponse.success(res, 'Property updated successfully.', { property });
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

    const isOwner = property.owner.toString() === req.user._id.toString();
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
};
