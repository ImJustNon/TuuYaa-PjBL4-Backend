const express = require("express");
const router = express.Router();
const bodyparser = require("body-parser");
const { UserInfo } = require("../controllers/userInfo_controller");
const urlEncoded = bodyparser.urlencoded({
    limit: "50mb",
    extended: false,
});

router.get("/v1/user/info", urlEncoded, UserInfo);

module.exports = router;
