export const postToFacebook = async (creds, { text, image }) => {
    try {
        const url = `https://graph.facebook.com/${creds.pageId}/photos`;
        const params = new URLSearchParams();
        params.append("url", image);
        params.append("caption", text);
        params.append("access_token", creds.accessToken);

        const res = await fetch(url, {
            method: "POST",
            body: params,
        });

        const data = await res.json();
        if (data.id) {
            console.log("✅ Posted to Facebook:", data.id);
        } else {
            console.error("❌ Facebook error:", data);
        }
    } catch (err) {
        console.error("❌ Facebook posting failed:", err.message);
    }
};
