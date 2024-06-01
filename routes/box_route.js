const express = require("express");
const router = express.Router();
const bodyparser = require("body-parser");
const { BoxListController } = require("../controllers/boxList_controller");
const { BoxInfoController } = require("../controllers/BoxInfo_controller");
const urlEncoded = bodyparser.urlencoded({
    limit: "50mb",
    extended: false,
});


router.post("/v1/box/list", urlEncoded, BoxListController);
router.post("/v1/box/info", urlEncoded, BoxInfoController);



module.exports = router;
