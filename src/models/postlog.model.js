import mongoose from "mongoose";

const postLogSchema = new mongoose.Schema(
    {
        service: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service",
            required: true,
        },
        platform: {
            type: String,
            enum: ["facebook", "wordpress", "custom", "linkedin", "instagram"],
            required: true,
        },
        status: {
            type: String,
            enum: ["success", "failed"],
            default: "success",
        },
        message: {
            type: String,
            default: "",
        },
        postId: {
            type: String,
            default: null,
        },
        postUrl: {
            type: String,
            default: null,
        },
        scheduledTime: {
            type: Date,
            required: true,
        },
        actualPostedTime: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

export const PostLog = mongoose.model("PostLog", postLogSchema);
