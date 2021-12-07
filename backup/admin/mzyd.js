const app = require('express').Router();
const news_model = require('./../model/mzyd');
const {uploadImage} = require('./../library/uploader');
const pr_date = require('./../library/persian_date_helper');
const auth = require('./../helper/auth');
const users_model=require('./../model/admin');
let
    persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g],
    arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
let moment = require('jalali-moment');
let cpUpload = uploadImage.fields([{name: 'img', maxCount: 1}, {name: 'file', maxCount: 1}
,{name: 'file2', maxCount: 1},{name: 'file3', maxCount: 1},{name: 'file4', maxCount: 1}])
app.post('/add', cpUpload, (req, res) => {
    auth.check(req)
        .then(async (r) => {
			let to_date = fixNumbers(req.body.to_date);
		
    to_date = new Date(moment.from(to_date, 'fa', 'YYYY/M/D'));
            let body={
                img: req.files.img[0].filename,
                file: req.files.file[0].filename,
                title: req.body.title,
                description: req.body.description,
                created: to_date
            }
            if(req.files.file2) body.file2=req.files.file2[0].filename;
            if(req.files.file3) body.file3=req.files.file3[0].filename;
            if(req.files.file4) body.file4=req.files.file4[0].filename;
            let a = new news_model(body).save((e,d) => {
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
            
			let to_date = fixNumbers(req.body.to_date);
            let body = {
                title: req.body.title,
                description: req.body.description,
				created:new Date(moment.from(to_date, 'fa', 'YYYY/M/D'))
            };
            if (req.files.img) {
                body.img = req.files.img[0].filename;
            }
            if (req.files.file) {
                body.file = req.files.file[0].filename;
            }
            if (req.files.file2) {
                body.file2 = req.files.file2[0].filename;
            }
            if (req.files.file4) {
                body.file4 = req.files.file4[0].filename;
            }
            if (req.files.file3) {
                body.file3 = req.files.file3[0].filename;
            }
            news_model.findOneAndUpdate({_id: req.params.id}, body,{new:true}, async (e, d) => {
                console.log(e)
                let as=await users_model.findOne({username:r.username}).exec();
				let date=pr_date.get_def_date(d.created,true)
                res.render('admin/mzyd/edit.ejs', {d,date, s: true,pr:as.perm});
            })
        })
        .catch(() => {
            res.redirect('/login')
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
            let as=await users_model.findOne({username:r.username}).exec();
			
            res.render('admin/mzyd/add.ejs', {d: false,pr:as.perm})
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
				let date=pr_date.get_def_date(d.created,true)
                res.render('admin/mzyd/edit.ejs', {d,date, s: null,pr:as.perm});
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
                res.render('admin/mzyd/index.ejs', {data: a,pr:as.perm})
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