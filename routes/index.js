const express =require('express');

const router =express.Router();

const homeController= require('../controllers/home_controller');
const usersController =require('../controllers/users_controller');
const studentsController= require('../controllers/student_controller')
const interviewController= require('../controllers/interview_controller');


router.get('/', homeController.signIn);
router.get('/sign-up' ,homeController.signUp);

router.use('/interview',require('./interview'));
router.use('/student',require('./student'));
router.use('/users',require('./users'));

// router.use('/users', require('./users'))



module.exports =router;