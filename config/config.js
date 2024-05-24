require("dotenv").config();

module.exports = {
    port: process.env.PORT,
    jwt: {
        secret: process.env.JWT_SECRET,
    }
}