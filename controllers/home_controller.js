const passport =require('passport');
const Student =require('../models/student')

const Interview =require('../models/interview');

//render the sign-up page
module.exports.signUp = function (req, res) {
    if(req.isAuthenticated())
    {
        return res.render('dashboard',{
            title:'dashboard'
        });
    }
  return res.render("user_signUp",{
   title:"Sign Up"
  });
};

//render the sign-in page
module.exports.signIn = async function (req, res) {
    if(req.isAuthenticated())
    {
        const students =await Student.find({});
        const interviews= await Interview.find({}).populate('students.student').exec();
        console.log("interviews lists are ",interviews);
        return res.render('dashboard',{
            title:'dashboard',
            students:students,
            interviews
        });
    }
  return res.render("user_signIn",{
   title:"Sign In"
  });
};