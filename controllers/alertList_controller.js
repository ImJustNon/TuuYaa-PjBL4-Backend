const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const config = require("../config/config");
const axios = require("axios");
const { getJwtFromBearerHeader } = require("../utils/getJwtFromBearerHeader");
const { verifyJwt } = require("../utils/verifyJwt");
const { convertDateObjToISOString } = require("../utils/convertDateObjToISOString");

async function AlertListController(req, res){
    const { token } = req.cookies ?? {};
    const { boxUUID } = req.body ?? {};

    if(!token){
        return res.json({
            status: "FAIL",
            message: "Token cookie not found",
            error: {}
        });
    }


    const getTokenFromJwt = await verifyJwt(token);

    if(!getTokenFromJwt){
        return res.json({
            status: "FAIL",
            message: "Corrupted JWT",
            error: {}
        });
    }

    try {
        const findAlertDatas = await prisma.alertData.findMany({
            where: {
                user_uuid: getTokenFromJwt.uuid,
                box_uuid: boxUUID,
                is_disabled: false
            },
        });

        return res.json({
            status: "OK",
            message: "OK",
            error: null,
            data: findAlertDatas
        })
    }
    catch(e){
        return res.json({
            status: "FAIL",
            message: "Sothing went wrong",
            error: e
        });
    }
}

module.exports = {
    AlertListController
}