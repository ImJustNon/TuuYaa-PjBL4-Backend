const express = require("express");
const { rootController } = require("../controllers/root_controller");
const router = express.Router();

router.get("/", rootController);


module.exports = router;