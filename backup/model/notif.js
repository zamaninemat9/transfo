const mongoose =require('mongoose');
const Schema=mongoose.Schema;
let user_schema=new Schema({
    title:{type:String},
    img1:{type:String},
    img2:{type:String},
    img3:{type:String},
    img4:{type:String},
    img5:{type:String},
    description:{type:String},
    created:{type:Date,default:new Date()},
});
module.exports=mongoose.model('notif',user_schema);
