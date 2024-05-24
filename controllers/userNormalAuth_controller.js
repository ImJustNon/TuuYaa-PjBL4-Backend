const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { encryptPassword } = require("../utils/encryptPassword");
const { createToken } = require("../utils/createToken");
const { signJwt } = require("../utils/signJwt");

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

    const encrypted_password = await encryptPassword(userPassword);
    const createNewUserToken = await createToken();
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

}


module.exports = {
    UserNativeAuthController,
    UserNativeAuthCreateController
}