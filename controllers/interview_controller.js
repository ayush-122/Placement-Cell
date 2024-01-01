const Student =require('../models/student');
const Interview =require('../models/interview');


module.exports.interview=async function(req,res)
{
    const students =await Student.find({});
    res.render('interview',{title:'interview',
students:students
});
}

module.exports.create=async function(req,res)
{
    console.log(req.body);

    try
    {
    await Interview.create(req.body);
    }
    catch(error)
    {
        console.log(`error in creating company interviews: ${error}`);
    }
    
    try{
    
    req.flash('success','interview is created');
    return res.redirect('back');
}
catch(error)
{
    console.log("error in displaying dashboard line 25 line 26 in interview_controller");
}
}

module.exports.interviewList= async function(req,res)
{
    const students =await Student.find({});
    const interview= await Interview.findById(req.params.id)
                                    .populate('students.student').exec();
  return res.render('interviewlist',{
    title:'allocate student',
    students,
    interview:interview
  });
}

module.exports.allocateStudent = async function (req, res) {
  try {
    let { interviewId, studentId } = req.body;

    const interview = await Interview.findById(interviewId);
    const student = await Student.findById(studentId);

    if (!interview || !student) {
      console.log('Interview or student not found');
      return res.status(404).send('Interview or student not found');
    }

    console.log(interview);
    const isStudentExists = interview.students.some(studentObj => studentObj.student == studentId);

    if (!isStudentExists) {
      // push the student id and result into the students array in the Interview document
      interview.students.push({
        student: studentId,
        result: "Pending"
      });
      await interview.save();
      console.log(interview);

      // push the interview id into the student document
      try{
      student.interviews.push(interviewId);

      await student.save();
      req.flash('success','student is alloted to interview');

      // console.log('bhai me student hoon',student);
    }
    catch(error)
    {
      console.log('error in pushing students',error);
    }
    } else {
      req.flash('error','Student is already allocated to this company');
    }
     
    return res.redirect('back');
  } catch (error) {
    console.error('Error in allocateStudent:', error);
    return res.status(500).send('Internal Server Error');
  }
};


// interviewController.js


exports.updateResult = async (req, res) => {
  try {
    const { interviewId, studentId } = req.params;
    const { result } = req.body;

    // Ensure the result value is one of the allowed values
    const allowedResults = ['On Hold', 'Selected', 'Pending', 'Not Selected', 'Did not Attempt'];
    if (!allowedResults.includes(result)) {
      return res.status(400).send('Invalid result value');
    }

    // Update the result in the database
    await Interview.updateOne(
      { '_id': interviewId, 'students.student': studentId },
      { $set: { 'students.$.result': result } }
    ); 

    if(result =='Selected')
    {
    await Student.findByIdAndUpdate(studentId,{status:'placed'});
    }
    // Redirect back to the interview details page
    res.redirect('back');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports.destroy =async function(req,res)
{
    try
    {
      const interviewId =req.params.id
      const interview = await Interview.findById(interviewId);

    if (interview) {
      // Iterate over each student in the interview
      for (const studentRef of interview.students) {
        const studentId = studentRef.student;

        // Remove the interview reference from the student's interviews array
        await Student.findByIdAndUpdate(studentId, {
          $pull: { interviews: interviewId }
        });
      }
        await Interview.findByIdAndDelete(req.params.id);
        req.flash('success','interview is deleted');
        return res.redirect('back');

    }}
    catch(error)
    {
        console.log('error in deleting interview' ,error);
        return res.redirect('back');
    }


}
