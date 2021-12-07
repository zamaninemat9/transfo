const mongoose =require('mongoose');
const Schema=mongoose.Schema;
let user_schema=new Schema({
    img:{type:String},
    ref:{type:String},
    type:{type:Number},
    created:{type:Date,default:new Date()},
});
module.exports=mongoose.model('banner',user_schema);
