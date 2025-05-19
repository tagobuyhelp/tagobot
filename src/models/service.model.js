import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
    },
    platforms: [
        {
            type: String, // e.g., 'facebook', 'wordpress', 'instagram'
            enum: ['facebook', 'wordpress', 'instagram', 'linkedin', 'twitter'],
        },
    ],
    postInstructions: {
        type: String, // For example: "Write a friendly post about this service"
    },
    imagePromptTemplate: {
        type: String, // For example: "A modern design representing [service name]"
    },
    schedule: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Schedule", // Link to schedule settings
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    lastPostedAt: {
        type: Date,
    }
}, { timestamps: true });

export const Service = mongoose.model("Service", serviceSchema);
