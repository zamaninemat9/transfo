const mongoose =require('mongoose');
const Schema=mongoose.Schema;
let user_schema=new Schema({
    name:{type:String},
    mobile:{type:String},
    site:{type:String},
    egh_code:{type:String},
    ho_status:{type:Number},
    ho_say:{type:String},
    z_nahveyetamin:{type:Number},
    z_neshany:{type:String},
    z_faaliyat:{type:String},
    z_sesal:{type:String},
    z_fullname:{type:String},
    z_semat:{type:String},
    z_tamas:{type:String},
    created:{type:Date,default:new Date()},
});
module.exports=mongoose.model('coop',user_schema);
