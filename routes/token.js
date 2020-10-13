var express = require('express');
var router = express.Router();
var tokenController = require('../controllers/token');

router.get('/confirmacion/:token', tokenController.confirmacion_get);

module.exports = router;