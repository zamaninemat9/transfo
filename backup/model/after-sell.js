const mongoose =require('mongoose');
const Schema=mongoose.Schema;
let user_schema=new Schema({
    text:{type:String},
    created:{type:Date,default:new Date()},
});
module.exports=mongoose.model('after_sell',user_schema);
