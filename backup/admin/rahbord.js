const app = require('express').Router();
const rahbord_model = require('./../model/rahbord');
const {uploadImage} = require('./../library/uploader');
const pr_date = require('./../library/persian_date_helper');
const auth = require('./../helper/auth');
const users_model=require('./../model/admin');
app.post('/add', uploadImage.single('img'), (req, res) => {
    auth.check(req)
        .then(async (r) => {
            let a = new rahbord_model({
                img: req.file.filename,
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
            rahbord_model.find({}, (e, data) => {
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
            let body = {
                title: req.body.title,
                description: req.body.description,
            };
            if (req.file) {
                body.img = req.file.filename;
            }
            rahbord_model.findOneAndUpdate({_id: req.params.id}, body, async (e, data) => {
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
            rahbord_model.findOneAndDelete({_id: req.params.id}, (e, data) => {
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
            res.render('admin/rahbord/add.ejs', {d: false,pr:as.perm})
        })
        .catch(() => {
            res.redirect('/admin/login')
        })
})
app.get('/:id', (req, res) => {
    auth.check(req)
        .then(async (r) => {
            let as=await users_model.findOne({username:r.username}).exec();
            rahbord_model.findOne({_id: req.params.id}, (e, d) => {
                res.render('admin/rahbord/edit.ejs', {d, s: null,pr:as.perm});
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
                let data = await rahbord_model.find().sort({_id: -1}).exec()

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
                console.log(data);
                res.render('admin/rahbord/index.ejs', {data: a,pr:as.perm})
        })
        .catch(() => {
            res.redirect('/admin/login')

        })
    // res.render('./news/index.ejs')
});
module.exports = app;