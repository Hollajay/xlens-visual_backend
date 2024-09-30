const express = require('express')
const { getAllSubscriber, CreateSubscriber } = require('../controller/subscribe/subscriberController')
const router = express.Router()

router.get("/subscribe",getAllSubscriber);
router.post("/subscribe",CreateSubscriber);

module.exports = router