const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const config = require("../config/config");
const axios = require("axios");
const { getJwtFromBearerHeader } = require("../utils/getJwtFromBearerHeader");
const { verifyJwt } = require("../utils/verifyJwt");
const { convertDateObjToISOString } = require("../utils/convertDateObjToISOString");
const { isValidDate } = require("../utils/isValidDate");

async function BoxListController(req, res){
    const { token } = req.cookies ?? {};
    
    if(!token){
        return res.json({
            status: "FAIL",
            message: "Require token",
            error: {},
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

        // get box list
        const findBoxData = await prisma.registeredBox.findMany({
            where: {
                user_uuid: getUserData.user_uuid,
                is_disabled: false
            },
            select: {
                box_uuid: true,
                box_name: true,
            }
        });

        return res.json({
            status: "OK",
            message: "This is box list",
            error: null,
            data: findBoxData,
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
    BoxListController
}