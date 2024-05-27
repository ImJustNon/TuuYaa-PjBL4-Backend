const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const config = require("../config/config");
const axios = require("axios");
const { getJwtFromBearerHeader } = require("../utils/getJwtFromBearerHeader");
const { verifyJwt } = require("../utils/verifyJwt");
const { convertDateObjToISOString } = require("../utils/convertDateObjToISOString");

async function AlertRemoveController(req, res){
    const { boxUUID, alertUUID } = req.body ?? {};
    const { token } = req.cookies ?? {};

    if(!token){
        return res.json({
            status: "FAIL",
            message: "Token not found",
            error: {}
        });
    }

    if(!boxUUID || !alertUUID){
        return res.json({
            status: "FAIL",
            message: "boxUUID or alertUUID not found",
            error: {}
        });
    }

    // validate user
    try {
        const verifyToken = await verifyJwt(token);
        const findUserInfo = await prisma.user.findUnique({
            where: {
                user_uuid: verifyToken.uuid
            },
            select: {
                user_uuid: true
            }
        });

        if(!findUserInfo){
            return res.json({
                status: "FAIL",
                message: "User not found",
            });
        }

        const findAlertInfo = await prisma.alertData.update({
            where: {
                alert_uuid: alertUUID,
                box_uuid: boxUUID,
                user_uuid: findUserInfo.user_uuid
            },
            data: {
                is_disabled: true
            }
        });

        return res.json({
            status: "OK",
            message: "Update success",
            error: null,
            data: {}
        });
    }
    catch(e){
        return res.json({
            status: "FAIL",
            message: "Something went wrong",
            error: e
        });
    }
}

module.exports = {
    AlertRemoveController
}