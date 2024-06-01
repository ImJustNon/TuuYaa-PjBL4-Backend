const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const config = require("../config/config");
const axios = require("axios");
const { getJwtFromBearerHeader } = require("../utils/getJwtFromBearerHeader");
const { verifyJwt } = require("../utils/verifyJwt");
const { convertDateObjToISOString } = require("../utils/convertDateObjToISOString");
const { isValidDate } = require("../utils/isValidDate");

async function BoxInfoController(req, res){
    const { token } = req.cookies ?? {};
    const { boxUUID } = req.body ?? {};
    
    if(!token){
        return res.json({
            status: "FAIL",
            message: "Require token",
            error: {},
        });  
    }

    if(!boxUUID){
        return res.json({
            status: "FAIL",
            message: "Require Box UUID",
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
        // check user uuid
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

        const findBoxInfo = await prisma.registeredBox.findUnique({
            where: {
                box_uuid: boxUUID,
                user_uuid: getUserData.user_uuid,
            },
            select: {
                id: true,
                box_name: true,
                box_uuid: true,
                create_at: true,
                update_at: true,
            }
        });

        if(!findBoxInfo){
            return res.json({
                status: "FAIL",
                message: "Box not found",
                error: {}
            });
        }

        return res.json({
            status: "OK",
            message: "Box data found",
            error: null,
            data: findBoxInfo
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
    BoxInfoController
}