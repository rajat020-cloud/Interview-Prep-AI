const mongoose = require("mongoose");

const aiUsageLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        index: true
    },
    userEmail: {
        type: String,
        default: ""
    },
    feature: {
        type: String,
        enum: [
            "interview_generation",
            "technical_questions",
            "behavioral_questions",
            "skill_gap",
            "ai_assistant",
            "mock_interview",
            "resume_optimization",
            "coding_practice",
            "other"
        ],
        required: true,
        index: true
    },
    model: {
        type: String,
        default: "gemini-1.5-flash"
    },
    promptTokens: {
        type: Number,
        default: 0
    },
    responseTokens: {
        type: Number,
        default: 0
    },
    totalTokens: {
        type: Number,
        default: 0
    },
    estimatedCost: {
        type: Number,
        default: 0
    },
    latencyMs: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ["success", "error"],
        default: "success",
        index: true
    },
    errorMessage: {
        type: String,
        default: ""
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true
});

aiUsageLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model("AiUsageLog", aiUsageLogSchema);
