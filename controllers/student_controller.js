const Student =require('../models/student');
const Interview =require('../models/interview');
const json2csv =require('json2csv').Parser;
const fs =require('fs');

module.exports.addStudent= async function(req,res)
{
    try{
        console.log(req.body);
    await Student.create(req.body);
    }
    catch(error)
    {
        console.log(`error in creating student:${error}`);
    }
    

    return res.redirect("back");
}

module.exports.renderEditStudentForm = async function(req,res)
{
  try
  {
    const studentId= req.params.id;
    const student =await Student.findById(studentId);
    if(!student)
    {
        return res.status(404).render('error',{error:'Student not found'});
    }
    res.render('editStudent',{
        title:"Edit student",
        student});
  }
  catch(error)
  {
    console.log(`error rendering edit student form,${error}`);
    res.status(500).render('error',{error: 'Internal Server Error'});
  }
};

module.exports.update =async function(req,res)
{
    try {
        const studentId = req.params.id;
        const updatedData = {
            phoneNumber:req.body.phoneNumber,
            batch:req.body.batch,
            college:req.body.college,
            status:req.body.status,
            reactScore:req.body.reactScore,
            webdScore:req.body.webDScore,
            dsaScore:req.body.dsaScore



         
        };
    
        await Student.findByIdAndUpdate(studentId, updatedData);
    
        res.redirect('/users/dashboard'); // Redirect to the dashboard or the student list page
      } catch (error) {
        console.error(`Error updating student: ${error}`);
        res.status(500).render('error', { error: 'Internal Server Error' });
      }
}

module.exports.destroy= async function(req,res)
{
    try {
        const studentId = req.params.id;
        const student = await Student.findById(studentId);

    if (student) {
        for ( let interviewID of student.interviews)
        {
              await Interview.findByIdAndUpdate(interviewID,
                {
                  $pull: { students: studentId }
                });
        }


        await Student.findByIdAndDelete(studentId);
    
        res.redirect('/users/dashboard'); // Redirect to the dashboard or the student list page
      } }catch(error) {
        return console.error(`Error deleting student: ${error}`);
       
      }
}

module.exports.downloadReports= async function(req,res)
{
    try {
        // Fetch data from the Student collection
        const studentsData = await Student.find({});
    
        // Fetch data from the Interview collection
        const interviewsData = await Interview.find().populate({
          path: 'students.student',
          select: 'name college status dsaScore webdScore reactScore email',
        });
    
        // Combine student and interview data
        let combinedData=[];
         
        for(let student of studentsData)
        {
          console.log('length of student interviews',student.interviews.length);
          if(student.interviews.length>0)
          {
          for(let interviewId of student.interviews)
          {
            let interview =await Interview.findById(interviewId).populate({path:'students.student'});

            const interv= interview.students.find((interviewStudent)=>
              {
                console.log(interviewStudent.student.id ,'and', student.id);
                if(interviewStudent.student.id==student.id)
                  return interviewStudent;

              })
              // console.log('interv',interv);

            combinedData.push({
              email: student.email,
              name: student.name,
              college: student.college,
              status: student.status,
              dsaScore: student.dsaScore,
              webdScore: student.webdScore,
              reactScore: student.reactScore,
              interviewDate:interview.visitDate,
              interviewCompany:interview.company,
              interviewResult:interv.result
              
             })
          }
        }
        else
        {
          combinedData.push({
            email: student.email,
            name: student.name,
            college: student.college,
            status: student.status,
            dsaScore: student.dsaScore,
            webdScore: student.webdScore,
            reactScore: student.reactScore,
            interviewDate:'N/A',
            interviewCompany:'N/A',
            interviewResult:'N/A'
          })
        }
        }
        // Convert the data to CSV format
        if(combinedData.length==0)
        {
          // Use a template CSV file with only headers
      const templateCsv = 'email,name,college,status,dsaScore,webdScore,reactScore,interviewDate,interviewCompany,interviewResult\n';

      // Set the response headers for CSV download
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=template_data.csv');

      // Send the template CSV data in the response
      res.status(200).send(templateCsv);
        }
        else
        {
        const json2csvParser = new json2csv({ header: true });
        const csvData = json2csvParser.parse(combinedData);
    
        // Set the response headers for CSV download
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=downloaded_data.csv');
    
        // Send the CSV data in the response
        res.status(200).send(csvData);
      }
     } catch (error) {
        console.error('Error fetching or writing data:', error);
        res.status(500).send('Internal Server Error');
      } 

}