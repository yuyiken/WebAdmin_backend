const express = require('express');
const logApiController = require('../controllers/logApiController');
const logApiMiddleware = require('../middlewares/logapiMiddleware');

const router = express.Router();

// Definir rutas de usuario
router.post('/', logApiMiddleware, logApiController.logApiEventManager);

module.exports = router;
