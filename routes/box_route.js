const express = require("express");
const router = express.Router();
const bodyparser = require("body-parser");
const { BoxListController } = require("../controllers/boxList_controller");
const { BoxInfoController } = require("../controllers/BoxInfo_controller");
const { BoxRegisterController } = require("../controllers/boxRegister_controller");
const { BoxTodayAlertController } = require("../controllers/boxTodayAlert_controller");
const { BoxDeepInfoController } = require("../controllers/boxDeepInfo_controller");
const urlEncoded = bodyparser.urlencoded({
    limit: "50mb",
    extended: false,
});


router.post("/v1/box/list", urlEncoded, BoxListController);
router.post("/v1/box/info", urlEncoded, BoxInfoController);
router.post("/v1/box/register", urlEncoded, BoxRegisterController);
router.post("/v1/box/todayalert", urlEncoded, BoxTodayAlertController);
router.post("/v1/box/deepinfo", urlEncoded, BoxDeepInfoController);



module.exports = router;
