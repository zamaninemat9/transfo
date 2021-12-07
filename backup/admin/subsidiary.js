const app = require('express').Router();
const tabe_model = require('./../model/tabe');
const {uploadImage} = require('./../library/uploader');
const pr_date = require('./../library/persian_date_helper');
const auth = require('./../helper/auth');
let cpUpload = uploadImage.fields([{name: 'img1', maxCount: 1}, {name: 'img2', maxCount: 2}])
const users_model = require('./../model/admin');
app.post('/add',cpUpload, (req, res) => {
    auth.check(req)
        .then(async (r) => {
            let body = req.body;
            body.img1 = req.files.img1[0].filename;
            body.img2 = req.files.img2[0].filename;
            body.created = new Date();
            let a = new tabe_model(body).save((e,d) => {
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
            tabe_model.find({}, (e, data) => {
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
            let body = req.body;
            if (req.files.img1) {
                body.img1 = req.files.img1[0].filename;
            }
            if (req.files.img2) {
                body.img2 = req.files.img2[0].filename;
            }
            tabe_model.findOneAndUpdate({_id: req.params.id}, body, async (e, data) => {
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
                issuccessful: false,
                status: 403
            })
        })

});
app.delete('/remove/:id', (req, res) => {
    auth.check(req)
        .then(() => {
            tabe_model.findOneAndDelete({_id: req.params.id}, (e, data) => {
                res.send({
                    issuccessful: true
                })
            })
        })
        .catch(() => {
            res.send({
                issuccessful: fa,
                status: 403
            })
        })
});
app.get('/add', (req, res) => {
    auth.check(req)
        .then(async (r) => {
            let as = await users_model.findOne({username: r.username}).exec();
            res.render('admin/tabe/add.ejs', {d: false, pr: as.perm})
        })
        .catch(() => {
            res.redirect('/admin/login')
        })
})
app.get('/:id', (req, res) => {
    auth.check(req)
        .then((r) => {
            tabe_model.findOne({_id: req.params.id}, async (e, d) => {
                let as = await users_model.findOne({username: r.username}).exec();
                res.render('admin/tabe/edit.ejs', {data: d, d: null, pr: as.perm});
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
            let data = await tabe_model.find().sort({_id: -1}).exec()
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
            // return res.send(a)
            res.render('admin/tabe/index.ejs', {data: a, pr: as.perm})
        })
        .catch(() => {
            res.redirect('/admin/login')
        })
});
module.exports = app;