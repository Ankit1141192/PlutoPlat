const Enquiry = require('../models/Enquiry');
const Property = require('../models/Property');
const ApiResponse = require('../utils/apiResponse');
const { logAudit } = require('../utils/auditLogger');

/**
 * Submit an enquiry on a property
 * POST /api/v1/enquiries
 * RBAC:
 * - user(buyer): yes
 * - Admin(seller/agents): No (Admins cannot submit buyer enquiries)
 * - SuperAdmin: yes
 */
const createEnquiry = async (req, res, next) => {
  try {
    if (req.user.role === 'admin') {
      return ApiResponse.error(
        res,
        'Agents and sellers cannot submit buyer enquiries. Please use a buyer profile to initiate inquiries.',
        403
      );
    }

    const { propertyId, message, name, email, phone, enquiryType, siteVisitDate } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) {
      return ApiResponse.error(res, 'Property listing not found.', 404);
    }

    const enquiryData = {
      property: property._id,
      buyer: req.user._id,
      seller: property.owner,
      name: name || req.user.name,
      email: email || req.user.email,
      phone: phone || req.user.phone,
      message,
      enquiryType: enquiryType || 'property_information',
    };

    if (siteVisitDate) {
      enquiryData.siteVisit = {
        requested: true,
        date: new Date(siteVisitDate),
      };
    }

    const enquiry = await Enquiry.create(enquiryData);

    await logAudit({
      actor: req.user._id,
      actorRole: req.user.role,
      action: 'CREATE',
      module: 'ENQUIRY',
      targetId: enquiry._id,
      targetType: 'Enquiry',
      description: `New lead created for property: ${property.title}`,
      req,
    });

    return ApiResponse.success(res, 'Enquiry submitted successfully. The property manager has been notified.', { enquiry }, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Get enquiries / leads
 * GET /api/v1/enquiries
 * RBAC:
 * - user: Only inquiries submitted by the user
 * - admin: Leads received on properties owned by this admin
 * - super_admin: Global pipeline of all inquiries across the platform
 */
const getMyEnquiries = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;
    let filter = {};

    if (userRole === 'super_admin') {
      // SuperAdmin sees all inquiries
      if (req.query.status) {
        filter.status = req.query.status;
      }
    } else if (userRole === 'admin') {
      // Admin sees leads for their own properties
      filter.seller = userId;
      if (req.query.status) {
        filter.status = req.query.status;
      }
    } else {
      // Regular user / buyer sees inquiries they placed
      filter.buyer = userId;
    }

    const enquiries = await Enquiry.find(filter)
      .populate('property', 'title price location images status')
      .populate('buyer', 'name email phone')
      .populate('seller', 'name email phone')
      .sort({ createdAt: -1 });

    return ApiResponse.success(res, 'Enquiries fetched successfully.', { enquiries });
  } catch (error) {
    next(error);
  }
};

/**
 * Update enquiry status / stage
 * PATCH /api/v1/enquiries/:id/status
 * RBAC:
 * - admin: Allowed for enquiries on their own properties
 * - super_admin: Allowed for all enquiries
 */
const updateEnquiryStatus = async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body;
    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return ApiResponse.error(res, 'Enquiry not found.', 404);
    }

    const isSeller = enquiry.seller.toString() === req.user._id.toString();
    const isSuperAdmin = req.user.role === 'super_admin';

    if (!isSeller && !isSuperAdmin) {
      return ApiResponse.error(res, 'Forbidden: You cannot modify leads for properties you do not manage.', 403);
    }

    if (status) enquiry.status = status;
    if (adminNotes !== undefined) enquiry.adminNotes = adminNotes;

    await enquiry.save();

    await logAudit({
      actor: req.user._id,
      actorRole: req.user.role,
      action: 'UPDATE',
      module: 'ENQUIRY',
      targetId: enquiry._id,
      targetType: 'Enquiry',
      description: `Updated enquiry status to ${status || enquiry.status}`,
      req,
    });

    return ApiResponse.success(res, 'Lead status updated successfully.', { enquiry });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEnquiry,
  getMyEnquiries,
  updateEnquiryStatus,
};
