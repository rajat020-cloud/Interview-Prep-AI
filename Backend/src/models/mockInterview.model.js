const mongoose = require('mongoose');

const mockQuestionSchema = new mongoose.Schema({
    questionText: { type: String, required: true },
    type: { type: String, enum: ["technical", "behavioral"], default: "technical" },
    difficulty: { type: String, default: "Medium" },
    userAnswer: { type: String, default: "" },
    feedback: {
        score: { type: Number, default: 0 },
        technicalAccuracy: { type: Number, default: 0 },
        communication: { type: Number, default: 0 },
        problemSolving: { type: Number, default: 0 },
        keyStrengths: [ String ],
        improvements: [ String ],
        modelAnswer: { type: String, default: "" }
    },
    answeredAt: { type: Date }
}, { _id: true });

const mockInterviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
        index: true
    },
    role: { type: String, default: "Software Engineer" },
    company: { type: String, default: "Tech Company" },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Medium" },
    status: { type: String, enum: ["in_progress", "completed"], default: "in_progress" },
    durationMinutes: { type: Number, default: 15 },
    currentQuestionIndex: { type: Number, default: 0 },
    questions: [ mockQuestionSchema ],
    overallScore: { type: Number, default: 0 },
    summary: { type: String, default: "" }
}, {
    timestamps: true
});

mockInterviewSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("MockInterview", mockInterviewSchema);
