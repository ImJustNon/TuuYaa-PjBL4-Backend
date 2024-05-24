const jwt = require("jsonwebtoken");
const config = require("../config/config");

module.exports = {
    signJwt: async(data) =>{
        return jwt.sign(data, config.jwt.secret, { expiresIn: "1d" });
    }
}