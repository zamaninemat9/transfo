const mongoose =require('mongoose');
const Schema=mongoose.Schema;
let user_schema=new Schema({
    title:{type:String},
    img:{type:String},
    description:{type:String},
    created:{type:Date,default:new Date()},
    file:{type:String},
});
module.exports=mongoose.model('reporting',user_schema);
