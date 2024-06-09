const express = require("express");
const router = express.Router();
const bodyparser = require("body-parser");
const { UserGoogleAuthController, UserGoogleAuthCallbackController, UserGoogleSignoutController } = require("../controllers/userGoogleAuth_controller");
const urlEncoded = bodyparser.urlencoded({
    limit: "50mb",
    extended: false,
});


router.get("/v1/user/auth/google/auth", urlEncoded, UserGoogleAuthController);
router.post("/v1/user/auth/google/auth/callback", urlEncoded, UserGoogleAuthCallbackController);
router.post("/v1/user/auth/google/signout", urlEncoded, UserGoogleSignoutController);

module.exports = router;
