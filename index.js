const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const COOKIE = "_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_CAEaAhADIhsKBGR1aWQSEzM2MTkyNzQ2MzM2MDQxNzEyNDIoAw.an_oNdn7QG-QYVSUSqknIGJ3LwgrJBVGK_sV2hCdiVLWCD1RMgisQrS7iLU-V571KAZJCL19ugXtUkJmdykhyDC-Hv_0AqHBIYnNtbNEeEk6rTE9Ery4HEOkAV_8oUR1DbFlPKYoGfCakUSvvMZzKBN7uvdj18F9nKudsN__Au7nzDm_yFV2KRyQy_2UGx6oVnlQl6alDnktUux0K4OA4mi8vAaX4BYsr9EXbrOh1_1sS5fOtN2t8GKBfz7ZhMIVq6ec4rikjuJpGXfO-W0drmZP1hY7nRm07rrnJpcCzvdcvz8BuY6il7auf5SJWNjZR8ol7hsOHf33MVBeG0VwMUw9_nA6Od6X5CiptNCj3Mjo_KVNoghCEFaHKuu0O9C6DkMx_mzA-sjvc84MNC4JNEqLN8BNFd_LTgJxvEKP0KaqQWrNvKz2fTxGexiCOgtlolrs2eL1KaDLf_jvhzG_4BYsPhW4C5YPZj0aBl_-XDvtpp2xDFBpC09gx2emHrPuGizU9-fyreRBuj-VUU5JdifFB31rVSxGU8NG1Ohmgc3l6F0jW661rvukvnvRqbCBx3agVgrBZJrEA1V9IOp8CWveVpuUi_s7JTZTmIiL0GEMxy9y02z2Emga6oFaTamSoUt_bO4DmRvYizrUMD920eSbmZw_PX0WpILT5md30EtPZXYu3GiCVQ5INFC2cFKb-Utnj0nBUCKKD4kU7QNGjI_19PCMgC6e113diTHCGF6ncYDy0fbNCnbMc4KI01Hr_gjcYE4YzWAHWBWeTZtSPNZMk4Rg1dZIDvGWuN7rvnLUqni9USxaKLb9GMejpZIqh-9skFvzaqsTLHfL5tCFvQd9VI5edl03J4nSc5IehGPdPTT89mfDLrJp1iwrMoosC23otw"; 

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
