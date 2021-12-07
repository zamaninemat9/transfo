const app = require('express').Router();
const notif_model = require('./../model/notif');
const {uploadImage} = require('./../library/uploader');
const pr_date = require('./../library/persian_date_helper');
const auth = require('./../helper/auth');
const users_model = require('./../model/admin');
let
    persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g],
    arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
let moment = require('jalali-moment');
let cpUpload = uploadImage.fields([{name: 'img1', maxCount: 1}, {name: 'img2', maxCount: 2}, {
    name: 'img3',
    maxCount: 3
}, {name: 'img4', maxCount: 4}, {name: 'img5', maxCount: 5}])
app.post('/add', cpUpload, (req, res) => {
    auth.check(req)
        .then(async (r) => {
            let to_date = fixNumbers(req.body.to_date);
            to_date = new Date(moment.from(to_date, 'fa', 'YYYY/M/D'));
            let body={
                img1: req.files.img1[0].filename,
                title: req.body.title,
                description: req.body.description,
                created: to_date
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
            let a = new notif_model(body).save((e) => {
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
            notif_model.find({}, (e, data) => {
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
            let to_date = fixNumbers(req.body.to_date);
            let body = {
                title: req.body.title,
                description: req.body.description,
                created: new Date(moment.from(to_date, 'fa', 'YYYY/M/D'))
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
            notif_model.findOneAndUpdate({_id: req.params.id}, body, async (e, data) => {
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
            notif_model.findOneAndDelete({_id: req.params.id}, (e, data) => {
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
            let as = await users_model.findOne({username: r.username}).exec();

            res.render('admin/notif/add.ejs', {d: false, pr: as.perm})
        })
        .catch(() => {
            res.redirect('/admin/login')
        })
})
app.get('/:id', (req, res) => {
    auth.check(req)
        .then(async (r) => {
            let as = await users_model.findOne({username: r.username}).exec();
            notif_model.findOne({_id: req.params.id}, (e, d) => {
                let date = pr_date.get_def_date(d.created, true)
                res.render('admin/notif/edit.ejs', {date, d, s: null, pr: as.perm});
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
            let data = await notif_model.find().sort({_id: -1}).exec()
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
            res.render('admin/notif/index.ejs', {data: a, pr: as.perm})
        })
        .catch(() => {
            res.redirect('/admin/login')

        })
    // res.render('./news/index.ejs')
});
module.exports = app;
let fixNumbers = function (str) {
    if (typeof str === 'string') {
        for (var i = 0; i < 10; i++) {
            str = str.replace(persianNumbers[i], i).replace(arabicNumbers[i], i);
        }
    }
    return str;
};