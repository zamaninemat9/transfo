const mongoose =require('mongoose');
const Schema=mongoose.Schema;
let user_schema=new Schema({
    socialName:{type:String},
    socialLink:{type:String},
    status:{type:Boolean},
});
module.exports=mongoose.model('social',user_schema);
