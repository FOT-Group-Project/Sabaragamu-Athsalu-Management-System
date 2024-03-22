const express = require('express');
const associationController = require('../controllers/association.controller');
const router = express.Router();

router.get('/association', associationController.checkAssociation);

module.exports = router;