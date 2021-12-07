const mongoose =require('mongoose');
const Schema=mongoose.Schema;
let user_schema=new Schema({
    video:{type:String},
    created:{type:Date,default:new Date()},
});
module.exports=mongoose.model('videos',user_schema);
