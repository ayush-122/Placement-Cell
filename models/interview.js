const mongoose =require('mongoose');

const interviewSchema =new mongoose.Schema({
    company:{
        type:String,
        required:true,
        unique:true
    },

    visitDate:{
        type:String,
        
        required:true
    },

    students: [
        {
            student: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Student',
            },

            result: {
                type: String,
                enum: ['On Hold', 'Selected', 'Pending', 'Not Selected', 'Did not Attempt'],
            },
        },
    ],

},
  {timestamps:true}
);

const Interview = mongoose.model('Interview', interviewSchema);

module.exports = Interview;