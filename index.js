const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const COOKIE = "_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_CAEaAhADIhsKBGR1aWQSEzM2MTkyNzQ2MzM2MDQxNzEyNDIoAw.Yg6AnjewC6r7MmzlHObmSnPxxkGenDag_QNiJClK2X6q2o0e8FQ__juJht07y8JsEm-HFML62jgEhdZkpn4gEnlOHn8Y74hOzVi5R5P_ZhA01P86VddcCHWcc5gLlc92d8ENlDJMMzSgHZTKG-KpL663p20NtVdTghfhTowsVqh2jqvH8Zfr-QtYH1lDS-3YunsCrKc-WRWKavtgOTE1bIHh5QhG6I7Ta-hekvUliSvmhCf0_yaczhSPLowJkaJH3FfhSw6vmIVLy7rGsENVZ8rU08dA7Q-XCuovHZ0bhLpBWZIp1KFsWExUDv1iQqpJv-BcLgvQfFtsibQjvuLwrdZYqzTr-KyIAZENA35KFyhbF5Kwvx4w2Y5wh21RL35-4zS9BOFhhu6FYlyg2Ym0sNWAr2sGeNlItSkosiMMeSHiok_cVvcdnrw-Tlej6QHYIka7WKJjvCCWW6RaVLWW42g0EAmw8X2Nv1o8LIAPKcpzpeknW3_CYofzpSD6qJ0JPvxj_mc22LgS4SS5KEy6PpvH-FqYojVSx_GRsD5qcZaFgQKPZ1c2UlMv1U9LdfGpRSWDcktbAZ3AnqHkgLduzrjimSkPAVklJudFLWYavpW557NtJtlURN4BShASGolYNnwn542URqdh6qpoJ7HXv9QhPqSEMWLdLqnhIPfwE2tT3W8bkFaZY7HQ7B9SuOJU4cywOBtKs3ejxk5O8xZdfi5urDn1i6-O1V2t5BN_BGw6fVGB-v15SyHCayENeOCSu6hzUQzyGb_3iRNcHebEJh9m1y_orYykyTmNWXqF58s_P4PqKMOj9dW5EDIqkxMwm0B_8LzSD3Lgm9-ChbQfKmgeu5zyTpIqJwaBpwIbsnfv3d07HDUj-ftG6wwZsDLwTgvWsQ"; 

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
