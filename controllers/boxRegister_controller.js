const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const config = require("../config/config");
const axios = require("axios");
const { getJwtFromBearerHeader } = require("../utils/getJwtFromBearerHeader");
const { verifyJwt } = require("../utils/verifyJwt");
const { convertDateObjToISOString } = require("../utils/convertDateObjToISOString");
const { isValidDate } = require("../utils/isValidDate");

async function BoxRegisterController(req, res){
    const { token } = req.cookies ?? {};
    const { boxKey, boxName } = req.body ?? {};
    
    if(!token){
        return res.json({
            status: "FAIL",
            message: "Require token",
            error: {},
        });  
    }

    if(!boxKey || !boxName){
        return res.json({
            status: "FAIL",
            message: "Require boxKey and boxName",
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

        // find key data from base box data
        const findBoxBaseInfo = await prisma.box.findUnique({
            where: {
                box_key: boxKey,
            },
            select: {
                box_uuid: true,
                box_slot_count: true,
            }
        });

        if(!findBoxBaseInfo){
            return res.json({
                status: "FAIL",
                message: "Cannot find data form this key",
                error: {}
            });
        }

        // create data
        const createRegisterBox = await prisma.registeredBox.create({
            data: {
                box_uuid: findBoxBaseInfo.box_uuid,
                box_name: boxName,
                user_uuid: getUserData.user_uuid
            },
            select: {
                id: true,
                box_name: true,
                box_uuid: true,
                create_at: true
            }
        });

        return res.json({
            status: "OK",
            message: "Register success",
            error: null,
            data: createRegisterBox
        });
    }
    catch(e) {
        return res.json({
            status: "FAIL",
            message: "Something went wrong",
            error: e
        });
    }
}

module.exports = {
    BoxRegisterController
}