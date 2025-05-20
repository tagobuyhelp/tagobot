import mongoose from "mongoose";
import { Platform } from "./platform.model.js";

const credentialSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        platform: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Platform",
            required: true,
        },
        label: {
            type: String,
            default: "",
        },
        config: {
            type: mongoose.Schema.Types.Mixed,
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

// Validate that the config matches the platform's configTemplate
credentialSchema.pre('save', async function(next) {
    const platform = await Platform.findById(this.platform);
    if (!platform) {
        return next(new Error('Invalid platform'));
    }

    const configTemplate = platform.configTemplate;
    const config = this.config;

    // Check if all required fields from configTemplate are present in config
    for (let key in configTemplate) {
        if (!(key in config)) {
            return next(new Error(`Missing required config field: ${key}`));
        }
    }

    // Check if there are any extra fields in config that are not in configTemplate
    for (let key in config) {
        if (!(key in configTemplate)) {
            return next(new Error(`Unexpected config field: ${key}`));
        }
    }

    next();
});

export const Credential = mongoose.model("Credential", credentialSchema);



