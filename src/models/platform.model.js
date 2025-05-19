import mongoose from "mongoose";

const platformSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            enum: ["facebook", "wordpress", "linkedin", "instagram", "custom"],
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        config: {
            type: mongoose.Schema.Types.Mixed, // Store API tokens, URLs, keys, etc.
            default: {},
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        notes: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

export const Platform = mongoose.model("Platform", platformSchema);
