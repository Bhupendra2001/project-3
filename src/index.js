const express  = require("express")
const bodyParser = require('body-parser');
const route  = require("./route/route")
const {default : mongoose} = require("mongoose")
const app = express()
 

app.use(bodyParser.json())
 


mongoose.connect(" ",{
    useNewUrlparser : true
})
.then(()=> console.log("mongoDb is connected"))
.catch((err) => console.log(err))

app.use("/",route)

app.listen(process.env.PORT ||3000,function(){
    console.log("server running on port"+" "+ (process.env.PORT || 3000) )
})