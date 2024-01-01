const express =require('express');
const router =express.Router();

const studentController =require('../controllers/student_controller');
const passport = require('passport');


router.post('/add-student',studentController.addStudent);

router.get('/edit/:id',studentController.renderEditStudentForm);

router.post('/update/:id',studentController.update);
router.get('/destroy/:id', studentController.destroy);

router.get('/download-reports' ,studentController.downloadReports);

module.exports=router;