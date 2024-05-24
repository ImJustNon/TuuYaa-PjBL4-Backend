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
        const userName = user.given_name;
        const userGoogleId = user.id;
        const userEmailVerified = user.verified_email;
        const userDisplayName = user.name;

        const checkUser = await prisma.googleUser.count({
            where: {
                user_email: userEmail,
            }
        });
    
        if(checkUser === 0){ // create
            const createUserToken = await createToken("google");
            await prisma.googleUser.create({
                data: {
                    user_google_id: userGoogleId,
                    user_email_verified: userEmailVerified,
                    user_token: createUserToken,
                    user_profile_url: userProfileUrl,
                    user_name: userName,
                    user_display_name: userDisplayName,
                    user_email: userEmail
                }
            }).then(async value => {
                const createJwtToken = await signJwt({
                    authToken: value.user_token
                });
                
                return res.json({
                    status: "OK",
                    message: "Create new Google User success",
                    error: null,
                    data: {
                        authToken: createJwtToken,
                        create_at: value.create_at
                    }
                });
            }).catch(e =>{
                return res.json({
                    status: "FAIL",
                    message: "Cannot create new Google User",
                    error: e
                });
            });
        }
        else { // get token
            const findGoogleUserData = await prisma.googleUser.findFirst({
                where: {
                    user_email: userEmail,
                    user_google_id: userGoogleId
                },
                select: {
                    user_token: true,
                }
            });

            if(!findGoogleUserData){
                return res.json({
                    status: "FAIL",
                    message: "Google User not found",
                    error: {}
                });
            }

            const createJwtToken = await signJwt({
                authToken: findGoogleUserData.user_token
            });

            return res.json({
                status: "OK",
                message: "Google User found",
                error: null,
                data: {
                    authToken: createJwtToken,
                    query_at: new Date().toISOString()
                }
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