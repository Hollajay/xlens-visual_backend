const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const subscribeSchema =new Schema({
    email:{
    type:String,
    required: [true, 'email must be filled'],
    trim: true
    }
}, {
        timestamps: true 
    }
);

const subscribe = mongoose.model("subscriber",subscribeSchema);

module.exports = subscribe;
