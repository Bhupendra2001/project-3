const mongoose=require("mongoose")

const validDate = function (value) {
  let date=/^\d{4}-\d{2}-\d{2}$/;
  if(date.test(value)) return true;
}



  const validTitle = function(value) {
    let title = /^(Mr|Mrs|Miss)$/; 
    if (title.test(value)) return true ;
};

const isValidStreet = function (body) {
    const nameRegex = /^[a-zA-Z0-9_ ]*$/;
    return nameRegex.test(body);
  };


  const isValidPincode = function (Pincode) {
    const passRegex = /^[1-9][0-9]{5}$/;
    return passRegex.test(Pincode);
  };

   
  const validISBN = function(value){
    let ISBN = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/
    return ISBN.test(value)
}

const validName = function (value) {
    let name = /^[a-zA-Z ]{3,}$/;
    if (name.test(value)) return true;
};

const validMobile = function (value) {
    let mobile = /^[0-9 ]{10,10}$/;
    if (mobile.test(value)) return true;
};

const validemail = function (value) {
    let email = /^[a-z]{1}[a-z0-9._]{1,100}[@]{1}[a-z]{2,15}[.]{1}[a-z]{2,10}$/;
    if (email.test(value)) return true;
};

const validPassword = function (value) {
    let password= /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&])[a-zA-Z0-9@#$%&]{8,15}$/;
    if (password.test(value)) return true;
};

const isvalidObjectid=function(value){
return mongoose.Types.ObjectId(value)

}

const validRating=function (value) {
  let Rating = /^[1-5 ]{1,1}$/;
  if (Rating.test(value)) return true;
};


module.exports={validRating,validTitle,validDate,validName,validMobile,validemail,validPassword,validISBN,isValidStreet,isValidPincode,isvalidObjectid}