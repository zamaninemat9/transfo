const app = require('express').Router();
const admin_model = require('./../model/admin');
const auth_model = require('./../model/Auth');
const enc_hlp = require('./../helper/e_n_c');
const rp=require('request-promise')
const {v4: uuidv4} = require('uuid');
app.get('/login', (rqe, res) => {
    res.render('admin/login.ejs',{d:false,f:null})
});

app.post('/login',async (req, res) => {
  //let opt2={
   //  uri:'https://cpch.ir/v1.0/check/hl6DZ6c1dfz7UwTSn',
   // body:{
    //    captcha:req.body.captcha,
     //   captcha_code:req.body.captcha_code,
     //   user_agent:req.get('User-Agent'),
      //  ip:req.headers['x-forwarded-for'] || req.connection.remoteAddress
   // },
   //  method:'POST',
    //  json:true
   // };
    //let check_cap=await rp(opt2);
   // if(!check_cap.status) return res.render('admin/login.ejs', {d: true,f:"کد امنیتی صحیح نمیباشد"});
    let username = req.body.username;
    admin_model.findOne({username},async (e, data) => {
        if (!data) return res.render('admin/login.ejs', {d: true,f:"نام کاربری یا رمز عبور صحیح نمیباشد"});
        let chck = await enc_hlp.check({password: req.body.password, hash: data.hash, salt: data.salt});
        if (!chck) return res.render('admin/login.ejs', {d: true,f:"نام کاربری یا رمز عبور صحیح نمیباشد"});
        let uuid = uuidv4() + new Date().getTime();
        let ttl = new Date(new Date().getTime() + 60000 * 60*50);
        let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        ip=ip.split(":")[0];
        let agent = req.get('User-Agent')
        auth_model.findOneAndDelete({username}, (e, r) => {
            let a = new auth_model({
                uuid,
                ttl,
                ip,
                agent,
                username
            }).save((e, data) => {
                res.cookie('uuid', uuid, {maxAge: 900000, httpOnly: true});
                res.redirect('/admin')
            })
        });
    })
});

// app.get('/ggg',async (req, res) => {
//     let password = "123456";
//     let ps =await enc_hlp.hash({password});
//     let a = new admin_model({
//         username: "ostad",
//         hash:ps.hash,
//         salt:ps.salt
//     }).save((e, d) => {
//         res.send(d)
//     })
// });
module.exports = app;