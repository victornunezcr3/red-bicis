const express = require("express");
const router = express.Router();
const authController = require("../../controllers/api/authControllerAPI");
const passport = require("../../config/passport");
const authControllerAPI = require("../../controllers/api/authControllerAPI");

router.post("/authenticate", authControllerAPI.authenticate);
router.post("/forgotPassword", authControllerAPI.forgotPassword);

module.exports = router;