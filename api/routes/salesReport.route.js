const express = require('express');
const salesReportController = require('../controllers/salesReport.controller');
const verifyToken = require("../utils/verifyUser");

const router = express.Router();

router.get('/getsales', verifyToken, salesReportController.showSalesReport);

module.exports = router;