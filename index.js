const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

const ROBLOSECURITY = "_CAEaAhADIhsKBGR1aWQSEzgwMTgwOTQzNDAwMzk4NzkxNjEoAw.OEb1YE7H3hFaanj5BpssRzhwem3lJ-vZZzPc2BNj_idjEap-SO39730Qi3pfeIrFcJNEoNdw4HVqQASqzKuGW-t1wo23t7TfqHPjH3XEFw4PuOTDe3k1Dlr64W8azrONt1LcPxVO-nvzqhOfO82-mDyo-hmYJNbhk8mXPeEE6Xah3MDLiPL6gCtaUyzvRvkwGKTrx7JpRICf3WHcxJFo4YSldZ9UDcPPkc9UMhyFplbKCooQwvlAJ5fzOVd18tvYtKCakZA96-Bl_MzvErLbtp_ns_zDHxW-W5ApzG_q2yQmFXo8UD_XalTCCxrPR5u6ANtM1MmsY62T5GDLnG5RGBhx--ebZS-JLQxVv_xjXSN5HjqoL2CKyP_4MvftWSozNDCqaEOCqk4-2f05E8I8LnlmTf72BPSuO5E_D5dhsGvlL3CXo_DKLRIFgsdmLMp0EHY5PLMO3KcqpueMx6Ua0N3uEzIxei66IIo4Yf-lmSdYEssG1JsZ1NHV-roM953-tG93qOLLuVpnb-vdpMGV_-eRZppw0J4QsFp_TJlBrXMWl4EoQG8XseHY753DGsUbb3v3rKOQm7FTd7Ik4VZ0tlL-Avf7s3j0ZJlWQuJJLjlqpHF3ii0U54V1t5f6WgPfQeEtPNexVdIUGe7OsQ_zMZgU0ZEnhFUzJCqPWzQHLPUBmRVZg41f5FQcTcjbZsFVy6MwsSFTbWrwl3PBuQVI_sFsZDoYhI19xfFhf0gptNyxbLBpKanhtrZ_hnQcV_gJxqNiNkHbm7p76AasmUjLJ_-rmDv9Uaa0fRoiyLz1eYtum9CS";

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
