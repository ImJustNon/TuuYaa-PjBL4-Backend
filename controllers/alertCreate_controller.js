const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const config = require("../config/config");
const axios = require("axios");
const { getJwtFromBearerHeader } = require("../utils/getJwtFromBearerHeader");
const { verifyJwt } = require("../utils/verifyJwt");
const { convertDateObjToISOString } = require("../utils/convertDateObjToISOString");

async function AlertCreateController(req, res){
    const { alertTime, boxUUID, alertSlot, alertName } = req.body ?? {}
    const { token } = req.cookies ?? {};
    
    if(!token){
        return res.json({
            status: "FAIL",
            message: "Require token",
            error: {},
        });  
    }

    if(!alertTime || !boxUUID || !alertSlot || !alertName){
        return res.json({
            status: "FAIL",
            message: "Missing data fields alertTime, boxUUID, alertSlot, alertName",
            error: {}
        });
    }

    // parseJwtToRealData
    const getTokenFronJwt = await verifyJwt(token);
    if(!getTokenFronJwt){
        return res.json({
            status: "FAIL",
            message: "Currupted User Token",
            error: {},
        });
    }

    // verify user token
    try {
        const getUserData = await prisma.user.findUnique({
            where: {
                user_uuid: getTokenFronJwt.uuid
            },
            select: {
                user_uuid: true,
            }
        });

        if(!getUserData){
            return res.json({
                status: "FAIL",
                message: "User not found",
                error: {},
            });
        }

        // สำหรับเช็คเข้าของกล่องจริงหรือไม่
        const getBoxData = await prisma.registeredBox.findUnique({
            where: {
                box_uuid: boxUUID
            },
            select: {
                user_uuid: true,
                box_uuid: true
            }
        });

        if(!getBoxData){
            return res.json({
                status: "FAIL",
                message: "Box not found",
                error: {}
            });
        }

        if(getBoxData.user_uuid !== getTokenFronJwt.uuid){
            return res.json({
                status: "FAIL",
                message: "This box not your",
                error: {}
            });
        }

        // Pass

        const createISOTimeString = convertDateObjToISOString(alertTime);
        const createSlotSet = [...new Set(alertSlot)];
        const createNewAlert = await prisma.alertData.create({
            data: {
                alert_name: alertName,
                alert_time: createISOTimeString,
                alert_slot: createSlotSet,
                user_uuid: getUserData.user_uuid,
                box_uuid: getBoxData.box_uuid,
            },
            select: {
                alert_uuid: true,
                alert_name: true,
                alert_time: true,
                alert_slot: true,
                create_at: true
            }
        });

        return res.json({
            status: "OK",
            message: "Create new alert success",
            error: null,
            data: {
                ...createNewAlert
            }
        });

        // code goes here
        // return res.json(getUserData);
    }
    catch(e) {
        return res.json({
            status: "FAIL",
            message: "Sothing went wrong",
            error: e
        });
    }
}

module.exports = {
    AlertCreateController
}