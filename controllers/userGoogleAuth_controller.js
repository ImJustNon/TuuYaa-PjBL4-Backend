const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { encryptPassword } = require("../utils/encryptPassword");
const { createToken } = require("../utils/createToken");
const { signJwt } = require("../utils/signJwt");
const { isValidEmail } = require("../utils/isValidEmail");
const { comparePassword } = require("../utils/comparePassword");
const config = require("../config/config");
const axios = require("axios");

async function UserGoogleAuthController(req, res){
    const params = new URLSearchParams({
        client_id: config.api.google.auth.client_id,
        redirect_uri: config.api.google.auth.callback_url,
        response_type: 'code',
        scope: 'profile email openid',
    });
    return res.redirect(`https://accounts.google.com/o/oauth2/auth?${params}`);
}

async function UserGoogleAuthCallbackController(req, res){
    const { code }  = req.query ?? {};

    if(!code){
        return res.json({
            status: "FAIL",
            message: "code param not found"
        });
    }

    try {
        const response = await axios.post('https://oauth2.googleapis.com/token', `code=${code}&client_id=${config.api.google.auth.client_id}&client_secret=${config.api.google.auth.client_secret}&redirect_uri=${config.api.google.auth.callback_url}&grant_type=authorization_code`, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        
        const accessToken = response.data.access_token;
        
        const userResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        
        const user = userResponse.data;
        const userEmail = user.email;
        const userProfileUrl = user.picture;
        const userName = user.name;
        const userGoogleId = user.id;
        const userEmailVerified = user.verified_email;
        // const userDisplayName = user.name;

        const checkAvailableEmail = await prisma.user.findUnique({
            where: {
                user_email: userEmail,
            },
            select: {
                user_uuid: true
            }
        });

        if(!checkAvailableEmail){ // no email match
            //create new account
            const createNewUser = await prisma.user.create({
                data: {
                    user_email: userEmail,
                    user_profile_url: userProfileUrl,
                    user_name: userName,
                    user_google_id: userGoogleId,
                    user_google_verified: userEmailVerified
                }
            })
            const createJwtToken = await signJwt({
                uuid: createNewUser.user_uuid
            });

            // save cookie and response
            res.cookie("token", createJwtToken, {
                maxAge: (5 * 60) * 1000, // 5 min
                secure: true, 
                httpOnly: true,
                sameSite: "none"
            });
            res.json({
                status: "OK",
                message: "Google User : Create new & Save Cookie success",
                error: null,
            });
        }
        else { // have email match
            const createJwtToken = await signJwt({
                uuid: checkAvailableEmail.user_uuid
            });
            // save cookie and response
            res.cookie("token", createJwtToken, {
                maxAge: (5 * 60) * 1000, // 5 min
                secure: true, 
                httpOnly: true,
                sameSite: "none"
            });
            res.json({
                status: "OK",
                message: "Google User : Login Success",
                error: null,
            });
        }
    }
    catch(e){
        return res.json({
            status: "FAIL",
            message: "An error occurred during login.",
            error: e,
        });
    }
}

module.exports = {
    UserGoogleAuthController,
    UserGoogleAuthCallbackController
}