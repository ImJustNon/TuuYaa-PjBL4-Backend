const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const config = require("../config/config");
const axios = require("axios");
const { getJwtFromBearerHeader } = require("../utils/getJwtFromBearerHeader");
const { verifyJwt } = require("../utils/verifyJwt");
const { convertDateObjToISOString } = require("../utils/convertDateObjToISOString");
const { isValidDate } = require("../utils/isValidDate");

async function BoxDeleteController(req, res){
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
            }
        });

        if(!findBoxInfo){
            return res.json({
                status: "FAIL",
                message: "Box not found",
                error: {}
            });
        }

        // delete alert data
        await prisma.alertData.deleteMany({
            where: {
                box_uuid: boxUUID,
                user_uuid: getUserData.user_uuid,
            },
        });

        // delete box register data
        await prisma.registeredBox.delete({
            where: {
                box_uuid: boxUUID,
            },
        });

        return res.json({
            status: "OK",
            message: "Delete Success",
            error: null,
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
    BoxDeleteController
}