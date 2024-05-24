const express = require("express");
const router = express.Router();
const bodyparser = require("body-parser");
const { UserNativeAuthController, UserNativeAuthCreateController } = require("../controllers/userNormalAuth_controller");
const urlEncoded = bodyparser.urlencoded({
    limit: "50mb",
    extended: false,
});


router.post("/v1/user/auth/native/auth", urlEncoded, UserNativeAuthController);
router.post("/v1/user/auth/native/create", urlEncoded, UserNativeAuthCreateController);

module.exports = router;
