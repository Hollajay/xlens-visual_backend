const mongoose = require('mongoose')

const FeedBackSChema = mongoose.Schema({
    fullname :{
        type:String,
        required: [true, 'full name  must be filled'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'email must be filled'],
        trim: true
      },
      message:{
        type: String,
        required: [true, 'message must be filled'],
        trim: true
      }
}, {
  timestamps: true
})


const feedBack =  mongoose.model("feedbackModel",FeedBackSChema)

module.exports = feedBack
