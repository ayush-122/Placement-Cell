const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

//authentication using passport js

//mongoose do not use callback

passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback:true,
},
    async function (req,email, password, done) {
        try {
              
            let validEmail= email.endsWith('@codingninjas.in');
            console.log(` email validation is ${validEmail}`);
            if(!validEmail)
            {
                req.flash('error','user does not exists in coding ninjas domain');
                return done(null ,false,{message:'User does not exist in our domain'});
            }
            const user = await User.findOne({ email: email });

            if (!user || user.password != password) {
                req.flash('error','Invalid UserName/Password');
                return done(null, false);

            }
            
            return done(null ,user);
        }
        catch (error) {
            console.log('Error in finding user -->Passport');
            return done(error);
        }
    }
));

//Serializing the user to decide which key is to kept in the cookies    

passport.serializeUser(function(user ,done)
{
  done(null ,user.id);
});

//deserializing the user from the key in the cookies

passport.deserializeUser( async function(id,done)
{
    try{
   const user = await  User.findById(id);
     return done(null ,user);
    }
    catch(error){
        console.log('Error in finding user -->Passport');
        return done(error);
         
    }
})  

//check if user is authenticated

passport.checkAuthentication =function(req ,res ,next)
{
    //if user is signed in,then pass on the request to the next function(controller's action)
    if(req.isAuthenticated())
    {
        return next();
    }
    //if user is not sign in
    return (res.redirect('/'));
}

passport.setAuthenticatedUser =function(req, res,next)
{
   if(req.isAuthenticated())
   {
    //req.user contains the current signed in user from the session cookie and we are just
    //sending this to the locals for the views.
    res.locals.user=req.user;
   }
   next();
}
module.exports =passport;