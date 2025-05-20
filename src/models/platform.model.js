import mongoose from "mongoose";

const platformSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            enum: ["facebook", "wordpress", "linkedin", "instagram", "custom"],
            required: true,
            unique: true,
        },
        description: {
            type: String,
            default: "",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        configTemplate: {
            type: mongoose.Schema.Types.Mixed, // Template for required config fields
            default: {},
        },
    },
    { timestamps: true }
);

platformSchema.statics.initializePlatforms = async function() {
    const platforms = [
        { name: "facebook", description: "Facebook social media platform", configTemplate: { accessToken: "", pageId: "" } },
        { name: "wordpress", description: "WordPress blogging platform", configTemplate: { url: "", username: "", password: "" } },
        { name: "linkedin", description: "LinkedIn professional network", configTemplate: { accessToken: "" } },
        { name: "instagram", description: "Instagram social media platform", configTemplate: { accessToken: "" } },
        { name: "custom", description: "Custom platform", configTemplate: {} }
    ];

    for (let platform of platforms) {
        await this.findOneAndUpdate({ name: platform.name }, platform, { upsert: true, new: true });
    }
};

export const Platform = mongoose.model("Platform", platformSchema);
Platform.initializePlatforms(); // Run the static method to initialize platforms on app startup.