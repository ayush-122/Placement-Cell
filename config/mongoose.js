const mongoose =require('mongoose');

mongoose.connect("mongodb://localhost/placment_cell");

const db =mongoose.connection;

db.on('error', console.error.bind(console,"error connecting to database"));

db.once('open',function()
{
    console.log("connect to database:: MongoDB");
})

module.exports =db;