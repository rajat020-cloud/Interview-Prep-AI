const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")
const interviewReportModel = require("../models/interviewReport.model")
const mockInterviewModel = require("../models/mockInterview.model")
const codingPracticeModel = require("../models/codingPractice.model")
const savedQuestionModel = require("../models/savedQuestion.model")
const notificationModel = require("../models/notification.model")

/**
 * Register a new user
 */
async function registerUserController(req, res) {
    try {
        const { username, email, password, fullName, targetRole } = req.body

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Please provide username, email and password"
            })
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long"
            })
        }

        const isUserAlreadyExists = await userModel.findOne({
            $or: [ { username: username.toLowerCase() }, { email: email.toLowerCase() } ]
        })

        if (isUserAlreadyExists) {
            return res.status(400).json({
                message: "Account already exists with this email address or username"
            })
        }

        const hash = await bcrypt.hash(password, 10)

        const user = await userModel.create({
            username: username.toLowerCase().trim(),
            email: email.toLowerCase().trim(),
            password: hash,
            fullName: fullName || username,
            targetRole: targetRole || "Software Engineer",
            streak: 1
        })

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET || "fallback_secret_key_change_in_prod",
            { expiresIn: "1d" }
        )

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 24 * 60 * 60 * 1000
        })

        // Create welcome notification
        await notificationModel.create({
            user: user._id,
            title: "Welcome to Interview Prep AI! 🚀",
            message: "Get started by creating your first personalized interview preparation plan.",
            type: "system",
            link: "/create-interview"
        })

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                status: user.status,
                plan: user.plan,
                targetRole: user.targetRole,
                streak: user.streak,
                preferences: user.preferences
            }
        })
    } catch (err) {
        console.error("Register Error:", err)
        return res.status(500).json({ message: "Registration failed. " + err.message })
    }
}

/**
 * Login user
 */
async function loginUserController(req, res) {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" })
        }

        const user = await userModel.findOne({ email: email.toLowerCase().trim() })

        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" })
        }

        // Update streak logic
        const now = new Date()
        const lastActive = new Date(user.lastActiveAt || now)
        const diffDays = Math.floor((now - lastActive) / (1000 * 60 * 60 * 24))
        
        if (diffDays === 1) {
            user.streak = (user.streak || 0) + 1
        } else if (diffDays > 1) {
            user.streak = 1
        }
        user.lastActiveAt = now
        await user.save()

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET || "fallback_secret_key_change_in_prod",
            { expiresIn: "1d" }
        )

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 24 * 60 * 60 * 1000
        })

        if (["super_admin", "admin", "moderator", "support"].includes(user.role)) {
            res.cookie("admin_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                maxAge: 24 * 60 * 60 * 1000
            })
        }

        return res.status(200).json({
            message: "User logged in successfully",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                status: user.status,
                plan: user.plan,
                targetRole: user.targetRole,
                streak: user.streak,
                preferences: user.preferences
            }
        })
    } catch (err) {
        console.error("Login Error:", err)
        return res.status(500).json({ message: "Login failed. " + err.message })
    }
}

/**
 * Logout user & blacklist active token
 */
async function logoutUserController(req, res) {
    try {
        const token = req.cookies.token

        if (token) {
            await tokenBlacklistModel.create({ token })
        }

        res.clearCookie("token", {
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
        })

        return res.status(200).json({ message: "User logged out successfully" })
    } catch (err) {
        return res.status(500).json({ message: "Logout error. " + err.message })
    }
}

/**
 * Get current logged in user details
 */
async function getMeController(req, res) {
    try {
        const user = await userModel.findById(req.user.id).select("-password")

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        return res.status(200).json({
            message: "User details fetched successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                status: user.status,
                plan: user.plan,
                targetRole: user.targetRole,
                streak: user.streak,
                preferences: user.preferences
            }
        })
    } catch (err) {
        return res.status(500).json({ message: "Failed to fetch user. " + err.message })
    }
}

/**
 * Update user profile
 */
async function updateProfileController(req, res) {
    try {
        const { fullName, targetRole, preferences } = req.body
        const user = await userModel.findById(req.user.id)

        if (!user) return res.status(404).json({ message: "User not found" })

        if (fullName !== undefined) user.fullName = fullName
        if (targetRole !== undefined) user.targetRole = targetRole
        if (preferences) {
            user.preferences = { ...user.preferences, ...preferences }
        }

        await user.save()

        return res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                status: user.status,
                plan: user.plan,
                targetRole: user.targetRole,
                streak: user.streak,
                preferences: user.preferences
            }
        })
    } catch (err) {
        return res.status(500).json({ message: "Update profile failed. " + err.message })
    }
}

/**
 * Change password
 */
async function changePasswordController(req, res) {
    try {
        const { currentPassword, newPassword } = req.body

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Current and new password are required" })
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: "New password must be at least 6 characters" })
        }

        const user = await userModel.findById(req.user.id)
        if (!user) return res.status(404).json({ message: "User not found" })

        const isMatch = await bcrypt.compare(currentPassword, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: "Current password is incorrect" })
        }

        user.password = await bcrypt.hash(newPassword, 10)
        await user.save()

        return res.status(200).json({ message: "Password updated successfully" })
    } catch (err) {
        return res.status(500).json({ message: "Password change failed. " + err.message })
    }
}

/**
 * Delete account with cascade removal of associated data
 */
async function deleteAccountController(req, res) {
    try {
        const userId = req.user.id
        await interviewReportModel.deleteMany({ user: userId })
        await mockInterviewModel.deleteMany({ user: userId })
        await codingPracticeModel.deleteMany({ user: userId })
        await savedQuestionModel.deleteMany({ user: userId })
        await notificationModel.deleteMany({ user: userId })
        await userModel.findByIdAndDelete(userId)

        res.clearCookie("token")
        return res.status(200).json({ message: "Account deleted successfully" })
    } catch (err) {
        return res.status(500).json({ message: "Failed to delete account. " + err.message })
    }
}

module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController,
    updateProfileController,
    changePasswordController,
    deleteAccountController
}
