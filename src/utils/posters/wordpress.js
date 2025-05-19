import axios from "axios";

/**
 * Post content to WordPress via REST API
 * @param {Object} config - Config for posting
 * @param {string} config.title - Title of the post
 * @param {string} config.content - HTML or plain text content
 * @param {string} config.imageUrl - Public URL of the image (already hosted)
 * @param {string} config.wpUrl - Your WordPress site base URL (e.g., https://example.com)
 * @param {string} config.username - WordPress username
 * @param {string} config.applicationPassword - WordPress application password
 * @returns {Promise<Object>} - Response from WordPress API
 */
export const postToWordPress = async ({
    title,
    content,
    imageUrl,
    wpUrl,
    username,
    applicationPassword,
}) => {
    try {
        const auth = Buffer.from(`${username}:${applicationPassword}`).toString("base64");

        // Step 1: Upload image to media library
        const imageResponse = await axios.post(`${wpUrl}/wp-json/wp/v2/media`, null, {
            headers: {
                Authorization: `Basic ${auth}`,
                "Content-Disposition": `attachment; filename=tagobot-image.jpg`,
                "Content-Type": "image/jpeg",
            },
            params: {
                media_url: imageUrl,
            },
        });

        const featuredMediaId = imageResponse.data.id;

        // Step 2: Create post with image
        const postResponse = await axios.post(`${wpUrl}/wp-json/wp/v2/posts`, {
            title,
            content,
            status: "publish",
            featured_media: featuredMediaId,
        }, {
            headers: {
                Authorization: `Basic ${auth}`,
                "Content-Type": "application/json",
            },
        });

        return {
            success: true,
            postId: postResponse.data.id,
            link: postResponse.data.link,
        };
    } catch (error) {
        console.error("WordPress Post Error:", error.response?.data || error.message);
        return {
            success: false,
            error: error.response?.data || error.message,
        };
    }
};
