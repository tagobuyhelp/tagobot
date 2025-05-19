import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: true,
        unique: true, // One schedule per service
    },
    days: [
        {
            type: String,
            enum: [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
            ],
        },
    ],
    time: {
        type: String,
        required: true,
        // Format: "HH:MM" in 24-hour format (e.g., "14:30" for 2:30 PM)
    },
    timezone: {
        type: String,
        default: "Asia/Kolkata", // Or use Intl defaults as per your location
    },
    isEnabled: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

export const Schedule = mongoose.model("Schedule", scheduleSchema);
