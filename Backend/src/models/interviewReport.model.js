const mongoose = require('mongoose');

const technicalQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [ true, "Technical question is required" ]
    },
    difficulty: {
        type: String,
        enum: [ "Easy", "Medium", "Hard" ],
        default: "Medium"
    },
    intention: {
        type: String,
        required: [ true, "Intention is required" ]
    },
    answer: {
        type: String,
        required: [ true, "Answer is required" ]
    },
    keyConcepts: [ String ],
    followUps: [ String ],
    commonMistakes: [ String ]
}, {
    _id: true
})

const behavioralQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [ true, "Behavioral question is required" ]
    },
    intention: {
        type: String,
        required: [ true, "Intention is required" ]
    },
    answer: {
        type: String,
        required: [ true, "Answer is required" ]
    },
    evaluationCriteria: [ String ],
    followUps: [ String ]
}, {
    _id: true
})

const skillGapSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: [ true, "Skill is required" ]
    },
    severity: {
        type: String,
        enum: [ "low", "medium", "high" ],
        required: [ true, "Severity is required" ]
    },
    whyItMatters: {
        type: String,
        default: ""
    },
    recommendedAction: {
        type: String,
        default: ""
    }
}, {
    _id: true
})

const taskItemSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    }
}, {
    _id: true
})

const preparationPlanSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: [ true, "Day is required" ]
    },
    focus: {
        type: String,
        required: [ true, "Focus is required" ]
    },
    tasks: [ taskItemSchema ]
}, {
    _id: true
})

const interviewReportSchema = new mongoose.Schema({
    jobDescription: {
        type: String,
        required: [ true, "Job description is required" ]
    },
    resume: {
        type: String,
        default: ""
    },
    selfDescription: {
        type: String,
        default: ""
    },
    title: {
        type: String,
        required: [ true, "Job title is required" ]
    },
    company: {
        type: String,
        default: "Target Company"
    },
    matchScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 75
    },
    matchBreakdown: {
        technicalSkills: { type: Number, default: 80 },
        experience: { type: Number, default: 75 },
        education: { type: Number, default: 85 },
        projectRelevance: { type: Number, default: 80 },
        keywordAlignment: { type: Number, default: 85 }
    },
    keyInsights: [ String ],
    overallAssessment: {
        type: String,
        default: ""
    },
    technicalQuestions: [ technicalQuestionSchema ],
    behavioralQuestions: [ behavioralQuestionSchema ],
    skillGaps: [ skillGapSchema ],
    preparationPlan: [ preparationPlanSchema ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
        index: true
    },
    isBookmarked: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

interviewReportSchema.index({ user: 1, createdAt: -1 });

const interviewReportModel = mongoose.model("InterviewReport", interviewReportSchema);

module.exports = interviewReportModel;
