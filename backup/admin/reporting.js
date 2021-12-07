const app = require('express').Router();
const news_model = require('./../model/reporting');
const {uploadImage} = require('./../library/uploader');
const pr_date = require('./../library/persian_date_helper');
const auth = require('./../helper/auth');
const users_model=require('./../model/admin');
let cpUpload = uploadImage.fields([{name: 'file', maxCount: 1}, {name: 'img', maxCount: 1}])
app.post('/add', cpUpload, (req, res) => {
    auth.check(req)
        .then(async (r) => {
            let a = new news_model({
                img: req.files.img[0].filename,
                file: req.files.file[0].filename,
                title: req.body.title,
                description: req.body.description,
                created: new Date()
            }).save((e,d) => {
                if(e) return res.send({
                    status:500,
                    description:"خطا در ذخیره کردن "
                })
                res.send({
                    status:200
                })
            })
        })
        .catch(() => {
            res.send({
                status:403
            })
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
app.post('/edit_:id', cpUpload, (req, res) => {
    auth.check(req)
        .then(async (r) => {
            let body = {
                title: req.body.title,
                description: req.body.description,
            };
            if (req.file) {
                body.file = req.file.img[0].filename;
            }
            if (req.files.img) {
                body.img = req.files.img[0].filename;
            }
            news_model.findOneAndUpdate({_id: req.params.id}, body, async (e, data) => {
                if(e) return res.send({
                    status:500,
                    description:"خطا در ذخیره کردن "
                })
                res.send({
                    status:200
                })
            })
        })
        .catch(() => {
            res.send({
                status:403
            })
        })
});
app.delete('/remove/:id', (req, res) => {
    auth.check(req)
        .then(() => {
            news_model.findOneAndDelete({_id: req.params.id}, (e, data) => {
                res.send({
                    issuccessful: true
                })
            })
        })
        .catch(() => {
            res.send({
                status:403
            })
        })
});
app.get('/add', (req, res) => {

    auth.check(req)
        .then(async (r) => {
            let as=await users_model.findOne({username:r.username}).exec();
            res.render('admin/reporting/add.ejs', {d: false,pr:as.perm})
        })
        .catch(() => {
            res.redirect('/admin/login')
        })
})
app.get('/:id', (req, res) => {
    auth.check(req)
        .then(async (r) => {
            let as=await users_model.findOne({username:r.username}).exec();
            news_model.findOne({_id: req.params.id}, (e, d) => {
                res.render('admin/reporting/edit.ejs', {d, s: null,pr:as.perm});
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
            news_model.find({}, (e, data) => {
                let a = [];
                let co = 1;
                for (let i in data) {
                    let ob = {};
                    ob.data = data[i];
                    ob.n_d = pr_date.get_def_date(data[i].created)
                    ob.num = co;
                    a.push(ob);
                    co++;
                }
                console.log(data);
                res.render('admin/reporting/index.ejs', {data: a,pr:as.perm})
            })
        })
        .catch(() => {
            res.redirect('/admin/login')

        })
    // res.render('./news/index.ejs')
});
module.exports = app;