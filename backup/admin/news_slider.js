const app = require('express').Router();
const news_model = require('./../model/news_slider');
const {uploadImage} = require('./../library/uploader');
const pr_date = require('./../library/persian_date_helper');
const auth = require('./../helper/auth');
const users_model = require('./../model/admin');
let
    persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g],
    arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
let moment = require('jalali-moment');
app.post('/add', uploadImage.single('img'), (req, res) => {
    auth.check(req)
        .then(async (r) => {
            let as = await users_model.findOne({username: r.username}).exec();
			let to_date = fixNumbers(req.body.to_date);
    to_date = new Date(moment.from(to_date, 'fa', 'YYYY/M/D'));
            let a = new news_model({
                img: req.file.filename,
                title: req.body.title,
                description: req.body.description,
                link: req.body.link,
                created: to_date
            }).save(() => {
                res.render('admin/news_slider/add.ejs', {d: true, pr: as.perm})
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
			let to_date = fixNumbers(req.body.to_date);
			
            let body = {
                title: req.body.title,
                link:req.body.link,
                description: req.body.description,
				created:new Date(moment.from(to_date, 'fa', 'YYYY/M/D'))
            };
			console.log(body)
            if (req.file) {
                body.img = req.file.filename;
            }
            news_model.findOneAndUpdate({_id: req.params.id}, body, async (e, data) => {
				
                let d = await news_model.findOne({_id: req.params.id}).exec();
				let date=pr_date.get_def_date(d.created,true)
                res.render('admin/news_slider/edit.ejs', {date,d, s: true, pr: as.perm});
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
            res.send({
                issuccessful: false,
                status: 403
            })
        })
});
app.get('/add', (req, res) => {
    auth.check(req)
        .then(async (r) => {
            let as = await users_model.findOne({username: r.username}).exec();
            res.render('admin/news_slider/add.ejs', {d: false, pr: as.perm})
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
				let date=pr_date.get_def_date(d.created,true)
                res.render('admin/news_slider/edit.ejs', {date,d, s: null, pr: as.perm});
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
                res.render('admin/news_slider/index.ejs', {data: a, pr: as.perm})
        })
        .catch((e) => {
            console.log(e);
            // res.redirect('/admin/login')
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