const express = require("express");
const router = express.Router();
const bodyparser = require("body-parser");
const { AlertCreateController } = require("../controllers/alert_controller");
const urlEncoded = bodyparser.urlencoded({
    limit: "50mb",
    extended: false,
});


router.post("/v1/alert/create", urlEncoded, AlertCreateController);

module.exports = router;
