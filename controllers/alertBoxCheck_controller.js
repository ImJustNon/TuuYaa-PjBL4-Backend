const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const config = require("../config/config");
const axios = require("axios");
const { getJwtFromBearerHeader } = require("../utils/getJwtFromBearerHeader");
const { verifyJwt } = require("../utils/verifyJwt");
const { convertDateObjToISOString } = require("../utils/convertDateObjToISOString");
const moment = require("moment");
const momentTz = require("moment-timezone");


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

        // เพิ่ม 2 วันไม่รู้ว่าทำไม่บน ESP32 เวลามันช้าไป 2 วัน
        const add2DaysBeforeConvert = momentTz(parseInt(currentTime) * 1000).add("2", "days");
        // เเปลงเวลาที่ได้มาจาก ESP32 จาก UTC เป๋น UTC+7
        const makeCurrentTimeToUTC7 = (currentTimeData) => {
            const utcDate = new Date(parseInt(currentTimeData.valueOf()));
            const options = { timeZone: 'Asia/Bangkok', hour12: false };
            const dateInUTC7 = utcDate.toLocaleString('en-US', options).replace(', ', 'T');
            const [datePart, timePart] = dateInUTC7.split('T');
            const splitDatePart = datePart.split("/");
            const makeLikeISOStringFormatInUTC7 = `${splitDatePart[2]}-${splitDatePart[0].length === 1 ? `0${splitDatePart[0]}` : splitDatePart[0]}-${splitDatePart[1]}T${timePart}.000+07:00`;
            return (makeLikeISOStringFormatInUTC7);
        }
        // เเปลงเป็น ISOString
        const convertCurrentTimeToISOString = makeCurrentTimeToUTC7(add2DaysBeforeConvert);
        // เรียงเวลาจากน้อยไปมากโดยเเปลง isoStrig เป็นเลข Timestamp ก่อนเเละจึงมาเปลี่ยบเทียบ
        const sortAlertDatas = findAlertAllData.sort((a, b) => new Date(String(a.alert_time)).getTime() - new Date(String(b.alert_time)).getTime())
        // Map ค่า alert_time เข้าไปให้โดยค่าเดิมจะเป็นเวลา UTC ทำการ Map ใหม่โดยเเปลงเป็น UTC+7
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
                utc: makeLikeISOStringFormatInUTC7.match(/([+-]\d{2}:\d{2})$/)[0]
            }
        });
        // ทำการ Filter เอาเฉพาะวันที่ Client กำลังทำงานเท่านั้น
        const filterOnlyInThisDay = mapUTC7.filter(alert => (alert.alert_time).split("T")[0] == convertCurrentTimeToISOString.split("T")[0]);


        console.table(filterOnlyInThisDay);
        // console.log(new Date(parseInt(add2DaysBeforeConvert.valueOf())).toISOString())
        // console.log(makeCurrentTimeToUTC7(add2DaysBeforeConvert));
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