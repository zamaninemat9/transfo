const app = require('express').Router();
const news_model = require('./../model/tabe_news');
const {uploadImage} = require('./../library/uploader');
const pr_date = require('./../library/persian_date_helper');
const auth = require('./../helper/auth');
const users_model = require('./../model/admin');
let cpUpload = uploadImage.fields([{name: 'img1', maxCount: 1}, {name: 'img2', maxCount: 2}, {
    name: 'img3',
    maxCount: 3
}, {name: 'img4', maxCount: 4}, {name: 'img5', maxCount: 5}])
app.post('/add', cpUpload, (req, res) => {
    auth.check(req)
        .then(async (r) => {
            let as = await users_model.findOne({username: r.username}).exec();
            let a = new news_model({
                img1: req.files.img1[0].filename,
                img2: req.files.img2[0].filename,
                img3: req.files.img3[0].filename,
                img4: req.files.img4[0].filename,
                img5: req.files.img5[0].filename,
                title: req.body.title,
                description: req.body.description,
                created: new Date()
            }).save(() => {
                res.render('admin/tabe_news/add.ejs', {d: true, pr: as.perm})
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
app.post('/edit_:id', cpUpload, (req, res) => {
    auth.check(req)
        .then(async (r) => {
            let as = await users_model.findOne({username: r.username}).exec();
            let body = {
                title: req.body.title,
                description: req.body.description,
            };
            if (req.files.img1) {
                body.img1 = req.files.img1[0].filename;
            }
            if (req.files.img2) {
                body.img2 = req.files.img2[0].filename;
            }
            if (req.files.img3) {
                body.img3 = req.files.img3[0].filename;
            }
            if (req.files.img4) {
                body.img4 = req.files.img4[0].filename;
            }
            if (req.files.img5) {
                body.img5 = req.files.img5[0].filename;
            }
            news_model.findOneAndUpdate({_id: req.params.id}, body, async (e, data) => {
                let d = await news_model.findOne({_id: req.params.id}).exec();
                res.render('admin/tabe_news/edit.ejs', {d, s: true, pr: as.perm});
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
            res.render('admin/tabe_news/add.ejs', {d: false, pr: as.perm})
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
                res.render('admin/tabe_news/edit.ejs', {d, s: null, pr: as.perm});
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
                ob.n_d = pr_date.get_def_date(data[i].created)
                ob.num = co;
                a.push(ob);
                co++;
            }
            console.log(data);
            res.render('admin/tabe_news/index.ejs', {data: a, pr: as.perm})
        })
        .catch(() => {
            res.redirect('/admin/login')

        })
    // res.render('./news/index.ejs')
});
module.exports = app;