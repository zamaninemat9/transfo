const mongoose =require('mongoose');
const Schema=mongoose.Schema;
let user_schema=new Schema({
    title:{type:String},
    img1:{type:String},
    img2:{type:String},
    img3:{type:String},
    img4:{type:String},
    img5:{type:String},
    img6:{type:String},
    img7:{type:String},
    img8:{type:String},
    img9:{type:String},
    img10:{type:String},
    description:{type:String},
    created:{type:Date,default:new Date()},
    tag:{type:Array}
});
module.exports=mongoose.model('news',user_schema);
