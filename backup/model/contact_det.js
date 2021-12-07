const mongoose =require('mongoose');
const Schema=mongoose.Schema;
let user_schema=new Schema({
    central_office:{type:String},
    post_code:{type:String},
    central_office_phone:{type:String},
    fax:{type:String},
    zanjan_company:{type:String},
    post_code_2:{type:String},
    zanjan_company_phone:{type:String},
    fax_2:{type:String},
    key:{type:String},
    created:{type:Date,default:new Date()},
});
module.exports=mongoose.model('contact_det',user_schema);
