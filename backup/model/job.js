const mongoose =require('mongoose');
const Schema=mongoose.Schema;
let user_schema=new Schema({
    title:{type:String},
    img:{type:String},
    img1:{type:String},
    description:{type:String},
    created:{type:Date,default:new Date()},
});
module.exports=mongoose.model('job',user_schema);
