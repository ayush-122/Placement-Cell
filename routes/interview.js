const express =require('express');
const router =express.Router();

const studentController =require('../controllers/student_controller');
const interviewController =require('../controllers/interview_controller');
const passport = require('passport');

router.get('/',interviewController.interview);
router.post('/create',interviewController.create);

router.get('/allocate/:id',interviewController.interviewList); 

router.post('/allocate',interviewController.allocateStudent);

router.post('/updateResult/:interviewId/:studentId', interviewController.updateResult);

router.get('/destroy/:id', interviewController.destroy);
module.exports=router;