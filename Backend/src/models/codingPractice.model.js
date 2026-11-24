const mongoose = require('mongoose');

const codingPracticeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
        index: true
    },
    title: { type: String, required: true },
    topic: { type: String, required: true, default: "Arrays" },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Medium" },
    description: { type: String, required: true },
    examples: [
        {
            input: { type: String, default: "" },
            output: { type: String, default: "" },
            explanation: { type: String, default: "" }
        }
    ],
    hints: [ String ],
    approach: { type: String, default: "" },
    solutionCode: { type: String, default: "" },
    timeComplexity: { type: String, default: "" },
    spaceComplexity: { type: String, default: "" },
    userCode: { type: String, default: "" },
    aiReview: {
        correctnessScore: { type: Number, default: 0 },
        feedback: { type: String, default: "" },
        optimizations: [ String ]
    },
    isCompleted: { type: Boolean, default: false }
}, {
    timestamps: true
});

codingPracticeSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("CodingPractice", codingPracticeSchema);
