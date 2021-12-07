const mongoose =require('mongoose');
const Schema=mongoose.Schema;
let user_schema=new Schema({
    job:{type:String},
    name:{type:String},
    mobile:{type:String},
    resume:{type:String},
    created:{type:Date,default:new Date()},
});
module.exports=mongoose.model('persons',user_schema);
