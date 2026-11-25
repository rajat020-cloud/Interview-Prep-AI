const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");

const {
    authenticateAdmin,
    requireRoles,
    requirePermission
} = require("../middlewares/admin.middleware");

const adminController = require("../controllers/admin.controller");

// Strict rate limiter for Admin Login
const adminAuthLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { message: "Too many admin login attempts. Please try again after 15 minutes." }
});

// ==========================================
// 1. PUBLIC ADMIN AUTH ROUTE
// ==========================================
router.post("/login", adminAuthLimiter, adminController.adminLoginController);

// All subsequent routes require Admin Authentication
router.use(authenticateAdmin);

// ==========================================
// 2. ADMIN SESSION & PROFILE
// ==========================================
router.get("/me", adminController.getAdminProfileController);
router.post("/logout", adminController.adminLogoutController);

// ==========================================
// 3. DASHBOARD METRICS
// ==========================================
router.get("/dashboard", adminController.getDashboardMetricsController);

// ==========================================
// 4. USER MANAGEMENT
// ==========================================
router.get("/users", adminController.listUsersController);
router.get("/users/export/csv", adminController.exportUsersCsvController);
router.get("/users/:id", adminController.getUserDetailsController);
router.patch("/users/:id/status", requireRoles("super_admin", "admin"), adminController.toggleUserStatusController);
router.patch("/users/:id/role", requireRoles("super_admin"), adminController.updateUserRoleController);
router.patch("/users/:id/plan", requireRoles("super_admin", "admin"), adminController.updateUserPlanController);
router.delete("/users/:id", requireRoles("super_admin"), adminController.deleteUserController);

// ==========================================
// 5. INTERVIEWS & MOCKS MANAGEMENT
// ==========================================
router.get("/interviews", adminController.listInterviewsController);
router.delete("/interviews/:id", requireRoles("super_admin", "admin"), adminController.deleteInterviewController);

router.get("/mock-interviews", adminController.listMockInterviewsController);
router.delete("/mock-interviews/:id", requireRoles("super_admin", "admin"), adminController.deleteMockInterviewController);

// ==========================================
// 6. AI ENGINE MANAGEMENT & TELEMETRY
// ==========================================
router.get("/ai/metrics", adminController.getAiMetricsController);
router.patch("/ai/config", requireRoles("super_admin"), adminController.updateAiConfigController);

// ==========================================
// 7. SUBSCRIPTION PLANS
// ==========================================
router.get("/plans", adminController.listPlansController);
router.put("/plans/:id", requireRoles("super_admin"), adminController.updatePlanController);

// ==========================================
// 8. SUPPORT TICKETS
// ==========================================
router.get("/support", adminController.listTicketsController);
router.post("/support/:id/reply", adminController.replyTicketController);
router.patch("/support/:id/status", adminController.updateTicketStatusController);

// ==========================================
// 9. SYSTEM SETTINGS & AUDIT LOGS
// ==========================================
router.get("/settings", adminController.getSystemSettingsController);
router.patch("/settings", requireRoles("super_admin"), adminController.updateSystemSettingsController);

router.get("/audit-logs", requireRoles("super_admin", "admin"), adminController.listAuditLogsController);

module.exports = router;
