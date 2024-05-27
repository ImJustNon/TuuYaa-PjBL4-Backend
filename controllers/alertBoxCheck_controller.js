const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const config = require("../config/config");
const axios = require("axios");
const { getJwtFromBearerHeader } = require("../utils/getJwtFromBearerHeader");
const { verifyJwt } = require("../utils/verifyJwt");
const { convertDateObjToISOString } = require("../utils/convertDateObjToISOString");
const moment = require("moment");


async function AlertBoxCheckController(req, res){
    const { currentTime, boxKey } = req.body ?? {};

    if(!currentTime || !boxKey){
        return res.json({
            status: "FAIL",
            message: "currentTime or boxKey not found",
            error: {}
        });
    }
    
    try {
        // validate box key
        const findBoxData = await prisma.box.findUnique({
            where: {
                box_key: boxKey
            },
            select: {
                box_uuid: true,
                box_key: true,
                box_slot_count: true
            }
        });

        if(!findBoxData){
            return res.json({
                status: "FAIL",
                message: "Box not found",
            });
        }

        // get all alert data
        const findAlertAllData = await prisma.alertData.findMany({
            where: {
                box_uuid: findBoxData.box_uuid,
                is_disabled: false
            },
            select: {
                id: true,
                alert_time: true,
            }
        });

        const add3DaysBeforeConvert = moment(parseInt(currentTime) * 1000).add("2", "days");

        const convertCurrentTimeToISOString = new Date(add3DaysBeforeConvert.valueOf());

        const sortAlertDatas = findAlertAllData.sort((a, b) => new Date(String(a.alert_time)).getTime() - new Date(String(b.alert_time)).getTime())

        const mapUTC7 = sortAlertDatas.map(timeData => {
            const utcDate = new Date(timeData.alert_time);
            const options = { timeZone: 'Asia/Bangkok', hour12: false };
            const dateInUTC7 = utcDate.toLocaleString('en-US', options).replace(', ', 'T');
            const [datePart, timePart] = dateInUTC7.split('T');
            const splitDatePart = datePart.split("/");
            const makeLikeISOStringFormatInUTC7 = `${splitDatePart[2]}-${splitDatePart[0].length === 1 ? `0${splitDatePart[0]}` : splitDatePart[0]}-${splitDatePart[1]}T${timePart}.000+07:00`;
            return {
                id: timeData.id,
                alert_time: makeLikeISOStringFormatInUTC7,
                alert_timeStamp: moment(makeLikeISOStringFormatInUTC7).valueOf(),
                utc: "+07:00"
            }
        });

        const filterOnlyInThisDay = mapUTC7.filter(alert => (alert.alert_time).split("T")[0] === convertCurrentTimeToISOString.toISOString().split("T")[0]);

        console.log(currentTime)
        console.log(filterOnlyInThisDay)
        return res.json({
            status: "OK",
            message: "OK",
            error: null,
            data: filterOnlyInThisDay,
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
    AlertBoxCheckController
}