const express = require('express')
const feedbackController = require('../controller/Feedback/feedbackController')
const router = express.Router()



router.post("/feedback", feedbackController)

module.exports = router