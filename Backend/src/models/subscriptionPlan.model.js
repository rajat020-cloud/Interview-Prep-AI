const mongoose = require("mongoose");

const subscriptionPlanSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    code: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    description: {
        type: String,
        default: ""
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    billingInterval: {
        type: String,
        enum: ["monthly", "yearly", "lifetime"],
        default: "monthly"
    },
    limits: {
        interviewGenerationsPerMonth: { type: Number, default: 5 },
        mockInterviewsPerMonth: { type: Number, default: 3 },
        resumeOptimizationsPerMonth: { type: Number, default: 2 },
        aiAssistantQueriesPerDay: { type: Number, default: 15 }
    },
    features: [
        { type: String }
    ],
    isActive: {
        type: Boolean,
        default: true
    },
    subscribersCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("SubscriptionPlan", subscriptionPlanSchema);
