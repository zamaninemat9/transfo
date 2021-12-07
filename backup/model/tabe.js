const mongoose =require('mongoose');
const Schema=mongoose.Schema;
let user_schema=new Schema({
    title:{type:String},
    description1:{type:String},
    description2:{type:String},
    description3:{type:String},
    img1:{type:String},
    img2:{type:String},
    phone:{type:String},
    site:{type:String},
    address:{type:String},
    created:{type:Date,default:new Date()},
});
module.exports=mongoose.model('tabe',user_schema);
