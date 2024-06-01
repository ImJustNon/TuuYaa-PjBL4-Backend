const express = require("express");
const router = express.Router();
const bodyparser = require("body-parser");
const { BoxListController } = require("../controllers/boxList_controller");
const urlEncoded = bodyparser.urlencoded({
    limit: "50mb",
    extended: false,
});


router.post("/v1/box/list", urlEncoded, BoxListController);

module.exports = router;
