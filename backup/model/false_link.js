const mongoose =require('mongoose');
const Schema=mongoose.Schema;
let user_schema=new Schema({
    title:{type:String},
    link:{type:String},
    created:{type:Date,default:new Date()},
});
module.exports=mongoose.model('fast_link',user_schema);
