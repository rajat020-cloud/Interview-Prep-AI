const savedQuestionModel = require("../models/savedQuestion.model")

/**
 * Save / Bookmark an interview question
 */
async function saveQuestionController(req, res) {
    try {
        const { question, type, difficulty, intention, answer, company, sourceReportId, tags, notes } = req.body

        if (!question || !answer) {
            return res.status(400).json({ message: "Question and answer are required." })
        }

        const saved = await savedQuestionModel.create({
            user: req.user.id,
            question,
            type: type || "technical",
            difficulty: difficulty || "Medium",
            intention: intention || "",
            answer,
            company: company || "General",
            sourceReportId: sourceReportId || null,
            tags: tags || [],
            notes: notes || ""
        })

        return res.status(201).json({
            message: "Question saved successfully",
            savedQuestion: saved
        })
    } catch (err) {
        return res.status(500).json({ message: "Failed to save question: " + err.message })
    }
}

/**
 * Get all saved questions for user
 */
async function getSavedQuestionsController(req, res) {
    try {
        const { type, q } = req.query
        const filter = { user: req.user.id }

        if (type && type !== "all") {
            filter.type = type
        }

        if (q && q.trim()) {
            filter.$or = [
                { question: { $regex: q.trim(), $options: "i" } },
                { company: { $regex: q.trim(), $options: "i" } },
                { answer: { $regex: q.trim(), $options: "i" } }
            ]
        }

        const questions = await savedQuestionModel.find(filter).sort({ createdAt: -1 })
        return res.status(200).json({ questions })
    } catch (err) {
        return res.status(500).json({ message: "Failed to fetch saved questions: " + err.message })
    }
}

/**
 * Delete a saved question
 */
async function deleteSavedQuestionController(req, res) {
    try {
        const { id } = req.params
        const deleted = await savedQuestionModel.findOneAndDelete({ _id: id, user: req.user.id })

        if (!deleted) {
            return res.status(404).json({ message: "Question not found or unauthorized." })
        }

        return res.status(200).json({ message: "Question deleted successfully." })
    } catch (err) {
        return res.status(500).json({ message: "Failed to delete question: " + err.message })
    }
}

module.exports = {
    saveQuestionController,
    getSavedQuestionsController,
    deleteSavedQuestionController
}
