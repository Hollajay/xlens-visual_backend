const express = require("express");
const mongoose = require("mongoose")
const projectRoutes = require("./Routes/projectRoutes")
const feedbackRoutes = require("./Routes/feedbackRoutes")
const cors = require('cors');
const App = express();
const PORT = 5000;
require("dotenv").config()


App.use(express.urlencoded({extended:true}))
App.use(express.json())

App.use(cors({
    origin: process.env.FRONTEND_SITE_URL ,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }));



  App.get("/", (req,res)=>{
    res.send("server home page")
})

App.use("/api/projects", projectRoutes);
App.use("/api",feedbackRoutes)




mongoose.connect(process.env.MONGO_URL,{

  serverSelectionTimeoutMS: 50000
})
 .then(
    App.listen(PORT , () => {
        console.log(`connected to mongoose`);
        console.log(`listening to port ${PORT}`);
    })  
).catch((err)=>{
    console.log(err);
    
})