const { Router } = require('express')
const authController = require("../controllers/auth.controller")
const authMiddleware = require("../middlewares/auth.middleware")

const authRouter = Router()

/**
 * Public routes
 */
authRouter.post("/register", authController.registerUserController)
authRouter.post("/login", authController.loginUserController)
authRouter.get("/logout", authController.logoutUserController)

/**
 * Protected routes
 */
authRouter.get("/get-me", authMiddleware.authUser, authController.getMeController)
authRouter.patch("/profile", authMiddleware.authUser, authController.updateProfileController)
authRouter.patch("/change-password", authMiddleware.authUser, authController.changePasswordController)
authRouter.delete("/account", authMiddleware.authUser, authController.deleteAccountController)

module.exports = authRouter
