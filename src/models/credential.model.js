import mongoose from "mongoose";

const credentialSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        platform: {
            type: String,
            enum: ["facebook", "wordpress", "linkedin", "instagram", "custom"],
            required: true,
        },
        label: {
            type: String,
            default: "",
        },
        credentials: {
            type: mongoose.Schema.Types.Mixed, // API keys, tokens, etc.
            required: true,
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
    {
        timestamps: true,
    }
);

export const Credential = mongoose.model("Credential", credentialSchema);
