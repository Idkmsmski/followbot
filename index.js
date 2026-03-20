const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const COOKIE = "_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_CAEaAhADIhsKBGR1aWQSEzM2MTkyNzQ2MzM2MDQxNzEyNDIoAw.LkgDLMsf2S3Geyq97wHNzsqKJUdBimAokJCnG2YfdUxIN2IuMbcy-Q6K6QyxgfTppk25u123RsWg3PSiuYdQ_se4JCnkBMpBpGb6lGfjn76zhzAMQwv50UvqYrbdr604gzfdy9k-N_l6bX4haMCaAPLkOihtu8BTzf6ifBADbwp1w_wzvYmdnwFmKh_wJTyhx0FLI5U1uxAUuFcXpTqAkgr7yydoIB0B_pBWoT51UwcRKT8FUPeCrZuNbnMxbaiuGsL1hMVEcjsPw-tgsC6acOe105K64WjQd10OXFg5ZhWP85RHaYIuvzAflheF2xyqM1AncOuFBcnbpRuFzg7ryOm_Ib9ewAmZS7H5nO7KxChhPUrnp8PHnGWNrj6lezgRJZcrcSt-Id_07aTQLDuO_ask40uahhb9hRkiaHSiIp85JZVLnrEwQjNAbjOgHg07S9qOJy0EZ7Y3YrFCoo2XvFvx7figWS9q4_v1BPD_jm58aroA5XguHxoh13LxbmScHmii-c621f_w5u4Z5TvhL_3YV_SCB9eP1GtqvOrKiE4L_gkNg29eKFqpl-Uk8EumvLmAUG9mPkmAvKZJAUa1mMGkGHCo4vbx5KGpBQsPXlhx91uRPFm03psV7Z7eUBC1cK0b6Nhei0rtSdY1Ob6oyArWXWspMRv44Tl8eU_iTqm7KFhbdmrQCNUndpQ-Icwmp3BXEhanifwnKErcze8aWoFPtPcIPxHdPN9XpX5rKyIJuQ2QALCR1GTJuZXtjOwTyAWICC5LXX3DpTitz1q3ij59RHC8RZjv7l5bHFcyT3wLpZptzZZjj9gKyWRs-sBqO4vj4Cy3UlZqfuvnylXFVbXo27yqeF86h3FTvd1NbAC3hYliIBqQh0F59YSgKF3Byc_AeA"; 

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
