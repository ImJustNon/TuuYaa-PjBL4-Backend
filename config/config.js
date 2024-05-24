require("dotenv").config();

module.exports = {
    port: process.env.PORT,
    jwt: {
        secret: process.env.JWT_SECRET,
    },
    api: {
        google: {
            auth: {
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                callback_url: process.env.GOOGLE_CALLBACK_URL
            }
        }
    }
}