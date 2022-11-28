const bookModel=require("../models/bookModel")
const userModel=require("../models/userModel")
const bcr=require("bcrypt")
const saltRounts=10


const {validTitle,validName,validMobile,validemail,validPassword}=require("../validation/validation")
const { findOne } = require("../models/bookModel")

exports.registerUser=async (req,res)=>{
try{
const data = req.body
const {title,name,phone,email,password,address}=data
const {street,city,pincode}=address

//validation
if(!title){return res.status(400).send({status:false,msg:"title is required"})}
if(!name){return res.status(400).send({status:false,msg:"name is required"})}
if(!phone){return res.status(400).send({status:false,msg:"phone is required"})}
if(!email){return res.status(400).send({status:false,msg:"email is required"})}
if(!password){return res.status(400).send({status:false,msg:"password is required"})}






 const duplicateMobile= await userModel.findOne({phone})
if(duplicateMobile) return res.status(400).send({status:false,msg:"phone number is already registred"})

const duplicateEmail=await userModel.findOne({email})
if(duplicateEmail) return res.status(400).send({status:false,msg:"Email is already registred"})



const salt=await bcr.genSalt(saltRounts)
const HassPassword= await bcr.hash(password,salt)
req.body["password"]=HassPassword


const dataStore = await userModel.create(data)
return res.status(201).send({status:true,msg:dataStore})


}
catch(err){
return res.status(400).send({status:false,msg:err.message})
}
}



 exports.loginUser= async function(req,res){
    try{
       email=req.body.email

       password=req.body.password
    
        if (password == undefined, email == undefined) return res.status(400).send({ message: "send password and email value" })
        
        // let data= await userModel.findOne({email:email, password:password})
        // if (!data) return res.status(400).send({status:false, message:"email or password dismatched"})

        let  getuser = await userModel.findOne({email:email}).select({password:1})

const matchpassword =await bcr.compare(password,getuser.password)      
  let token=jwt.sign({userId: data._id.toString()},"sweta") 
        let finalData = {
            token: token,
            userId: data._id.toString(),
            iat: new Date().getTime(),
            exp: new Date().getTime()+600,
        }
        res.status(200).send({status:true, message:"token is successfully generated", data: finalData}) 
    }catch(error){
        res.status(500).send({status: false, message: error.message, message: " server error"  })
    }
}

