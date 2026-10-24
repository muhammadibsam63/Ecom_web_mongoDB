import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    action: {
      type: String,
      required: true,
    },
    resource: {
      type: String,
      required: true,
    },
    resourceId: mongoose.Schema.Types.ObjectId,
    details: mongoose.Schema.Types.Mixed,
    ipAddress: String,
    userAgent: String,
  },
  {
    timestamps: true,
  }
);

auditLogSchema.index({ user: 1, createdAt: -1 });
auditLogSchema.index({ resource: 1, resourceId: 1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ createdAt: -1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;
