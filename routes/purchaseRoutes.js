const express = require('express');
const { initiateSTKPush } = require('../assets/js/paybills/purchaseController');
const { handleMpesaCallback } = require('../assets/js/paybills/mpesaCallback');

const router = express.Router();

router.post('/purchase', initiateSTKPush);
router.post('/callback', handleMpesaCallback);

module.exports = router;
