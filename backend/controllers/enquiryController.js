const Enquiry = require('../models/Enquiry');
const Property = require('../models/Property');
const ApiResponse = require('../utils/apiResponse');
const { logAudit } = require('../utils/auditLogger');

/**
 * Submit an enquiry on a property
 * POST /api/v1/enquiries
 */
const createEnquiry = async (req, res, next) => {
  try {
    const { propertyId, message, name, email, phone } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) {
      return ApiResponse.error(res, 'Property not found.', 404);
    }

    const enquiry = await Enquiry.create({
      property: property._id,
      buyer: req.user._id,
      seller: property.owner,
      name: name || req.user.name,
      email: email || req.user.email,
      phone: phone || req.user.phone,
      message,
    });

    await logAudit({
      actor: req.user._id,
      actorRole: req.user.role,
      action: 'CREATE',
      module: 'ENQUIRY',
      targetId: enquiry._id,
      targetType: 'Enquiry',
      description: `New enquiry on property: ${property.title}`,
      req,
    });

    return ApiResponse.success(res, 'Enquiry submitted successfully.', { enquiry }, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Get enquiries for the logged-in user (as buyer or seller)
 * GET /api/v1/enquiries
 */
const getMyEnquiries = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const filter = {
      $or: [{ buyer: userId }, { seller: userId }],
    };

    const enquiries = await Enquiry.find(filter)
      .populate('property', 'title price location images')
      .populate('buyer', 'name email phone')
      .populate('seller', 'name email phone')
      .sort({ createdAt: -1 });

    return ApiResponse.success(res, 'Enquiries fetched successfully.', { enquiries });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEnquiry,
  getMyEnquiries,
};
