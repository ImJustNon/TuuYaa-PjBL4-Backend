const express = require("express");
const router = express.Router();
const bodyparser = require("body-parser");
const { AlertCreateController, AlertListController } = require("../controllers/alert_controller");
const urlEncoded = bodyparser.urlencoded({
    limit: "50mb",
    extended: false,
});


router.post("/v1/alert/create", urlEncoded, AlertCreateController);
router.post("/v1/alert/list", urlEncoded, AlertListController);

module.exports = router;
