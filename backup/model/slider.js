const mongoose =require('mongoose');
const Schema=mongoose.Schema;
let user_schema=new Schema({
    is_video:{type:Boolean},
    img:{type:String},
    created:{type:Date,default:new Date()},
    video:{type:String},
});
module.exports=mongoose.model('slider',user_schema);
