import axios from "axios";

export const generateTextFromAI = async (instruction) => {
    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content: "You are a professional social media content writer.",
                    },
                    {
                        role: "user",
                        content: instruction,
                    },
                ],
                temperature: 0.7,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                },
            }
        );

        return response.data.choices[0].message.content.trim();
    } catch (err) {
        console.error("❌ OpenAI error:", err.response?.data || err.message);
        return "Tagobuy offers professional IT services to boost your business.";
    }
};
