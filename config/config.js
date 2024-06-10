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
    },
    allowedOrigins: [
        "http://127.0.0.1:2567", 
        "https://mc2.it-project.site", 
        "https://b3f8-49-237-14-153.ngrok-free.app", 
        "https://tuuyaa-pjbl4-frontend.netlify.app"
    ],
}