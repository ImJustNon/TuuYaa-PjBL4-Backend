const express = require("express");
const router = express.Router();
const bodyparser = require("body-parser");
const { AlertCreateController } = require("../controllers/alert_controller");
const { PrismaClient } = require("@prisma/client");
const { signJwt } = require("../utils/signJwt");
const prisma = new PrismaClient();
const urlEncoded = bodyparser.urlencoded({
    limit: "50mb",
    extended: false,
});

// settoken 
router.post("/v1/dev/user/settoken", urlEncoded, async(req, res) =>{
    const { email } = req.body ?? {}
    if(!email){
        return res.json({
            status: "FAIL",
            message: "please specify email",
            error: {}
        });
    }
    try {
        const getUserData = await prisma.user.findUnique({
            where: {
                user_email: email
            },
            select: {
                user_uuid: true
            }
        });

        if(!getUserData){
            return res.json({
                status: "FAIL",
                message: "User not found"
            });
        }

        const createJwtToken = await signJwt({
            uuid: getUserData.user_uuid
        });

        res.cookie("token", createJwtToken, {
            maxAge: (10 * 60) * 1000, // 5 min
            secure: true, 
            httpOnly: true,
            sameSite: "none"
        });
        
        res.json({
            status: "OK",
            message: "Set token success",
            error: null,
            data: {
                token: createJwtToken
            }
        });
    }
    catch(e){
        return res.json({
            status: "FAIL",
            message: "Something went wrong",
            error: e
        }); 
    }
});

router.post("/v1/dev/user/gettoken", urlEncoded, async(req, res) =>{
    const { token } = req.cookies ?? {};
    res.send(token ?? typeof token);
});

module.exports = router;
