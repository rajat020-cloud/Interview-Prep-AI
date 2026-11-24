const codingPracticeModel = require("../models/codingPractice.model")
const { generateCodingChallenge, reviewCodingSolution } = require("../services/ai.service")

/**
 * Generate a new coding challenge
 */
async function generateChallengeController(req, res) {
    try {
        const { topic = "Arrays", difficulty = "Medium" } = req.body

        const challengeData = await generateCodingChallenge({ topic, difficulty })

        const challenge = await codingPracticeModel.create({
            user: req.user.id,
            ...challengeData
        })

        return res.status(201).json({
            message: "Coding challenge generated",
            challenge
        })
    } catch (err) {
        console.error("Coding Challenge Error:", err)
        return res.status(500).json({ message: "Failed to generate challenge: " + err.message })
    }
}

/**
 * Submit code for AI review
 */
async function submitCodeReviewController(req, res) {
    try {
        const { challengeId } = req.params
        const { userCode } = req.body

        const challenge = await codingPracticeModel.findOne({ _id: challengeId, user: req.user.id })
        if (!challenge) return res.status(404).json({ message: "Challenge not found." })

        const review = await reviewCodingSolution({
            problemTitle: challenge.title,
            problemDescription: challenge.description,
            userCode
        })

        challenge.userCode = userCode
        challenge.aiReview = review
        challenge.isCompleted = review.correctnessScore >= 70
        await challenge.save()

        return res.status(200).json({
            message: "Code reviewed successfully",
            challenge
        })
    } catch (err) {
        return res.status(500).json({ message: "Failed to review code: " + err.message })
    }
}

/**
 * Get coding practice history
 */
async function getCodingHistoryController(req, res) {
    try {
        const history = await codingPracticeModel.find({ user: req.user.id }).sort({ createdAt: -1 })
        return res.status(200).json({ history })
    } catch (err) {
        return res.status(500).json({ message: "Failed to fetch coding history: " + err.message })
    }
}

module.exports = {
    generateChallengeController,
    submitCodeReviewController,
    getCodingHistoryController
}
