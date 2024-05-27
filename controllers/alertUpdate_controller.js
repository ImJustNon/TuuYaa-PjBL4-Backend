const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const config = require("../config/config");
const axios = require("axios");
const { getJwtFromBearerHeader } = require("../utils/getJwtFromBearerHeader");
const { verifyJwt } = require("../utils/verifyJwt");
const { convertDateObjToISOString } = require("../utils/convertDateObjToISOString");

async function AlertUpdateController(req, res){
    const { boxUUID, alertUUID, update, data } = req.body ?? {};
    const { token } = req.cookies ?? {};

    if(!token){
        return res.json({
            status: "FAIL",
            message: "Token not found",
            error: {}
        });
    }

    if(!boxUUID || !alertUUID || !update || !data){
        return res.json({
            status: "FAIL",
            message: "boxUUID or alertUUID or update or data not found",
            error: {}
        });
    }

    
    try {
        // validate user
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

        let updateSchema = null;

        if(update.toLowerCase() === "alertname"){
            updateSchema = {
                where: {
                    alert_uuid: alertUUID,
                    box_uuid: boxUUID,
                    user_uuid: findUserInfo.user_uuid
                },
                data: {
                    alert_name: data
                }
            }
        }
        else if(update.toLowerCase() === "alerttime"){
            updateSchema = {
                where: {
                    alert_uuid: alertUUID,
                    box_uuid: boxUUID,
                    user_uuid: findUserInfo.user_uuid
                },
                data: {
                    alert_time: data
                }
            }
        }
        else if(update.toLowerCase() === "alertslot"){
            updateSchema = {
                where: {
                    alert_uuid: alertUUID,
                    box_uuid: boxUUID,
                    user_uuid: findUserInfo.user_uuid
                },
                data: {
                    alert_slot: [...new Set(data)]
                }
            }
        }

        const updateAlertData = await prisma.alertData.update(updateSchema);
        return res.json({
            status: "OK",
            message: "Update success",
            error: null,
            data: updateAlertData
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
    AlertUpdateController
}