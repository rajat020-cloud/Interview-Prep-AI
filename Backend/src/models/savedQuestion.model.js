const mongoose = require('mongoose');

const savedQuestionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
        index: true
    },
    question: { type: String, required: true },
    type: { type: String, enum: ["technical", "behavioral", "coding"], default: "technical" },
    difficulty: { type: String, default: "Medium" },
    intention: { type: String, default: "" },
    answer: { type: String, required: true },
    company: { type: String, default: "General" },
    sourceReportId: { type: mongoose.Schema.Types.ObjectId, ref: "InterviewReport" },
    tags: [ String ],
    notes: { type: String, default: "" }
}, {
    timestamps: true
});

savedQuestionSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("SavedQuestion", savedQuestionSchema);
