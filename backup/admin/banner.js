const app = require('express').Router();
const banner_model = require('./../model/banner');
const {uploadImage} = require('./../library/uploader');
const pr_date = require('./../library/persian_date_helper');
const auth = require('./../helper/auth');
const users_model = require('./../model/admin');
app.post('/add', uploadImage.single('img'), (req, res) => {
    auth.check(req)
        .then(async (r) => {
            let as = await users_model.findOne({username: r.username}).exec();
            let body = {};
            body.img = req.file.filename;
            body.ref = 'btrns';
            body.created = new Date();
            banner_model.findOneAndUpdate({type: req.body.type}, body, {upsert: true}, (e) => {
                res.render('admin/banners/add.ejs', {d: true, pr: as.perm})
            });
        })
        .catch(() => {
            res.redirect('/admin/login')
        })
});
app.get('/get', (req, res) => {
    auth.check(req)
        .then(() => {
            news_model.find({}, (e, data) => {
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
app.post('/edit_:id', uploadImage.single('img'), (req, res) => {
    auth.check(req)
        .then(async (r) => {
            let as = await users_model.findOne({username: r.username}).exec();
            let body = {
                ref: 'btrns'
            };
            if (req.file) {
                body.img = req.file.filename;
            }
            news_model.findOneAndUpdate({_id: req.params.id}, body, async (e, data) => {
                let d = await news_model.findOne({_id: req.params.id}).exec();
                res.render('admin/chart/edit.ejs', {d, s: true, pr: as.perm});
            })
        })
        .catch(() => {
            res.redirect('/admin/login')
        })
});
app.delete('/remove/:id', (req, res) => {
    auth.check(req)
        .then(() => {
            banner_model.findOneAndDelete({_id: req.params.id}, (e, data) => {
                res.send({
                    issuccessful: true
                })
            })
        })
        .catch(() => {
            res.redirect('/admin/login')
        })
});
app.get('/add', (req, res) => {
    auth.check(req)
        .then(async (r) => {
            let as=await users_model.findOne({username:r.username}).exec();
            res.render('admin/banners/add.ejs', {d: false,pr:as.perm})
        })
        .catch(() => {
            res.redirect('/admin/login')
        })
})
app.get('/:id', (req, res) => {
    auth.check(req)
        .then(async (r) => {
            let as = await users_model.findOne({username: r.username}).exec();
            news_model.findOne({_id: req.params.id}, (e, d) => {
                res.render('admin/chart/edit.ejs', {d, s: null, pr: as.perm});
            })
        })
        .catch((e) => {
            res.redirect('/admin/login')
        })
});
app.get('/', (req, res) => {
    auth.check(req)
        .then(async (r) => {
            let as = await users_model.findOne({username: r.username}).exec();
            banner_model.find({}, (e, data) => {
                let arr = [];
                for (let i in data) {
                    let obj = {};
                    obj.data=data[i]
                    switch (data[i].type) {
                        case 1:
                            obj.type = "دریک نگاه";
                            break;
                        case 2:
                            obj.type = "پیام مدیرعامل";
                            break;
                        case 3:
                            obj.type = "چارت سازمانی";
                            break;
                        case 5:
                            obj.type = "تماس با ما";
                            break;
                        case 6:
                            obj.type = "اخبار";
                            break;
                        case 7:
                            obj.type = "اطلاعیه";
                            break;
                        case 8:
                            obj.type = "چند رسانه ای";
                            break;
                        case 9:
                            obj.type = "مناقصه و مزایده ";
                            break;
                        case 10:
                            obj.type = "همکاری با ما";
                            break;
                        case 11:
                            obj.type = "ارتباط با واحد سهام";
                            break;
                            case 12:
                            obj.type = "محصولات";
                            break;
                            case 13:
                                obj.type = "گزارشات";
                                break;
                                case 14:
                                obj.type = "استخدام";
                                break;
                                case 15:
                                    obj.type = "کاتالوگ";
                                    break;
                                    case 16:
                                        obj.type = "سیاست های راهبردی";
                                        break;
                                        case 17:
                                        obj.type = "امور مشتریان";
                                        break;
                    }
                    arr.push(obj)
                }
               res.render('admin/banners/index.ejs', {data:arr, pr: as.perm})
            })
        })
        .catch(() => {
            res.redirect('/admin/login')
        })
});
module.exports = app;