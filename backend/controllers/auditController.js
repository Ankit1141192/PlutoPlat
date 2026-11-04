const AuditLog = require('../models/AuditLog');
const Property = require('../models/Property');
const User = require('../models/User');
const Enquiry = require('../models/Enquiry');
const ApiResponse = require('../utils/apiResponse');

/**
 * Get audit logs (SuperAdmin only)
 * GET /api/v1/audits
 */
const getAuditLogs = async (req, res, next) => {
  try {
    const { module, action, status, page = 1, limit = 20 } = req.query;

    const query = {};
    if (module) query.module = module;
    if (action) query.action = action;
    if (status) query.status = status;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [logs, total] = await Promise.all([
      AuditLog.find(query)
        .populate('actor', 'name email role')
        .skip(skip)
        .limit(limitNum)
        .sort({ createdAt: -1 }),
      AuditLog.countDocuments(query),
    ]);

    return ApiResponse.success(res, 'Audit logs fetched successfully.', {
      logs,
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
 * Get platform analytics & intelligence telemetry (SuperAdmin only)
 * GET /api/v1/audits/analytics
 */
const getPlatformAnalytics = async (req, res, next) => {
  try {
    const [
      totalProperties,
      activeProperties,
      pendingProperties,
      rejectedProperties,
      totalUsers,
      buyerCount,
      adminCount,
      superAdminCount,
      totalLeads,
      valuationAgg,
      cityAgg,
    ] = await Promise.all([
      Property.countDocuments(),
      Property.countDocuments({ status: 'active' }),
      Property.countDocuments({ status: 'pending' }),
      Property.countDocuments({ status: 'rejected' }),
      User.countDocuments(),
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'admin' }),
      User.countDocuments({ role: 'super_admin' }),
      Enquiry.countDocuments(),
      Property.aggregate([
        { $group: { _id: null, totalValuation: { $sum: '$price' }, avgPrice: { $avg: '$price' } } },
      ]),
      Property.aggregate([
        { $group: { _id: '$location.city', count: { $sum: 1 }, totalValuation: { $sum: '$price' } } },
        { $sort: { count: -1 } },
        { $limit: 6 },
      ]),
    ]);

    const totalValuation = valuationAgg.length > 0 ? valuationAgg[0].totalValuation : 0;
    const avgPrice = valuationAgg.length > 0 ? Math.round(valuationAgg[0].avgPrice) : 0;

    return ApiResponse.success(res, 'Platform analytics retrieved successfully.', {
      analytics: {
        properties: {
          total: totalProperties,
          active: activeProperties,
          pending: pendingProperties,
          rejected: rejectedProperties,
          totalValuation,
          avgPrice,
        },
        users: {
          total: totalUsers,
          buyers: buyerCount,
          admins: adminCount,
          superAdmins: superAdminCount,
        },
        leads: {
          total: totalLeads,
        },
        topCities: cityAgg.map((c) => ({
          city: c._id || 'Unknown',
          count: c.count,
          valuation: c.totalValuation,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAuditLogs,
  getPlatformAnalytics,
};
