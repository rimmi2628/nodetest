const express = require('express');
const router = express.Router();
const PaymentControllers= require('../controller/payment');
router.get('/gethome',PaymentControllers.gethome);
router.post('/payment',PaymentControllers.payment);
module.exports=router;