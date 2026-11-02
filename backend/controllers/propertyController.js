const Property = require('../models/Property');
const ApiResponse = require('../utils/apiResponse');
const { logAudit } = require('../utils/auditLogger');

/**
 * Create a new property
 * POST /api/v1/properties
 */
const createProperty = async (req, res, next) => {
  try {
    const propertyData = {
      ...req.body,
      owner: req.user._id,
      postedBy: req.user._id,
    };

    const property = await Property.create(propertyData);

    await logAudit({
      actor: req.user._id,
      actorRole: req.user.role,
      action: 'CREATE',
      module: 'PROPERTY',
      targetId: property._id,
      targetType: 'Property',
      description: `Created property listing: ${property.title}`,
      req,
    });

    return ApiResponse.success(res, 'Property created successfully.', { property }, 201);
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
      limit = 10,
      propertyType,
      listingType,
      city,
      minPrice,
      maxPrice,
      search,
    } = req.query;

    const query = { status: 'active' };

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
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [properties, total] = await Promise.all([
      Property.find(query)
        .populate('owner', 'name email phone profileImage')
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
      'name email phone profileImage'
    );

    if (!property) {
      return ApiResponse.error(res, 'Property not found.', 404);
    }

    // Increment views
    property.views = (property.views || 0) + 1;
    await property.save();

    return ApiResponse.success(res, 'Property fetched successfully.', { property });
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
    const isAdmin = ['admin', 'super_admin'].includes(req.user.role);

    if (!isOwner && !isAdmin) {
      return ApiResponse.error(res, 'Forbidden: You can only edit your own listings.', 403);
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
    const isAdmin = ['admin', 'super_admin'].includes(req.user.role);

    if (!isOwner && !isAdmin) {
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
  updateProperty,
  deleteProperty,
};
