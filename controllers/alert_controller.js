const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const config = require("../config/config");
const axios = require("axios");
const { getJwtFromBearerHeader } = require("../utils/getJwtFromBearerHeader");
const { verifyJwt } = require("../utils/verifyJwt");

async function AlertCreateController(req, res){
    const { alertTime, boxUUID, alertSlot, alertName } = req.body ?? {}
    const getJwt = await getJwtFromBearerHeader(req);
    
    if(!getJwt){
        return res.json({
            status: "FAIL",
            message: "Require AccessToken",
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
    const getTokenFronJwt = await verifyJwt(getJwt);
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
                user_token: getTokenFronJwt.user_token
            },
            select: {
                user_uuid: true,
                is_disabled: true,
            }
        });

        if(!getUserData){
            return res.json({
                status: "FAIL",
                message: "User not found",
                error: {},
            });
        }

        if(getUserData.is_disabled){
            return res.json({
                status: "FAIL",
                message: "User disabled",
                error: {}
            });
        }

        // code goes here
        return res.json(getUserData);
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
    AlertCreateController,
}