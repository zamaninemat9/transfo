const mongoose =require('mongoose');
const Schema=mongoose.Schema;
let user_schema=new Schema({
    description:{type:String},
    ref:{type:String},
    created:{type:Date,default:new Date()},
});
module.exports=mongoose.model('about',user_schema);
