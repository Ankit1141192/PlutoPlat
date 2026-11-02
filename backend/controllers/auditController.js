const AuditLog = require('../models/AuditLog');
const ApiResponse = require('../utils/apiResponse');

/**
 * Get audit logs (Super Admin / Admin only)
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

module.exports = {
  getAuditLogs,
};
