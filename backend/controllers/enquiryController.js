const Enquiry = require('../models/Enquiry');
const Property = require('../models/Property');
const ApiResponse = require('../utils/apiResponse');
const { logAudit } = require('../utils/auditLogger');
const { sendNotification } = require('../utils/notificationService');

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
    if (req.user && req.user.role === 'admin') {
      return ApiResponse.error(
        res,
        'Agents and sellers cannot submit buyer enquiries. Please use a buyer profile to initiate inquiries.',
        403
      );
    }

    const { propertyId, message, name, email, phone, enquiryType, siteVisitDate } = req.body;

    let property = null;
    if (propertyId && String(propertyId).match(/^[0-9a-fA-F]{24}$/)) {
      property = await Property.findById(propertyId);
    }
    if (!property && propertyId) {
      property = await Property.findOne({ $or: [{ slug: propertyId }, { id: propertyId }] });
    }
    if (!property) {
      property = await Property.findOne();
    }

    if (!property) {
      return ApiResponse.error(res, 'Property listing not found.', 404);
    }

    const buyerId = req.user ? req.user._id : null;
    const buyerName = name || (req.user ? req.user.name : 'Prospective Client');
    const buyerEmail = email || (req.user ? req.user.email : 'client@plutoplat.com');
    const buyerPhone = phone || (req.user ? req.user.phone : '+91 99563 46155');

    const enquiryData = {
      property: property._id,
      buyer: buyerId,
      seller: property.owner,
      name: buyerName,
      email: buyerEmail,
      phone: buyerPhone,
      message: message || 'Interested in this property listing. Please connect with details.',
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
      actor: buyerId || property.owner,
      actorRole: req.user ? req.user.role : 'user',
      action: 'CREATE',
      module: 'ENQUIRY',
      targetId: enquiry._id,
      targetType: 'Enquiry',
      description: `New lead created for property: ${property.title} by ${buyerName}`,
      req,
    });

    // 1. Dispatch lead notification to seller/agent
    if (property.owner) {
      await sendNotification({
        userId: property.owner,
        recipientRole: 'admin',
        title: 'New VIP Buyer Inquiry Received',
        message: `${buyerName} submitted an inquiry for "${property.title}".`,
        type: 'lead',
        category: 'Itineraries',
        link: '/leads',
      });
    }

    // 2. Dispatch confirmation notification to buyer if authenticated
    if (buyerId) {
      await sendNotification({
        userId: buyerId,
        recipientRole: 'user',
        title: 'Viewing Request & Inquiry Dispatched',
        message: `Your inquiry for "${property.title}" has been transmitted to our senior portfolio advisor.`,
        type: 'Itineraries',
        category: 'Itineraries',
        link: '/my-enquiries',
      });
    }

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
