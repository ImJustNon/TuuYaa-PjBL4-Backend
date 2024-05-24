const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { encryptPassword } = require("../utils/encryptPassword");
const { createToken } = require("../utils/createToken");
const { signJwt } = require("../utils/signJwt");
const { isValidEmail } = require("../utils/isValidEmail");
const { comparePassword } = require("../utils/comparePassword");

// create
async function UserNativeAuthCreateController(req, res){
    const { userName, userEmail, userPassword } = req.body ?? {};

    if(!userName || !userEmail || !userPassword){
        return res.json({
            status: "FAIL",
            message: "Missing data fields : userName, userEmail, userPassword",
            error: {}
        });
    }

    if(userPassword.length < 8){
        return res.json({
            status: "FAIL",
            message: "The password must have at least 8 character long",
            error: {},
        }); 
    }

    if(!isValidEmail(userEmail)){
        return res.json({
            status: "FAIL",
            message: "The Email is not valid pattern",
            error: {}
        });
    }

    const encrypted_password = await encryptPassword(userPassword);
    const createNewUserToken = await createToken("native");
    const lowercase_email = userEmail.toLowerCase();

    try {
        const createUser = await prisma.user.create({
            data: {
                user_name: userName,
                user_email: lowercase_email,
                user_token: createNewUserToken,
                user_password_hash: encrypted_password
            }
        });

        const createJwtToken = await signJwt({
            authToken: createNewUserToken
        });

        return res.json({
            status: "OK",
            message: "Create new user successful",
            error: null,
            data: {
                authToken:  createJwtToken,
                create_at: createUser.create_at
            }
        });
    }
    catch(e){
        return res.json({
            status: "FAIL",
            message: "Something went wrong",
            error: e,
        });
    }
}

// auth
async function UserNativeAuthController(req, res){
    const { userName, userEmail, userPassword } = req.body ?? {};

    if(!userName && !userEmail){
        return res.json({
            status: "FAIL",
            message: "Missing data fields userName or userEmail"
        });
    }
    
    if(!userPassword){
        return res.json({
            status: "FAIL",
            message: "Missing data field userPassword",
            error: {}
        });
    }

    if(userEmail){
        if(!isValidEmail(userEmail)){
            return res.json({
                status: "FAIL",
                message: "Email is not valid pattern",
                error: {}
            });
        }

        const lowercase_email = userEmail.toLowerCase();
        
        try {
            const findUserByEmail = await prisma.user.findFirst({
                where: {
                    user_email: lowercase_email
                },
                select: {
                    user_password_hash: true,
                    user_token: true,
                }
            });

            if(!findUserByEmail){
                return res.json({
                    status: "FAIL",
                    message: "User not found",
                    error: {},
                });
            }

            const isCorrectPassword = await comparePassword(userPassword, findUserByEmail.user_password_hash);
            
            if(!isCorrectPassword){
                return res.json({
                    status: "FAIL",
                    message: "Incorrect password",
                    error: {},
                });
            }

            const createJwtToken = await signJwt({
                authToken: findUserByEmail.user_token,
            });

            return res.json({
                status: "OK",
                message: "Auth by Email and Password : PASS",
                error: null,
                data: {
                    authToken: createJwtToken,
                    query_at: new Date().toISOString(),
                }
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
    else {
        try {
            const findUserByUserName = await prisma.user.findFirst({
                where: {
                    user_name: userName,
                },
                select: {
                    user_password_hash: true,
                    user_token: true,
                }
            });

            if(!findUserByUserName){
                return res.json({
                    status: "FAIL",
                    message: "User not found",
                });
            }

            const isCorrectPassword = await comparePassword(userPassword, findUserByUserName.user_password_hash);

            if(!isCorrectPassword){
                return res.json({
                    status: "FAIL",
                    message: "Incorrect password"
                });
            }

            const createJwtToken = await signJwt({
                authToken: findUserByUserName.user_token,
            });

            return res.json({
                status: "OK",
                message: "Auth by Username and Password : PASS",
                error: null,
                data: {
                    authToken: createJwtToken,
                    query_at: new Date().toISOString(),
                }
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


}


module.exports = {
    UserNativeAuthController,
    UserNativeAuthCreateController
}