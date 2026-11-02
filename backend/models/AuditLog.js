const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Actor ID is required'],
      index: true,
    },

    actorRole: {
      type: String,
      enum: ['user', 'admin', 'super_admin', 'system'],
      required: true,
    },

    action: {
      type: String,
      required: true,
      trim: true,
      enum: [
        'CREATE',
        'UPDATE',
        'DELETE',
        'LOGIN',
        'LOGOUT',
        'VERIFY',
        'REJECT',
        'APPROVE',
        'BLOCK',
        'UNBLOCK',
        'ROLE_CHANGE',
        'PASSWORD_RESET',
        'ENQUIRY_UPDATE',
        'FEATURE_PROPERTY',
        'PROMOTE_PROPERTY',
      ],
    },

    module: {
      type: String,
      required: true,
      enum: [
        'USER',
        'PROPERTY',
        'ENQUIRY',
        'ADMIN',
        'AUTH',
        'SYSTEM',
      ],
    },

    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    targetModel: {
      type: String,
      enum: ['User', 'Property', 'Enquiry', null],
      default: null,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    oldData: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    newData: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    ipAddress: {
      type: String,
      default: null,
    },

    userAgent: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: ['success', 'failed'],
      default: 'success',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

auditLogSchema.index({
  actor: 1,
  createdAt: -1,
});

auditLogSchema.index({
  module: 1,
  action: 1,
  createdAt: -1,
});

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

module.exports = AuditLog;