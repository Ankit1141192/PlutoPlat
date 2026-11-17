const Enquiry = require('../models/Enquiry');
const Property = require('../models/Property');
const ApiResponse = require('../utils/apiResponse');
const { logAudit } = require('../utils/auditLogger');
const { sendNotification } = require('../utils/notificationService');

/**
 * Normalizes an enquiry document for seamless display across frontend and dashboards
 */
const normalizeEnquiry = (e) => {
  const doc = e && e.toObject ? e.toObject() : { ...(e || {}) };
  const rawStatus = doc.status ? String(doc.status).trim() : 'incompleted';
  const isCompleted = rawStatus.toLowerCase() === 'completed' || rawStatus.toLowerCase() === 'closed';

  const idStr = doc._id ? String(doc._id) : (doc.id || `LD-${Math.floor(1000 + Math.random() * 9000)}`);
  const buyerName = doc.name || doc.buyer?.name || doc.buyerName || 'Prospective Client';
  const buyerEmail = doc.email || doc.buyer?.email || doc.buyerEmail || '';
  const buyerPhone = doc.phone || doc.buyer?.phone || doc.buyerPhone || '';
  const propTitle = doc.property?.title || doc.propertyTitle || (doc.enquiryType && doc.enquiryType !== 'property_information' ? doc.enquiryType : 'General Contact Enquiry');
  const propPrice = doc.property?.price || doc.budget || '';

  return {
    ...doc,
    id: idStr,
    _id: idStr,
    name: buyerName,
    buyerName,
    email: buyerEmail,
    buyerEmail,
    phone: buyerPhone,
    buyerPhone,
    propertyTitle: propTitle,
    propertyPrice: propPrice,
    date: doc.createdAt
      ? new Date(doc.createdAt).toISOString().replace('T', ' ').substring(0, 16)
      : (doc.date || new Date().toISOString().replace('T', ' ').substring(0, 16)),
    status: isCompleted ? 'Completed' : 'Incompleted',
    rawStatus,
  };
};

/**
 * Submit an enquiry (property enquiry or general contact enquiry)
 * POST /api/v1/enquiries
 * RBAC:
 * - user / guest buyer: YES (users only able to send)
 * - SuperAdmin: YES
 * - Admin: view/manage leads, cannot spam inquiries as buyer
 */
