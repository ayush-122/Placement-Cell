const mongoose =require('mongoose');

const studentSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,

    },
   phoneNumber  :{
        type:Number,
        required:true,
        unique:true
    },
    batch:{
        type:String,
        required:true
    },

    college:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    },
    reactScore:{
        type:Number,
        required:true
    },
    webdScore:{
        type:Number,
        required:true
    },
    dsaScore:{
        type:Number,
        required:true
    },

    interviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'interview'
        }
    ]




    
}, {timestamps:true}
);

// variable User now represents the Mongoose model for the 'User' collection.

const Student = mongoose.model('Student' ,studentSchema);

module.exports=Student;