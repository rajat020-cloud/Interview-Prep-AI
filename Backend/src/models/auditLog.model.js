const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema({
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    adminEmail: {
        type: String,
        required: true,
        index: true
    },
    adminRole: {
        type: String,
        default: "admin"
    },
    action: {
        type: String,
        required: true,
        index: true
    },
    target: {
        type: String,
        default: ""
    },
    targetModel: {
        type: String,
        default: ""
    },
    details: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    ipAddress: {
        type: String,
        default: "127.0.0.1"
    },
    userAgent: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        enum: ["success", "failure"],
        default: "success"
    }
}, {
    timestamps: true
});

auditLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model("AuditLog", auditLogSchema);
