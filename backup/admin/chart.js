const app = require('express').Router();
const news_model = require('./../model/chart');
const {uploadImage} = require('./../library/uploader');
const pr_date = require('./../library/persian_date_helper');
const auth = require('./../helper/auth');
const users_model=require('./../model/admin');
// app.post('/add', uploadImage.single('img'), (req, res) => {
//     auth.check(req)
//         .then(async (r) => {
//             let as=await users_model.findOne({username:r.username}).exec();
//             let body={};
//             body.img=req.file.filename
//             body.ref='btrns'
//             body.created= new Date();
//             let a = new news_model(body).save(() => {
//                 res.render('admin/chart/add.ejs', {d: true,pr:as.perm})
//             })
//         })
//         .catch(() => {
//             res.redirect('/admin/login')
//         })
// });
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
                let as=await users_model.findOne({username:r.username}).exec();
            let body = {
                ref: 'btrns'
            };
            if (req.file) {
                body.img = req.file.filename;
            }
            news_model.findOneAndUpdate({_id: req.params.id}, body, async (e, data) => {
                let d = await news_model.findOne({_id: req.params.id}).exec();
                res.render('admin/chart/edit.ejs', {d, s: true,pr:as.perm});
            })
        })
        .catch(() => {
            res.redirect('/admin/login')
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
            res.redirect('/admin/login')
        })
});
// app.get('/add', (req, res) => {
//     auth.check(req)
//         .then(async (r) => {
//             let as=await users_model.findOne({username:r.username}).exec();
//             res.render('admin/chart/add.ejs', {d: false,pr:as.perm})
//         })
//         .catch(() => {
//             res.redirect('/admin/login')
//         })
// })
app.get('/:id', (req, res) => {
    auth.check(req)
        .then(async (r) => {
            let as=await users_model.findOne({username:r.username}).exec();
            news_model.findOne({_id: req.params.id}, (e, d) => {
                res.render('admin/chart/edit.ejs', {d, s: null,pr:as.perm});
            })
        })
        .catch((e) => {
            res.redirect('/admin/login')
        })
});
app.get('/', (req, res) => {
    auth.check(req)
        .then(async (r) => {
            let as=await users_model.findOne({username:r.username}).exec();
            news_model.find({}, (e, data) => {
                res.render('admin/chart/index.ejs', {data,pr:as.perm})
            })
        })
        .catch(() => {
            res.redirect('/admin/login')
        })
});
module.exports = app;