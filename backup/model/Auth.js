const mongoose =require('mongoose');
const Schema=mongoose.Schema;
let user_schema=new Schema({
    ttl:{type:Date},
    ip:{type:String},
    agent:{type:String},
    uuid:{type:String},
    username:{type:String},
});
module.exports=mongoose.model('auth',user_schema);
