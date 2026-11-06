const AuditLog = require('../models/AuditLog');

/**
 * Utility to record system/user audit logs safely
 */
const logAudit = async ({
  actor,
  actorRole = 'system',
  action,
  module,
  targetId = null,
  targetType = null,
  description,
  changes = null,
  req = null,
  status = 'SUCCESS',
  failureReason = null,
}) => {
  try {
    const ipAddress = req
      ? req.headers['cf-connecting-ip'] ||
        req.headers['x-forwarded-for'] ||
        (req.socket && req.socket.remoteAddress) ||
        req.ip ||
        ''
      : '';
    const userAgent = req ? req.headers['user-agent'] || '' : '';

    await AuditLog.create({
      actor,
      actorRole,
      action,
      module,
      targetId,
      targetType,
      description,
      changes,
      ipAddress,
      userAgent,
      status,
      failureReason,
    });
  } catch (err) {
    // Audit logging failure should not crash main operation
    console.error('AuditLog Error:', err.message);
  }
};

module.exports = { logAudit };
