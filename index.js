const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const ROBLOSECURITY = process.env.ROBLOSECURITY;

if (!ROBLOSECURITY) {
    console.error("ROBLOSECURITY is missing");
    process.exit(1);
}

async function getCsrfToken() {
    try {
        await axios.post("https://auth.roblox.com/v2/logout", {}, {
            headers: {
                Cookie: `.ROBLOSECURITY=${ROBLOSECURITY}`
            }
        });
    } catch (e) {
        const token = e.response?.headers["x-csrf-token"];
        if (!token) {
            throw new Error("Failed to get CSRF token");
        }
        return token;
    }
}

app.post("/follow", async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: "No userId" });
    }

    try {
        let csrfToken = await getCsrfToken();

        async function sendFollow(token) {
            return axios.post(
                `https://friends.roblox.com/v1/users/${userId}/follow`,
                {},
                {
                    headers: {
                        Cookie: `.ROBLOSECURITY=${ROBLOSECURITY}`,
                        "x-csrf-token": token,
                        "Content-Type": "application/json"
                    }
                }
            );
        }

        try {
            await sendFollow(csrfToken);
        } catch (err) {
            const newToken = err.response?.headers["x-csrf-token"];

            if (newToken) {
                console.log("Retrying with new CSRF token");
                await sendFollow(newToken);
            } else {
                throw err;
            }
        }

        console.log("Followed:", userId);
        res.json({ success: true });

    } catch (err) {
        console.error("ERROR:");
        console.error(err.response?.data || err.message);

        res.status(500).json({
            error: err.response?.data || err.message
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Running on port", PORT);
});
