const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

const ROBLOSECURITY = process.env.ROBLOSECURITY;

app.post("/follow", async (req, res) => {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "No userId" });

    try {
        let csrfToken = "";
        try {
            await axios.post("https://auth.roblox.com/v2/logout", {}, {
                headers: { Cookie: `.ROBLOSECURITY=${ROBLOSECURITY}` }
            });
        } catch (e) {
            csrfToken = e.response?.headers["x-csrf-token"] || "";
        }

        await axios.post(`https://friends.roblox.com/v1/users/${userId}/follow`, {}, {
            headers: {
                Cookie: `.ROBLOSECURITY=${ROBLOSECURITY}`,
                "x-csrf-token": csrfToken,
                "Content-Type": "application/json"
            }
        });

        console.log(`Followed ${userId}`);
        res.json({ success: true });
    } catch (err) {
        console.error(err.response?.data || err.message);
        res.status(500).json({ error: "Failed" });
    }
});

app.listen(3000, () => console.log("Running on port 3000"));
