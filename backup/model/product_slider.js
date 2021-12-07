const mongoose =require('mongoose');
const Schema=mongoose.Schema;
let user_schema=new Schema({
    title:{type:String},
    img:{type:String},
    description:{type:String},
    link:{type:String},
    created:{type:Date,default:new Date()},
});
module.exports=mongoose.model('product_slider',user_schema);
