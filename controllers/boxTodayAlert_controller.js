const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const config = require("../config/config");
const axios = require("axios");
const { getJwtFromBearerHeader } = require("../utils/getJwtFromBearerHeader");
const { verifyJwt } = require("../utils/verifyJwt");
const { convertDateObjToISOString } = require("../utils/convertDateObjToISOString");
const { isValidDate } = require("../utils/isValidDate");
const moment = require("moment");

async function BoxTodayAlertController(req, res){
    const { token } = req.cookies ?? {};
    const { boxUUID, date } = req.body ?? {};
    
    if(!token){
        return res.json({
            status: "FAIL",
            message: "Require token",
            error: {},
        });  
    }

    if(!boxUUID || !date){
        return res.json({
            status: "FAIL",
            message: "Require boxUUID and date",
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

        // find box data
        const findBoxInfo = await prisma.registeredBox.findUnique({
            where: {
                user_uuid: getUserData.user_uuid,
                box_uuid: boxUUID,
            },
            select: {
                id: true,
                box_uuid: true,
                box_name: true,
            }
        });

        if(!findBoxInfo){
            return res.json({
                status: "FAIL",
                message: "Cannot find box info",
                error: {}
            });
        }

        // find alert data
        const findAlertData = await prisma.alertData.findMany({
            where: {
                box_uuid: findBoxInfo.box_uuid,
                user_uuid: getUserData.user_uuid
            },
            select: {
                id: true,
                alert_name: true,
                alert_time: true,
                alert_slot: true,
                box_uuid: true
            }
        });

        const sortedAlertByDate = findAlertData.sort((a, b) => moment(a.alert_time).valueOf() - moment(b.alert_time).valueOf());
        const mapAlertDataUTC7 = sortedAlertByDate.map(timeData => {
            const utcDate = new Date(timeData.alert_time);
            const options = { timeZone: 'Asia/Bangkok', hour12: false };
            const dateInUTC7 = utcDate.toLocaleString('en-US', options).replace(', ', 'T');
            const [datePart, timePart] = dateInUTC7.split('T');
            const splitDatePart = datePart.split("/");
            const splitTimePart = timePart.split(":");
            const makeLikeISOStringFormatInUTC7 = `${splitDatePart[2]}-${splitDatePart[0].length === 1 ? `0${splitDatePart[0]}` : splitDatePart[0]}-${splitDatePart[1].length === 1 ? `0${splitDatePart[1]}` : splitDatePart[1]}T${splitTimePart[0].length === 1 ? `0${splitTimePart[0]}` : splitTimePart[0]}:${splitTimePart[1]}:${splitTimePart[2]}.000+07:00`;
            return {
                id: timeData.id,
                alert_time: makeLikeISOStringFormatInUTC7,
                alert_name: timeData.alert_name,
                alert_slot: timeData.alert_slot,
                box_uuid: timeData.box_uuid,
            }
        });
        
        const filterOnlyInThisDay = mapAlertDataUTC7.filter(time => time.alert_time.split("T")[0] === `${date.year}-${date.month}-${date.day}`);
        
        return res.json({
            status: "OK",
            message: "This is today alert",
            error: {},
            data: filterOnlyInThisDay,
        });
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
    BoxTodayAlertController
}