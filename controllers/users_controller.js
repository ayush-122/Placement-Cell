const User = require("../models/user");
const passport =require('passport');
//displaying dashboard once the user sign in
const Student=require('../models/student');
const Interview= require('../models/interview');


//get the sign-up data
module.exports.create = async function (req, res) {
  console.log(req.body);
  if (req.body.password != req.body.confirm_password) {
    console.log("password and confirm password is not matching");
    return res.redirect("back");
  }
  // only codingninjas user will able to signup
  let validEmail= req.body.email.endsWith('@codingninjas.in');
  console.log(` email validation is ${validEmail}`);
  if(!validEmail)
  {
      req.flash('error','Domain name is not correct');
      return res.redirect('back');
  }
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      try
      {
      await User.create(req.body)
      req.flash('success','user registed successfully');
      return res.redirect("/");
      }catch(error)
      {
         console.log("error in creating users",error);
         return res.redirect('back');
      }
    } else {
      req.flash('error','user already exists');
      return res.redirect("back");
    }
  } catch (error) {
    console.log("error in finding users",error);
    return res.redirect("back");
  }
}

//create session that is when user click on the sign-in button
module.exports.createSession = function (req, res) {
  req.flash('success','Logged in Successfully');
  return res.redirect('/users/dashboard');
};




module.exports.dashboard=async function(req,res)
{
    // console.log('Placement Cell');
    const students= await Student.find({});
    const interviews= await Interview.find({}).populate('students.student').exec();
    return res.render('dashboard', {
        title:"Dashboard",
        students:students,
        interviews:interviews
    });
}

module.exports.destroySession = function(req,res)
{

  
  req.logout(function(err){
    if(err){
      console.error(err);
      return res.status(500).json({ message: 'Error logging out' });
    }
    else
    {
      req.flash('success','logout successfully');
    }
});

  return res.redirect('/');
}
