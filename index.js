const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

const ROBLOSECURITY = "_CAEaAhADIhsKBGR1aWQSEzgwMTgwOTQzNDAwMzk4NzkxNjEoAw.YG69LGgnFNP9Ea-FTPpn9uMMgGRjZ7oqj6jwwWlbZ-wSMFxKS4mqli_uQlg0pdtSw7WyOQq1BSSPvRoqMSaDFQ9knceMOHk7VpUwKhHyAIUOxG0Nce2CUcjokXqxpsJpQWAn8fngYNduoSo76zZPIX8dEL8KLmEPSXTIS_qlZSfspCktE8gy6sEVkUpBkLz4Y_imK9U9kiqDeLVm_BR1MRfPcnEiT8U0EJknqYAyE__dcIT29YkK-F5ilrL-e-XXSaILC7V5CGfjDfg9o_aGjVQi8U0IPq6gZVx-IzBeFdOeHwH5q0a0FS217g27U0W2m0kdFUaNfB6yLTrDKMuq_lk7J3LAYc7zMFxClCd4k2TFo2pdLvx3b1vsvpO_pL-73-JJNpxG709aj6FOIMU13YuBoml_HxXcu9r0rwfifvFwqZEvnG2AvB4XdH1_OWS4AYBXzcxvanED0ss-pvHwev9-lkl1j4uhsaWDzFafEVkC398jyuZWOtbGIAPr73sCUbsDnC8n5sWtnwpEkMT_tbdx3yDZwdoqdS9Vjm-vU1cYYsTZQYuXxhGrVoH4mX0dtIvqAQoV18w4SV5OOkVwVnTvPFtsRuIU2jZv5yW3gbntXqMzfeNm-P_X4BSoW01yCWMeml3Jy84W9esFMqWZ0D0Zj9rylxhG8OpA1JzR5Dv7YZZQEGgKAWBcfNwKigBjSGU5ARuOhfQIjRGVzg-tLZV_99PgL_7jirbvPTRugY35hrsSlQqJhYjMOmRouJ8D469ll7ClRfML2fUbzllbzwh6Rt0";

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
