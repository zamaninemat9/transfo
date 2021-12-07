const mongoose =require('mongoose');
const Schema=mongoose.Schema;
let user_schema=new Schema({
    name:{type:String},
    email:{type:String},
    text:{type:String},
    created:{type:Date},
});
module.exports=mongoose.model('contactus',user_schema);
