import { postToFacebook } from "./facebook.js";
import { postToWordPress } from "./wordpress.js";

export const postToPlatform = async (platform, postData) => {
    switch (platform.type) {
        case "facebook":
            return await postToFacebook(platform.credentials, postData);

        case "wordpress":
            return await postToWordPress(platform.credentials, postData);

        default:
            console.warn(`⚠️ Unknown platform type: ${platform.type}`);
    }
};
