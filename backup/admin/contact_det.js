const app = require('express').Router();
const f_s_model = require('./../model/contact_det');
const {uploadImage} = require('./../library/uploader');
const pr_date = require('./../library/persian_date_helper');
const auth = require('./../helper/auth');
const users_model=require('./../model/admin');
// app.post('/add', (req, res) => {
//     // auth.check(req)
//     //     .then(async (r) => {
//     //         let as=await users_model.findOne({username:r.username}).exec();
//             let a = new f_s_model({
//                 central_office:'تهران- خیابان شیرازی شمالی- خیابان حکیم اعظم – شماره ۱۵',
//                 post_code:'۱۵۹-۱۳۱۴۵',
//                 central_office_phone:'۱۲-۰۲۱۸۸۲۱۰۹۱۰',
//                 fax:'۰۲۱۸۸۲۱۰۹۱۵',
//                 zanjan_company:'کیلومتر ۴ جاده قدیم زنجان تهران',
//                 post_code_2:'۱۸-۱۱-۴۵۱۳۵',
//                 zanjan_company_phone:'۵-۰۲۴۳۳۷۹۰۷۶۰',
//                 fax_2:'۰۲۴۳۳۷۹۰۷۸۰',
//                 key:'btrns',
//                 created: new Date()
//             }).save((e,d) => {
//                 res.send({d})
//                 // res.render('admin/after_sell/add.ejs', {d: true,pr:as.perm})
//             })
//         // })
//         // .catch(() => {
//         //     res.redirect('/admin/login')
//         // })
// });
app.get('/get', (req, res) => {
    auth.check(req)
        .then(() => {
            f_s_model.find({}, (e, data) => {
                res.send({
                    issuccessful: true,
                    data
                })
            })
        })
        .catch(() => {
            res.send({
                issuccessful: false,
                status: 403
            })
        })
});
app.post('/edit_:id', (req, res) => {
    auth.check(req)
        .then(async (r) => {
                let as=await users_model.findOne({username:r.username}).exec();


            f_s_model.findOneAndUpdate({_id: req.params.id},req.body, async (e, data) => {

                let d = await f_s_model.findOne({_id: req.params.id}).exec();
                res.render('admin/contact_det/edit.ejs', {d, s: true,pr:as.perm});
            })
        })
        .catch(() => {
            res.redirect('/admin/login')
        })
});
app.get('/:id', (req, res) => {
    auth.check(req)
        .then(async (r) => {
            let as=await users_model.findOne({username:r.username}).exec();
            f_s_model.findOne({_id: req.params.id}, (e, d) => {
                res.render('admin/contact_det/edit.ejs', {d, s: null,pr:as.perm});
            })
        })
        .catch(() => {
            res.redirect('/admin/login')
        })
});
app.get('/', (req, res) => {
    auth.check(req)
        .then(async (r) => {
            let as=await users_model.findOne({username:r.username}).exec();
            f_s_model.findOne({key:"btrns"}, (e, data) => {
                res.render('admin/contact_det/index.ejs', {data,pr:as.perm})
            })
        })
        .catch(() => {
            res.redirect('/admin/login')

        })
    // res.render('./news/index.ejs')
});
module.exports = app;