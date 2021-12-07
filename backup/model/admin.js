const mongoose =require('mongoose');
const Schema=mongoose.Schema;
let user_schema=new Schema({
    username:{type:String},
    perm:{type:Array},
    hash:{type:String},
    salt:{type:String},
    created:{type:Date},
});
module.exports=mongoose.model('admin',user_schema);
