const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const COOKIE = process.env.ROBLOSECURITY;

if (!COOKIE) {
    console.error("Missing ROBLOSECURITY");
    process.exit(1);
}

const client = axios.create({
    validateStatus: () => true
});

async function followUser(userId) {
    const url = `https://friends.roblox.com/v1/users/${userId}/follow`;

    let res = await client.post(url, {}, {
        headers: {
            Cookie: `.ROBLOSECURITY=${COOKIE}`
        }
    });

    let token = res.headers["x-csrf-token"];

    if (res.status === 403 && token) {
        res = await client.post(url, {}, {
            headers: {
                Cookie: `.ROBLOSECURITY=${COOKIE}`,
                "x-csrf-token": token
            }
        });
    }

    return res;
}

app.post("/follow", async (req, res) => {
    try {
        const userId = req.body?.userId;

        if (!userId) {
            return res.status(400).json({ error: "No userId" });
        }

        const response = await followUser(userId);

        console.log("STATUS:", response.status);
        console.log("DATA:", response.data);

        if (response.status === 200 || response.status === 204) {
            return res.json({ success: true });
        }

        return res.status(500).json({
            error: response.data,
            status: response.status
        });

    } catch (err) {
        console.log("CRASH:", err.message);
        return res.status(500).json({ error: err.message });
    }
});

app.get("/", (req, res) => {
    res.send("ok");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("running on", PORT));
