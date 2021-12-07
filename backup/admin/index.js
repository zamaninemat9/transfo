const app = require('express').Router();
const pr_hlp=require('./../library/persian_date_helper');
// MODELS
const news_model = require('./../model/news');
const product_model = require('./../model/product');
const product_slider_model = require('./../model/product_slider');
const social_model = require('./../model/social');
const contact_model = require('./../model/contactus');
const tabe_model=require('./../model/tabe');
const auth=require('./../helper/auth');
const auth_model=require('./../model/Auth');
const users_model=require('./../model/admin')
//ROUTES
app.get('/', (req, res) => {

    auth.check(req)
        .then(async (r)=>{
            let a=await users_model.findOne({username:r.username}).exec();
            dashboard_data()
                .then(data=>{
                    res.render('admin/index.ejs',{data,pr:a.perm})
                })
        })
        .catch(()=>{
            res.redirect('/admin/login')
        })

});
app.use('/', require('./login'));



app.use('/news', require('./news'));
app.use('/job', require('./job'));
app.use('/video', require('./video'));
app.use('/after_sell', require('./after_sell'));
app.use('/contact_det', require('./contact_det'));
app.use('/slider', require('./slider'));
app.use('/mzyd', require('./mzyd'));
app.use('/tabe_news', require('./tabe_news'));
app.use('/notif', require('./notif'));
app.use('/product_slider', require('./product_Slider'));
app.use('/social', require('./social'));
app.use('/product', require('./product'));
app.use('/fast_link', require('./fast_link'));
app.use('/gallery', require('./gallery'));
app.use('/media', require('./media'));
app.use('/chart', require('./chart'));
app.use('/rahbord', require('./rahbord'));
app.use('/about', require('./about'));
app.use('/catalog', require('./catalog'));
app.use('/reporting', require('./reporting'));
app.use('/subsidiary', require('./subsidiary'));
app.use('/contact', require('./contact'));
app.use('/legal_crm',require('./legal_crm'));
app.use('/actual_crm',require('./actual_crm'));
app.use('/users',require('./users'));
app.use('/banner',require('./banner'));
app.use('/coop',require('./coop'));
app.use('/news_slider',require('./news_slider'));
module.exports = app;
const dashboard_data = () => {
    return new Promise(async (resolve, reject) => {
        let contact = await contact_model.find({}).sort({_id: -1}).limit(5).exec();
        let cn=[];
        for(let i in contact){
            let obj={};
            obj.data=contact[i];
            obj.cr=pr_hlp.get_def_date(contact[i].created)
            cn.push(obj)
        }
        let news = await news_model.count().exec();
        let product = await product_model.count().exec();
        let product_slider = await product_slider_model.count().exec();
        let tabe = await tabe_model.count().exec();
        let social = await social_model.find().exec();
        resolve({
            contact:cn,
            tabe,
            news,
            product,
            product_slider,
            social
        })
    })


};
app.get('/check_perm/:n',(req,res)=>{
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    ip=ip.split(":")[0];
    let agent =  req.get('User-Agent');
    auth_model.findOne({uuid: req.cookies.uuid, agent, ip}, (e, d) => {
        if(!d) return res.send(false);
        let username=d.username;
        users_model.findOne({username},(e,data)=>{
            if(!data) return res.send(false);
            if(data.perm.indexOf(req.params.n)!==-1){
                res.send(true)
            }else{
                res.send(false)
            }
        })
    })

});
app.get('/logout',(req,res)=>{
	 let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    ip=ip.split(":")[0];
    let agent =  req.get('User-Agent');
	auth_model.findOneAndDelete({uuid: req.cookies.uuid,agent, ip},(e,d)=>{
		res.redirect('/admin')
	})
	
})