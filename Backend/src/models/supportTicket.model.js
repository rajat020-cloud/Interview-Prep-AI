const mongoose = require("mongoose");

const supportMessageSchema = new mongoose.Schema({
    sender: {
        type: String,
        enum: ["user", "admin"],
        required: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    senderName: {
        type: String,
        default: ""
    },
    message: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { _id: true });

const supportTicketSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
        index: true
    },
    userEmail: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        default: ""
    },
    subject: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ["general", "technical", "billing", "interview_prep", "bug_report", "feature_request"],
        default: "general"
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high", "critical"],
        default: "medium"
    },
    status: {
        type: String,
        enum: ["open", "in_progress", "resolved", "closed"],
        default: "open",
        index: true
    },
    messages: [ supportMessageSchema ],
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    resolutionNotes: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
});

supportTicketSchema.index({ createdAt: -1 });

module.exports = mongoose.model("SupportTicket", supportTicketSchema);
