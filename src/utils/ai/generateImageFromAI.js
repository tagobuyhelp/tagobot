import axios from "axios";
import FormData from "form-data";

export const generateImageFromAI = async (prompt) => {
    try {
        const form = new FormData();
        form.append("prompt", prompt);
        form.append("rendering_speed", "TURBO");

        const response = await axios.post("https://api.ideogram.ai/v1/ideogram-v3/generate", form, {
            headers: {
                "Api-Key": process.env.IDEOGRAM_API_KEY,
                ...form.getHeaders(),
            },
        });

        const imageUrl = response.data?.data?.[0]?.url;
        return imageUrl;
    } catch (err) {
        console.error("❌ Ideogram error:", err.response?.data || err.message);
        return null;
    }
};
