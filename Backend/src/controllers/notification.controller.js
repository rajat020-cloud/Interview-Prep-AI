const notificationModel = require("../models/notification.model")

/**
 * Get user notifications
 */
async function getNotificationsController(req, res) {
    try {
        const notifications = await notificationModel.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .limit(20)

        const unreadCount = await notificationModel.countDocuments({ user: req.user.id, isRead: false })

        return res.status(200).json({ notifications, unreadCount })
    } catch (err) {
        return res.status(500).json({ message: "Failed to fetch notifications: " + err.message })
    }
}

/**
 * Mark notification as read
 */
async function markNotificationReadController(req, res) {
    try {
        const { id } = req.params
        await notificationModel.findOneAndUpdate({ _id: id, user: req.user.id }, { isRead: true })
        return res.status(200).json({ message: "Notification marked as read" })
    } catch (err) {
        return res.status(500).json({ message: "Failed to update notification: " + err.message })
    }
}

/**
 * Mark all notifications as read
 */
async function markAllNotificationsReadController(req, res) {
    try {
        await notificationModel.updateMany({ user: req.user.id, isRead: false }, { isRead: true })
        return res.status(200).json({ message: "All notifications marked as read" })
    } catch (err) {
        return res.status(500).json({ message: "Failed to mark all as read: " + err.message })
    }
}

module.exports = {
    getNotificationsController,
    markNotificationReadController,
    markAllNotificationsReadController
}
