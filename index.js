const express = require("express");
const mongoose = require("mongoose")
const App = express();
const PORT = 5000;
require("dotenv").config()




App.get("/", (req,res)=>{
    res.send("server home page")
})

App.use(express.urlencoded({extended:true}))
App.use(express.json())







mongoose.connect(process.env.MONGO_URL)
 .then(
    App.listen(PORT , () => {
        console.log(`connected to mongoose`);
        console.log(`listening to port ${PORT}`);
    })  
).catch((err)=>{
    console.log(err);
    
})