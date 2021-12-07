const app = require('express').Router();
const news_model = require('./../model/news');
const {uploadImage} = require('./../library/uploader');
const pr_date = require('./../library/persian_date_helper');
const auth = require('./../helper/auth');
const users_model=require('./../model/admin');
let
    persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g],
    arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
let moment = require('jalali-moment');
let cpUpload = uploadImage.fields([{name: 'img1', maxCount: 1}, {name: 'img2', maxCount: 1}, {
    name: 'img3',
    maxCount: 1
}, {name: 'img4', maxCount: 1},{name: 'img5', maxCount: 1},{name: 'img6', maxCount: 1},{name: 'img7', maxCount: 1},{name: 'img8', maxCount: 1},{name: 'img9', maxCount: 1},{name: 'img10', maxCount: 1}])
app.post('/add', cpUpload, (req, res) => {
    auth.check(req)
        .then(async (r) => {
            let as=await users_model.findOne({username:r.username}).exec();
			let to_date = fixNumbers(req.body.to_date);
            to_date = new Date(moment.from(to_date, 'fa', 'YYYY/M/D'));
	        let body={
		        img1: req.files.img1[0].filename,
		        title: req.body.title,
                description: req.body.description,
                created: to_date,
                tag:req.body.tag.split(',')
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
            if (req.files.img6) {
                body.img6 = req.files.img6[0].filename;
            }
            if (req.files.img7) {
                body.img7 = req.files.img7[0].filename;
            }
            if (req.files.img8) {
                body.img8 = req.files.img8[0].filename;
            }
            if (req.files.img9) {
                body.img9 = req.files.img9[0].filename;
            }
            if (req.files.img10) {
                body.img10 = req.files.img10[0].filename;
            }
            let a = new news_model(body).save((e,d) => {
                if(e) return res.send({
                    status:500,
                    description:"خطا در ذخیره کردن "
                })
                res.send({
                    status:200
                })
                //res.render('admin/news/add.ejs', {d: true,pr:as.perm})
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
            let checkHs=await news_model.findOne({_id:req.params.id}).exec()
            if(!checkHs) return res.send({
                status:402,
                description:"خبر یافت نشد"
            })
                let as=await users_model.findOne({username:r.username}).exec();
				let to_date = fixNumbers(req.body.to_date);
                let body = {
                title: req.body.title,
                tag:req.body.tag.split(','),
                description: req.body.description,
				created:new Date(moment.from(to_date, 'fa', 'YYYY/M/D'))
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
			if (req.files.img6) {
                body.img6 = req.files.img6[0].filename;
            }
            if (req.files.img7) {
                body.img7 = req.files.img7[0].filename;
            }
            if (req.files.img8) {
                body.img8 = req.files.img8[0].filename;
            }
            if (req.files.img9) {
                body.img9 = req.files.img9[0].filename;
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
            res.redirect('/admin/login')
        })
});
app.get('/add', (req, res) => {

    auth.check(req)
        .then(async (r) => {
            let as=await users_model.findOne({username:r.username}).exec();
            res.render('admin/news/add.ejs', {d: false,pr:as.perm})
        })
        .catch(() => {
            res.redirect('/admin/login')
        })
})
app.get('/:id', (req, res) => {
    auth.check(req)
        .then(async (r) => {
            let chkHs=await news_model.findOne({_id:req.params.id}).exec();
            if(!chkHs) return res.send("NOT FOUND")
            let as=await users_model.findOne({username:r.username}).exec();
            news_model.findOne({_id: req.params.id}, (e, d) => {
				let date=pr_date.get_def_date(d.created,true)
                res.render('admin/news/edit.ejs', {date,d, s: null,pr:as.perm});
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
                res.render('admin/news/index.ejs', {data: a,pr:as.perm})
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