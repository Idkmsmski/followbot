const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const COOKIE = "_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_CAEaAhADIhsKBGR1aWQSEzM2MTkyNzQ2MzM2MDQxNzEyNDIoAw.HjFvd8ZDwnjTujfEgrdwsdrWmOYTHRBafZkFcYGNBJCAGEiCTdhvXToVksxTdAzltSRzytvZvJtnSS0_i7oUhISlFylyH5R_Y9hmo-_Xz2GeK4DfYHLwg6H3yAnm1z_FXVrnav_kQYTpYN9DLDk8K1_ZN2fk6J26ddPwuA0eiJxjK7EXncgu5TjmoWFljzh2p8958QMdtjZbSiCEWpGvbl005diRtkWaBNnHJqLRWCBrPxbvb-_umuGZNEgT-k0-HaV7kRztD-HdKZW6D128MObmiW2Pn2rRNqfFWNWlslsGR_TQUkRm9alUsQXoWeJ5zFFvPiya3GF7WKHvU2v_l2iVOQ0gIpypRFn9MNqFRb2BidzeZFFbSbTe1wuIz1cmp_EAkBe7iwHPCLughBFy3ODRBd69vx_tF2E2o2m30PdxGqJmLQJAdpwcIJCbzl0h-az55sONOQTtfKt0kNXQ12GuqTCWFgR9hgCanf6UBtCwUrCikFivv-Hx5kShyakO707g_N74f36I3X6Qgz-9qqvxJ9jyAZoNxi-7gIzyjG7Ebwi0Dtfd6UvaJrQwL6ty8-F-_--X-nfBtBZtB8iLswWS09ElxJFm_JgvCPlZWOHQBnjQRroVy1OioHepzBNl5waqfcsNBsxjyojmQDpAkv63ihV6O2Ef0p50o8JP1pAkjQhs44KU9lwSIplGHnOTDiZP2_wqPT7zVJbWqS7gn8Gr9Qx1YWTn-miX17k0WsBKM5k06qol8ZZku2LcAd1lv114_YdAQpqNstJ6MOSl3QtxMBLKbGHjWZZCfML6hM6r_zYpgaoTZuiKRxAx8uv-DfcPY63Nzbg8ir6nZLtTnpfYqlcVH5r6XRQLeX0ykm9pR2tyW2NJFitdUOQ7J-HmfttNBA"; 

const client = axios.create({
    validateStatus: () => true,
    timeout: 10000, 
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Referer': 'https://www.roblox.com/'
    }
});

async function followUser(userId) {
    const url = `https://friends.roblox.com/v1/users/${userId}/follow`;
    const cookieHeader = `.ROBLOSECURITY=${COOKIE}`;

    let res = await client.post(url, {}, {
        headers: { "Cookie": cookieHeader }
    });

    let token = res.headers["x-csrf-token"];

    if (res.status === 403 && token) {
        res = await client.post(url, {}, {
            headers: {
                "Cookie": cookieHeader,
                "x-csrf-token": token
            }
        });
    }

    return res;
}

app.post("/follow", async (req, res) => {
    console.log("--- New Request Received ---");
    try {
        const userId = req.body?.userId;
        if (!userId) return res.status(400).json({ error: "No userId" });

        console.log(`Step 1: Contacting Roblox for User ${userId}...`);
        
        const response = await followUser(userId).catch(err => {
            console.error("Axios Internal Error:", err.message);
            return { status: 500, data: err.message };
        });

        console.log("Step 2: Roblox responded with status:", response.status);

        if (response.status === 200 || response.status === 204) {
            console.log("Step 3: Success!");
            return res.json({ success: true });
        }

        console.log("Step 3: Failed with data:", response.data);
        return res.status(response.status || 500).json({
            error: "Roblox rejected request",
            robloxStatus: response.status,
            details: response.data
        });

    } catch (err) {
        console.error("CRITICAL CRASH:", err);
        return res.status(500).json({ error: "Server Crashed", message: err.message });
    }
});

app.get("/", (req, res) => res.send("Bot is alive."));

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on 0.0.0.0:${PORT}`);
});
