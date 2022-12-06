const express  = require("express")
const bodyParser = require('body-parser');
const route  = require("./routes/route")
const {default : mongoose} = require("mongoose")
const multer= require("multer");
 
const app = express()
 

app.use(bodyParser.json())
app.use(multer().any())


mongoose.connect("mongodb+srv://123:1234@cluster0.pf4v08v.mongodb.net/project-3",{
    useNewUrlparser : true
})
.then(()=> console.log("mongoDb is connected"))
.catch((err) => console.log(err))

app.use("/",route)

app.listen(process.env.PORT ||3000,function(){
    console.log("server running on port"+" "+ (process.env.PORT || 3000) )
})