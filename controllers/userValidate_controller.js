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

async function UserValidate(req, res){
    const tokenFromCookie = req.cookies.token;


    if(!tokenFromCookie){
        return res.json({
            status: "FAIL",
            message: "Missing access token",
            error: {},
        });
    }

    const getDataFromJwt = await verifyJwt(tokenFromCookie);
    
    if(!getDataFromJwt){
        return res.json({
            status: "FAIL",
            message: "Corrupted JWT",
            error: {}
        });
    }

    if(!getDataFromJwt.uuid){
        return res.json({
            status: "FAIL",
            message: "Corrupted JWT",
            error: {}
        });
    }

    return res.json({
        status: "OK",
        message: "Correct User Access Token Form",
        error: null,
    });
}

module.exports = {
    UserValidate
}