const app = require('express').Router();
const users_model = require('./../model/admin');
const pr_date = require('./../library/persian_date_helper');
const auth = require('./../helper/auth');
const enc_hlp = require('./../helper/e_n_c')
app.get('/', (req, res) => {
    auth.check(req)
        .then(async (r) => {
            let as = await users_model.findOne({username: r.username}).exec();

            users_model.find({}, async (e, data) => {
                let arr = [];
                for (let i in data) {
                    let obj = {};
                    obj.data = data[i];
                    let perms = [];
                    for (let b in data[i].perm) {
                        switch (data[i].perm[b]) {
                            case '1':
                                await perms.push('ادمین');
                                break;
                            case "2":
                                await perms.push('اخبار ، اطلاعیه ها');
                                break;
                            case "3":
                                await perms.push('شبکه های اجتماعی');
                                break;
                            case "4":
                                await perms.push('محصولات');
                                break;
                            case "5":
                                await perms.push('اسلایدر محصولات');
                                break;
                            case "6":
                                await perms.push('تماس با ما');
                                break;
                            case "7":
                                await perms.push('تماس با ما');
                                break;case "8":
                                await perms.push('مناقصه و مزایده');
                                break;case "9":
                                await perms.push('اسلایدر اصلی');
                                break;case "10":
                                await perms.push('لینک های سریع');
                                break;case "11":
                                await perms.push('خدمات پس از فروش');
                                break;case "12":
                                await perms.push('گالری تصاویر');
                                break;case "13":
                                await perms.push('چند رسانه ای');
                                break;case "14":
                                await perms.push('کاتالوگ');
                                break;case "15":
                                await perms.push('تاریخچه');
                                break;case "16":
                                await perms.push('تاریخچه');
                                break;case "17":
                                await perms.push('چارت سازمانی');
                                break;case "18":
                                await perms.push('همکاری با ما');
                                break;
                        }
                    }
                    perms = perms.join(' -- ');
                    obj.perm = perms;
                    arr.push(obj);
                }
                res.render('admin/users/index', {data: arr, pr: as.perm})
            })
        })
        // .catch(() => {
        //     res.redirect('/admin/login')
        // })
});
app.get('/edit_:id', (req, res) => {
    auth.check(req)
        .then(async (r) => {
            let as = await users_model.findOne({username: r.username}).exec();
            users_model.findOne({_id: req.params.id}, req.body, (e, d) => {
                res.render('admin/users/edit', {s: false, dt: null, d, pr: as.perm})
            });
        })
        .catch(() => {
            res.redirect('/admin/login')
        })
});
app.delete('/remove/:id', (req, res) => {
    auth.check(req)
        .then(async (r) => {
            users_model.findOneAndDelete({_id: req.params.id}, (e, d) => {
                res.send({
                    issuccessful: true
                })
            })
        })
        .catch(() => {
            res.redirect('/admin/login')
        })
});
app.post('/add', async (req, res) => {
    auth.check(req)
        .then(async (r) => {
            let as = await users_model.findOne({username: r.username}).exec();
            let password = req.body.password;
            password = await enc_hlp.hash({password});
            req.body.hash = password.hash;
            req.body.salt = password.salt;
            let a = new users_model(req.body).save((e, d) => {
                res.render('admin/users/add', {d: true, pr: as.perm})
            });
        })
        .catch(() => {
            res.redirect('/admin/login')
        })
});
app.get('/add', (req, res) => {
    auth.check(req)
        .then(async (r) => {
            let as = await users_model.findOne({username: r.username}).exec();
            res.render('admin/users/add', {d: false, pr: as.perm})
        })
        .catch(() => {
            res.redirect('/admin/login')
        })
});
app.get('/change_pass_:id', (req, res) => {
    auth.check(req)
        .then(async (r) => {
            let as = await users_model.findOne({username: r.username}).exec();
            users_model.findOne({_id: req.params.id}, (e, data) => {
                if (!data) return res.redirect('/admin/users')
                res.render('admin/users/change_password', {id: data._id, d: false, st: null, pr: as.perm});
            })
        })
        .catch(() => {
            res.redirect('/admin/login')
        })
});
app.post('/change_password_:id', (req, res) => {
    auth.check(req)
        .then(async (r) => {
            let as = await users_model.findOne({username: r.username}).exec();
            let body = {
                p: req.body.password,
                n: req.body.newpassword,
                c: req.body.confirmpassword,
            };
            if (!body.p || !body.n || !body.c) return res.render('admin/users/change_password', {
                id: req.params.id,
                d: false,
                st: "تمامی فیلد ها اجباری میباشند",
                pr: as.perm
            })
            if (body.n !== body.c) return res.render('admin/users/change_password', {
                id: req.params.id,
                d: false,
                st: "رمز عبور جدید و تکرار آن همخوانی ندارد",
                pr: as.perm
            })
            users_model.findOne({}, async (e, data) => {
                let chk = await enc_hlp.check({
                    password: body.p,
                    hash: data.hash,
                    salt: data.salt
                })
                if (!chk) return res.render('admin/users/change_password', {
                    id: req.params.id,
                    d: false,
                    st: "رمز عبور فعلی صحیح نمیباشد"
                    , pr: as.perm
                });
                let en = await enc_hlp.hash({password: body.n});
                users_model.findOneAndUpdate({_id: req.params.id}, {hash: en.hash, salt: en.salt}, (e, data) => {
                    res.render('admin/users/change_password', {id: data._id, d: true, st: null, pr: as.perm});
                })
            });
        })
        .catch(() => {
            res.redirect('/admin/login')
        })
});
app.post('/edit_:id', (req, res) => {
    auth.check(req)
        .then(async (r) => {
            let as = await users_model.findOne({username: r.username}).exec();
            users_model.findOneAndUpdate({_id: req.params.id}, req.body, (e, d) => {
                res.render('admin/users/edit', {s: true, dt: null, d, pr: as.perm})
            })
        })
        .catch(() => {
            res.redirect('/admin/login')
        })
});
module.exports = app;