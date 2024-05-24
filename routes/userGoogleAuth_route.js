const express = require("express");
const router = express.Router();
const bodyparser = require("body-parser");
const { UserGoogleAuthController, UserGoogleAuthCallbackController } = require("../controllers/userGoogleAuth_controller");
const urlEncoded = bodyparser.urlencoded({
    limit: "50mb",
    extended: false,
});


router.get("/v1/user/auth/google/auth", urlEncoded, UserGoogleAuthController);
router.get("/v1/user/auth/google/auth/callback", urlEncoded, UserGoogleAuthCallbackController);

module.exports = router;
