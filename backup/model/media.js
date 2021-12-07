const mongoose =require('mongoose');
const Schema=mongoose.Schema;
let user_schema=new Schema({
    title:{type:String},
    description:{type:String},
    created:{type:Date,default:new Date()},
    img:{type:String},
    video:{type:String},
    video2:{type:String},
    video3:{type:String},
    video4:{type:String},
});
module.exports=mongoose.model('media',user_schema);
