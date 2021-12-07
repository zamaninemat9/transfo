const app = require('express').Router();
const news_model = require('./../model/gallery');
const {uploadImage} = require('./../library/uploader');
const pr_date = require('./../library/persian_date_helper');
const auth = require('./../helper/auth');
const users_model = require('./../model/admin');
app.post('/add', uploadImage.single('img'), (req, res) => {
    auth.check(req)
        .then(async (r) => {
            let as = await users_model.findOne({username: r.username}).exec();
            let body = {};
            body.img = req.file.filename
            body.created = new Date();
            let a = new news_model(body).save(() => {
                res.render('admin/gallery/add.ejs', {d: true, pr: as.perm})
            })
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
                title: req.body.title,
                description: req.body.description,
            };
            if (req.file) {
                body.img = req.file.filename;
            }
            news_model.findOneAndUpdate({_id: req.params.id}, body, async (e, data) => {
                let d = await news_model.findOne({_id: req.params.id}).exec();
                res.render('admin/gallery/edit.ejs', {d, s: true, pr: as.perm});
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
app.get('/add', (req, res) => {
    auth.check(req)
        .then(async (r) => {
            let as = await users_model.findOne({username: r.username}).exec();
            res.render('admin/gallery/add.ejs', {d: false, pr: as.perm})
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
                res.render('admin/gallery/edit.ejs', {d, s: null, pr: as.perm});
            })
        })
        .catch(() => {
            res.redirect('/admin/login')
        })
});
app.get('/', (req, res) => {
    auth.check(req)
        .then(async (r) => {
            let as = await users_model.findOne({username: r.username}).exec();
            let data = await news_model.find().sort({_id: -1}).exec()

            let a = [];
            let co = 1;
            for (let i in data) {
                let ob = {};
                ob.data = data[i];
                ob.n_d = pr_date.get_def_date(data[i].created);
                ob.num = co;
                a.push(ob);
                co++;
            }
            res.render('admin/gallery/index.ejs', {data: a, pr: as.perm})
        })
        .catch(() => {
            res.redirect('/admin/login')
        })
});
module.exports = app;