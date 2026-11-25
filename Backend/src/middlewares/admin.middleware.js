const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const tokenBlacklistModel = require("../models/blacklist.model");

/**
 * Primary Admin Authentication Middleware
 * Enforces role checks and account status verification
 */
async function authenticateAdmin(req, res, next) {
    try {
        let token = req.cookies.admin_token || req.cookies.token;

        if (!token && req.headers.authorization) {
            const authHeader = req.headers.authorization;
            if (authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
            }
        }

        if (!token) {
            return res.status(401).json({
                message: "Authentication required. Admin token missing."
            });
        }

        const isBlacklisted = await tokenBlacklistModel.findOne({ token });
        if (isBlacklisted) {
            return res.status(401).json({
                message: "Session expired or invalidated. Please login again."
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret_key_change_in_prod");
        const adminUser = await userModel.findById(decoded.id).select("-password");

        if (!adminUser) {
            return res.status(401).json({
                message: "Admin account not found."
            });
        }

        if (adminUser.status === "suspended") {
            return res.status(403).json({
                message: "This administrator account has been suspended."
            });
        }

        const allowedRoles = ["super_admin", "admin", "moderator", "support"];
        if (!allowedRoles.includes(adminUser.role)) {
            return res.status(403).json({
                message: "Access denied. Insufficient administrative privileges."
            });
        }

        req.admin = adminUser;
        req.user = adminUser; // compatible with existing handlers
        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Admin session expired. Please re-login." });
        }
        return res.status(401).json({ message: "Invalid admin authorization token." });
    }
}

/**
 * Granular Role Guard
 */
function requireRoles(...roles) {
    return (req, res, next) => {
        if (!req.admin) {
            return res.status(401).json({ message: "Unauthorized." });
        }
        if (req.admin.role === "super_admin" || roles.includes(req.admin.role)) {
            return next();
        }
        return res.status(403).json({
            message: `Action requires one of the following roles: [${roles.join(", ")}]. Your role is ${req.admin.role}.`
        });
    };
}

/**
 * Granular Permission Guard
 */
function requirePermission(permission) {
    return (req, res, next) => {
        if (!req.admin) {
            return res.status(401).json({ message: "Unauthorized." });
        }
        if (req.admin.role === "super_admin") {
            return next();
        }
        const userPerms = req.admin.adminPermissions || [];
        if (userPerms.includes("*") || userPerms.includes(permission)) {
            return next();
        }
        return res.status(403).json({
            message: `Missing required permission: ${permission}`
        });
    };
}

module.exports = {
    authenticateAdmin,
    requireRoles,
    requirePermission
};
