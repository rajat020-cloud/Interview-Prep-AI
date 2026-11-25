const mongoose = require("mongoose");

const cmsContentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    type: {
        type: String,
        enum: ["question_category", "announcement", "faq", "roadmap_template", "learning_resource"],
        required: true,
        index: true
    },
    category: {
        type: String,
        default: "General"
    },
    content: {
        type: String,
        default: ""
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    authorName: {
        type: String,
        default: "Admin"
    }
}, {
    timestamps: true
});

cmsContentSchema.index({ type: 1, isPublished: 1 });

module.exports = mongoose.model("CmsContent", cmsContentSchema);
