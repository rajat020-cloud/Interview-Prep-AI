const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const notificationController = require("../controllers/notification.controller")

const router = express.Router()

router.get("/", authMiddleware.authUser, notificationController.getNotificationsController)
router.patch("/:id/read", authMiddleware.authUser, notificationController.markNotificationReadController)
router.patch("/read-all", authMiddleware.authUser, notificationController.markAllNotificationsReadController)

module.exports = router
