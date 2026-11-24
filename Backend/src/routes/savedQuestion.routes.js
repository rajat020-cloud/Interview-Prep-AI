const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const savedQuestionController = require("../controllers/savedQuestion.controller")

const router = express.Router()

router.post("/", authMiddleware.authUser, savedQuestionController.saveQuestionController)
router.get("/", authMiddleware.authUser, savedQuestionController.getSavedQuestionsController)
router.delete("/:id", authMiddleware.authUser, savedQuestionController.deleteSavedQuestionController)

module.exports = router
