const express = require('express');
const router = express.Router();
const callController = require('../controlers/callController');

// Route for initiating a call
router.post('/initiate', callController.initiateCall);

// Route for accepting a call
router.post('/accept', callController.acceptCall);

// Route for rejecting a call
router.post('/reject', callController.rejectCall);

// Route for ending a call
router.post('/end', callController.endCall);

module.exports = router;
