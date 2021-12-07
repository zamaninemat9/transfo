const mongoose =require('mongoose');
const Schema=mongoose.Schema;
let user_schema=new Schema({
    fullName:{type:String},
    nationalCode:{type:String},
    mobile:{type:String},
    adress:{type:String},
    email:{type:String},
    fax:{type:String},
    request_title: {type: Number},
    // 1=>شکایت
    // 2=>پیشنهاد
    // 3=>استعلام
    product_serial_number: {type: String},
    volt: {type: Number},
    tavan: {type: Number},
    request_type: {type: Number},
    // 1=> فروش
    // 2=> خدمات پس از فروش
    forosh: {type: Number},
    // 1 => شرکت بازرگانی
    // 2 => نمایندگی فروش
    // 3 => فروش اینترنتی
    // 4 => ایران ترانسفو
    pas_az_forosh: {type: Number},
    // 1 => شرکت خدمات پس از فروش
    // 2 => نمایندگی خدمات پس از فروش
    product_type: {type: Number},
    /*
    1 => نرمال خشک
    2 => نرمال روغنی
    3 => ویژه خشک
    4 => ویژه روغنی
   * 5 => فوق توزیع خشک
   * 6 => فوق توضیع روغنی
   * 7 => قدرت روغنی
   * */
    created: {type: Date},
    request: {type: String},
    address: {type: String},
});
module.exports=mongoose.model('crm_actual',user_schema);