const createEnquiry = async (req, res, next) => {
  try {
    const { propertyId, propertyTitle, message, name, email, phone, enquiryType, budget, siteVisitDate } = req.body;

    let property = null;
    if (propertyId && String(propertyId).match(/^[0-9a-fA-F]{24}$/)) {
      property = await Property.findById(propertyId);
    }
    if (!property && propertyId && propertyId !== '1') {
      property = await Property.findOne({ $or: [{ slug: propertyId }, { id: propertyId }] });
    }

    const buyerId = req.user ? req.user._id : null;
    const buyerName = (name || (req.user ? req.user.name : '') || 'Prospective Client').trim();
    const buyerEmail = (email || (req.user ? req.user.email : '') || 'client@plutoplat.com').trim().toLowerCase();
    const buyerPhone = (phone || (req.user ? req.user.phone : '') || '+91 99563 46155').trim();
    const resolvedTitle = property ? property.title : (propertyTitle || enquiryType || 'General Contact Enquiry');

    const enquiryData = {
      property: property ? property._id : null,
      propertyTitle: resolvedTitle,
      buyer: buyerId,
      seller: property ? property.owner : null,
      name: buyerName,
      email: buyerEmail,
      phone: buyerPhone,
      message: message || 'Interested in connecting with PlutoPlat advisors.',
      enquiryType: enquiryType || 'General Inquiry',
      budget: budget || '',
      status: 'incompleted',
    };

    if (siteVisitDate) {
      enquiryData.siteVisit = {
        requested: true,
        date: new Date(siteVisitDate),
      };
    }

    const enquiry = await Enquiry.create(enquiryData);

    await logAudit({
      actor: buyerId || (property ? property.owner : null) || null,
      actorRole: req.user ? req.user.role : 'user',
      action: 'CREATE',
      module: 'ENQUIRY',
      targetId: enquiry._id,
      targetType: 'Enquiry',
      description: `New enquiry created: "${resolvedTitle}" by ${buyerName}`,
      req,
    }).catch(() => {});

    // 1. Dispatch lead notification to specific seller/agent if property exists
    if (property && property.owner) {
      await sendNotification({
        userId: property.owner,
        recipientRole: 'admin',
        title: 'New VIP Buyer Inquiry Received',
        message: `${buyerName} submitted an inquiry for "${property.title}".`,
        type: 'lead',
        category: 'Inquiries',
        link: '/leads',
      }).catch(() => {});
    }

    // 2. Dispatch general notifications so both Admin and SuperAdmin see new enquiry
    await sendNotification({
      recipientRole: 'admin',
      title: 'New Client Inquiry Received',
      message: `${buyerName} submitted an inquiry: "${resolvedTitle}".`,
      type: 'lead',
      category: 'Inquiries',
      link: '/leads',
    }).catch(() => {});

    await sendNotification({
      recipientRole: 'super_admin',
      title: 'New Platform Inquiry Logged',
      message: `${buyerName} (${buyerEmail}) submitted: "${resolvedTitle}".`,
      type: 'lead',
      category: 'Inquiries',
      link: '/leads',
    }).catch(() => {});

    // 3. Dispatch confirmation notification to buyer if authenticated
    if (buyerId) {
      await sendNotification({
        userId: buyerId,
        recipientRole: 'user',
        title: 'Viewing Request & Inquiry Dispatched',
        message: `Your inquiry for "${resolvedTitle}" has been transmitted to our senior portfolio advisor.`,
        type: 'Itineraries',
        category: 'Itineraries',
        link: '/my-enquiries',
      }).catch(() => {});
    }

    const normalized = normalizeEnquiry(enquiry);
    return ApiResponse.success(res, 'Enquiry submitted successfully. Our advisory desk has been notified.', {
      enquiry: normalized,
      lead: normalized,
    }, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Get enquiries / leads
 * GET /api/v1/enquiries or GET /api/v1/enquiries/my
 * RBAC:
 * - user: Only inquiries submitted by the user
 * - admin: Leads received on properties owned by this admin + general contact enquiries
 * - super_admin: Global pipeline of all inquiries across the platform
 */
const getMyEnquiries = async (req, res, next) => {
  try {
    const userId = req.user ? req.user._id : null;
    const userRole = req.user ? req.user.role : 'user';
    let filter = {};

    if (userRole === 'super_admin') {
      // SuperAdmin sees all inquiries
      if (req.query.status) {
        const s = String(req.query.status).toLowerCase();
        filter.status = s === 'completed' ? 'completed' : { $ne: 'completed' };
      }
    } else if (userRole === 'admin') {
      // Admin sees leads for their own properties + general contact inquiries
      filter = {
        $or: [
          { seller: userId },
          { seller: null },
        ]
      };
      if (req.query.status) {
        const s = String(req.query.status).toLowerCase();
        filter.status = s === 'completed' ? 'completed' : { $ne: 'completed' };
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

    const normalized = enquiries.map(normalizeEnquiry);

    return ApiResponse.success(res, 'Enquiries fetched successfully.', {
      enquiries: normalized,
      leads: normalized,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update enquiry status (Completed / Incompleted)
 * PATCH /api/v1/enquiries/:id/status
 * RBAC:
 * - admin: Allowed (mark completed / incompleted)
 * - super_admin: Allowed
 * - user: Forbidden (users only able to send)
 */
const updateEnquiryStatus = async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body;
    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return ApiResponse.error(res, 'Enquiry not found.', 404);
    }

    const isSeller = enquiry.seller && enquiry.seller.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    const isSuperAdmin = req.user.role === 'super_admin';

    if (!isSeller && !isAdmin && !isSuperAdmin) {
      return ApiResponse.error(res, 'Forbidden: You do not have permission to modify enquiry status.', 403);
    }

    if (status !== undefined) {
      const s = String(status).trim().toLowerCase();
      enquiry.status = s === 'completed' ? 'completed' : 'incompleted';
    }
    if (adminNotes !== undefined) enquiry.adminNotes = adminNotes;

    await enquiry.save();

    await logAudit({
      actor: req.user._id,
      actorRole: req.user.role,
      action: 'UPDATE',
      module: 'ENQUIRY',
      targetId: enquiry._id,
      targetType: 'Enquiry',
      description: `Updated enquiry status to ${enquiry.status}`,
      req,
    }).catch(() => {});

    const normalized = normalizeEnquiry(enquiry);
    return ApiResponse.success(res, `Lead status updated to ${normalized.status}.`, {
      enquiry: normalized,
      lead: normalized,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Full update for SuperAdmin CRUD
 * PUT /api/v3/enquiries/:id
 */
const updateEnquiry = async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) return ApiResponse.error(res, 'Enquiry not found.', 404);

    const { name, email, phone, message, propertyTitle, budget, status, adminNotes } = req.body;
    if (name) enquiry.name = name.trim();
    if (email) enquiry.email = email.trim().toLowerCase();
    if (phone) enquiry.phone = phone.trim();
    if (message) enquiry.message = message.trim();
    if (propertyTitle) enquiry.propertyTitle = propertyTitle.trim();
    if (budget !== undefined) enquiry.budget = budget;
    if (status !== undefined) {
      const s = String(status).trim().toLowerCase();
      enquiry.status = s === 'completed' ? 'completed' : 'incompleted';
    }
    if (adminNotes !== undefined) enquiry.adminNotes = adminNotes;

    await enquiry.save();

    await logAudit({
      actor: req.user._id,
      actorRole: req.user.role,
      action: 'UPDATE',
      module: 'ENQUIRY',
      targetId: enquiry._id,
      targetType: 'Enquiry',
      description: `SuperAdmin updated enquiry details for ${enquiry.name}`,
      req,
    }).catch(() => {});

    const normalized = normalizeEnquiry(enquiry);
    return ApiResponse.success(res, 'Enquiry updated successfully.', {
      enquiry: normalized,
      lead: normalized,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete enquiry for SuperAdmin CRUD
 * DELETE /api/v3/enquiries/:id
 */
const deleteEnquiry = async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) return ApiResponse.error(res, 'Enquiry not found.', 404);

    await logAudit({
      actor: req.user._id,
      actorRole: req.user.role,
      action: 'DELETE',
      module: 'ENQUIRY',
      targetId: req.params.id,
      targetType: 'Enquiry',
      description: `SuperAdmin removed inquiry for ${enquiry.name}`,
      req,
    }).catch(() => {});

    return ApiResponse.success(res, 'Enquiry removed successfully.', {
      deletedId: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEnquiry,
  getMyEnquiries,
  updateEnquiryStatus,
  updateEnquiry,
  deleteEnquiry,
  normalizeEnquiry,
};
