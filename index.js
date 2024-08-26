const express = require("express");
const App = express();
const PORT = 5000;




App.get("/", (req,res)=>{
    res.send("server home page")
})



App.listen(PORT , () => {
    console.log(`listening to port ${PORT}`);
    
})