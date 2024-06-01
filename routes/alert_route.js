const express = require("express");
const router = express.Router();
const bodyparser = require("body-parser");
const { AlertCreateController } = require("../controllers/alertCreate_controller");
const { AlertListController } = require("../controllers/alertList_controller");
const { AlertInfoController } = require("../controllers/alertInfo_controller");
const { AlertRemoveController } = require("../controllers/alertRemove_controller");
const { AlertUpdateController } = require("../controllers/alertUpdate_controller");
const { AlertBoxCheckController } = require("../controllers/alertBoxCheck_controller");
const { AlertGetController } = require("../controllers/alertGet_controller");
const urlEncoded = bodyparser.urlencoded({
    limit: "50mb",
    extended: false,
});


router.post("/v1/alert/create", urlEncoded, AlertCreateController);
router.post("/v1/alert/list", urlEncoded, AlertListController);
router.post("/v1/alert/info", urlEncoded, AlertInfoController);
router.post("/v1/alert/remove", urlEncoded, AlertRemoveController);
router.post("/v1/alert/update", urlEncoded, AlertUpdateController);
router.post("/v1/alert/get", urlEncoded, AlertGetController);
router.post("/v1/box/alert/check", urlEncoded, AlertBoxCheckController);

module.exports = router;
