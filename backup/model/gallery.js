const mongoose =require('mongoose');
const Schema=mongoose.Schema;
let user_schema=new Schema({
    img:{type:String},
    created:{type:Date,default:new Date()},
});
module.exports=mongoose.model('galleries',user_schema);
