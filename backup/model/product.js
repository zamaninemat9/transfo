const mongoose =require('mongoose');
const Schema=mongoose.Schema;
let user_schema=new Schema({
    title:{type:String},
    img1:{type:String},
    description1:{type:String},
    description2:{type:String},
    link:{type:String},
    img2:{type:String},
    img3:{type:String},
    img4:{type:String},
    created:{type:Date,default:new Date()},
    parent:{type:Number}
});
module.exports=mongoose.model('product',user_schema);
