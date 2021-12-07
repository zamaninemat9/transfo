const mongoose =require('mongoose');
const Schema=mongoose.Schema;
let user_schema=new Schema({
    img:{type:String},
    ref:{type:String},
    created:{type:Date,default:new Date()},
});
module.exports=mongoose.model('chart',user_schema);
