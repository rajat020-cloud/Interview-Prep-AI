const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [ true, "username already taken" ],
        required: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        unique: [ true, "Account already exists with this email address" ],
        required: true,
        trim: true,
        lowercase: true,
        index: true
    },
    password: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        default: ""
    },
    avatar: {
        type: String,
        default: ""
    },
    targetRole: {
        type: String,
        default: "Software Engineer"
    },
    role: {
        type: String,
        enum: ["user", "admin", "super_admin", "moderator", "support"],
        default: "user",
        index: true
    },
    status: {
        type: String,
        enum: ["active", "suspended"],
        default: "active",
        index: true
    },
    plan: {
        type: String,
        enum: ["free", "pro", "premium"],
        default: "free"
    },
    adminPermissions: {
        type: [String],
        default: []
    },
    lastLoginAt: {
        type: Date,
        default: Date.now
    },
    streak: {
        type: Number,
        default: 1
    },
    lastActiveAt: {
        type: Date,
        default: Date.now
    },
    preferences: {
        theme: { type: String, enum: ["dark", "light"], default: "dark" },
        emailNotifications: { type: Boolean, default: true },
        inAppReminders: { type: Boolean, default: true }
    }
}, {
    timestamps: true
})

const userModel = mongoose.model("users", userSchema)

module.exports = userModel
