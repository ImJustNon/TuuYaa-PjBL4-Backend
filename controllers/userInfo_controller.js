const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { encryptPassword } = require("../utils/encryptPassword");
const { createToken } = require("../utils/createToken");
const { signJwt } = require("../utils/signJwt");
const { isValidEmail } = require("../utils/isValidEmail");
const { comparePassword } = require("../utils/comparePassword");
const config = require("../config/config");
const axios = require("axios");
const { getJwtFromBearerHeader } = require("../utils/getJwtFromBearerHeader");
const { verifyJwt } = require("../utils/verifyJwt");

async function UserInfo(req, res){
    const tokenFromHeader = await getJwtFromBearerHeader(req);
    const tokenFromCookie = req.cookies.token;


    if(!tokenFromHeader && !tokenFromCookie){
        return res.json({
            status: "FAIL",
            message: "Missing access token",
            error: {},
        });
    }

    const getDataFromJwt = await verifyJwt(tokenFromHeader ? tokenFromHeader : tokenFromCookie);
    
    if(!getDataFromJwt){
        return res.json({
            status: "FAIL",
            message: "Corrupted JWT",
            error: {}
        });
    }

    const findUserInfo = await prisma.user.findUnique({
        where: {
            user_uuid: getDataFromJwt.uuid
        },
        select: {
            id: true,
            user_email: true,
            user_profile_url: true,
            user_name: true,
            user_google_id: true,
            user_google_verified: true,
            create_at: true
        }
    });

    return res.json({
        status: "OK",
        message: "User found!",
        error: null,
        data: {
            ...findUserInfo
        }
    });
}

module.exports = {
    UserInfo
}