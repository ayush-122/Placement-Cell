const express =require('express');
const router =express.Router();

const usersController =require('../controllers/users_controller');

const homeController =require('../controllers/home_controller')
const passport = require('passport');



router.post('/create', usersController.create);

router.get('/dashboard',passport.checkAuthentication,usersController.dashboard);

router.post('/create-session',passport.authenticate('local',{
    failureRedirect:'/'
}) ,
usersController.createSession);

router.get('/sign-out',passport.checkAuthentication,usersController.destroySession);

module.exports=router;