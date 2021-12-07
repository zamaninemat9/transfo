const mongoose =require('mongoose');
const Schema=mongoose.Schema;
let user_schema=new Schema({
    title:{type:String},
    img:{type:String},
    description:{type:String},
    created:{type:Date,default:new Date()},
    file:{type:String},
    file2:{type:String},
    file3:{type:String},
    file4:{type:String},
});
module.exports=mongoose.model('mzyde',user_schema);
