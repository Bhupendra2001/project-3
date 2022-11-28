const userModel=require("../models/userModel")
const bcrypt=require("bcrypt")
const saltRounts=10
const jwt = require('jsonwebtoken')


const {
    validTitle,
    validName,
    validMobile,
    validemail,
    validPassword}=require("../validation/validation")


exports.registerUser=async (req,res)=>{
try{
const data = req.body
const {title,name,phone,email,password,address}=data
const {street,city,pincode}=address

//validation
if(!title){
    return res
    .status(400)
    .send({status:false,msg:"title is required"})}

if(!name){
    return res
    .status(400)
    .send({status:false,msg:"name is required"})}

if(!phone){
    return res
    .status(400)
    .send({status:false,msg:"phone is required"})}
if(!email){
    return res
    .status(400)
    .send({status:false,msg:"email is required"})}
if(!password){
    return res.
    status(400)
    .send({status:false,msg:"password is required"})}

if (address) {
        if (typeof address !== "object") {
          return res
            .status(400)
            .send({ status: false, message: "address must be type object" });
        }
      }






 const duplicateMobile= await userModel.findOne({phone})
if(duplicateMobile) return res
.status(400)
.send({status:false,msg:"phone number is already registred"})

const duplicateEmail=await userModel.findOne({email})
if(duplicateEmail) return res
.status(400)
.send({status:false,msg:"Email is already registred"})


//================================================================regex validation =============================

if (!validTitle(title)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter a valid title" });
    }

    if (!validemail(email)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter a valid name" });
    }

    if (!validemail(email)) {
        return res
          .status(400)
          .send({ status: false, message: "Enter a valid name" });
      }
      if (!validPassword(password)) {
        return res
          .status(400)
          .send({ status: false, message: "Enter a valid name" });
      }



    if (!validMobile(phone)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter a valid phone number" });
    }


if (address) {
    if (!isValidStreet(street)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter a valid street" });
    }

    if (!validName(city)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter a valid city" });
    }

    if (!isValidPincode(pincode)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter a valid pincode" });
    }
  }



const salt=await bcrypt.genSalt(saltRounts)
const HassPassword= await bcrypt.hash(password,salt)
req.body["password"]=HassPassword


const dataStore = await userModel.create(data)
return res.status(201).send({status:true,msg:"userCreate successfully" ,dataStore})


}
catch(err){
return res.status(400).send({status:false,msg:err.message})
}
}



 exports.loginUser= async function(req,res){
    try{
       email=req.body.email
        password=req.body.password
        //===============================================user email  id is requires===================================================//      
        if (!email) return res
        .status(400)
        .send({ status: false, msg: "email id is required" })

        //=================================================Password is required ======================================================//     
        if (!password) return res
        .status(400)
        .send({ status: false, msg: "Password is required" })
      //==============================================checking the email id or password is exist or not ===========================//     
      let getUser = await authorModel
      .findOne({ email: email })
      .select({ password: 1 })

      //================================================User not found==============================================================//    
      if (Object.keys(getUser).length == 0) return res.status(404).send({ status: false, msg: "User not found" })

      //========================================password matching by bcrypt.compare method password comeparing ==================================//      
      const matchPassword = await bcrypt.compare(password, getUser.password)

      if (!matchPassword) return res
      .status(401)
      .send({ status: false, msg: "Password is incorrect" })

    
            
  let token=jwt.sign({userId: data._id.toString()},"sweta") 
        let finalData = {
            token: token,
            userId: data._id.toString(),
            exp: new Date().getTime()+600,
        }
       return res
       .status(200)
       .send({status:true, message:"token is successfully generated", finalData}) 


    }catch(error){
       return res
       .status(500)
       .send({status: false, message: error.message, message: " server error"  })
    }
}

