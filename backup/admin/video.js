const app = require('express').Router();
const news_model = require('./../model/video');
const {uploadImage} = require('./../library/uploader');
const pr_date = require('./../library/persian_date_helper');
const auth = require('./../helper/auth');
const users_model=require('./../model/admin');
let
    persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g],
    arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
let moment = require('jalali-moment');

app.post('/add', uploadImage.single('video'), (req, res) => {
    auth.check(req)
        .then(async (r) => {
	        let body={
		        video: req.file.filename,
                created: new Date()
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
        // .catch((e) => {
        //     return res.send(e)
        //     res.send({
        //         status:403
        //     })
            
        // })
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

app.delete('/remove/:id', (req, res) => {
    auth.check(req)
        .then(async() => {
            const fs =require('fs');
            let data=await news_model.findOne({_id: req.params.id}).exec()
            if(!data) return res.send({
                issuccessful: true
            })
            let path=MYDIR+'/public/'+data.video;
            fs.unlinkSync(path)
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
            res.render('admin/video/add.ejs', {d: false,pr:as.perm})
        })
        .catch(() => {
            res.redirect('/admin/login')
        })
})

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
                    ob.created = pr_date.get_def_date(data[i].created)
                    ob.num = co;
                    a.push(ob);
                    co++;
                }
                console.log(data);
                res.render('admin/video/index.ejs', {data: a,pr:as.perm})
        })
        .catch(() => {
            res.redirect('/admin/login')

        })
    // res.render('./news/index.ejs')
});
module.exports = app;
