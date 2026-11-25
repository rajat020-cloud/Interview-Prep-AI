const mongoose = require("mongoose");

const systemSettingSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true,
        default: "platform_config"
    },
    platformName: {
        type: String,
        default: "Interview Prep AI"
    },
    supportEmail: {
        type: String,
        default: "support@interviewprepai.com"
    },
    maintenanceMode: {
        type: Boolean,
        default: false
    },
    allowNewRegistrations: {
        type: Boolean,
        default: true
    },
    defaultUserPlan: {
        type: String,
        default: "free"
    },
    aiSettings: {
        activeModel: { type: String, default: "gemini-1.5-flash" },
        maxRequestsPerUserDaily: { type: Number, default: 50 },
        generationTimeoutMs: { type: Number, default: 30000 },
        retryAttempts: { type: Number, default: 2 },
        temperature: { type: Number, default: 0.7 }
    },
    securitySettings: {
        maxLoginAttempts: { type: Number, default: 5 },
        sessionTimeoutMinutes: { type: Number, default: 1440 }, // 24 hours
        enforceStrongPasswords: { type: Boolean, default: true }
    },
    lastUpdatedBy: {
        type: String,
        default: "system"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("SystemSetting", systemSettingSchema);
