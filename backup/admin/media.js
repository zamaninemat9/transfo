const app = require('express').Router();
const news_model = require('./../model/media');
const {uploadImage} = require('./../library/uploader');
const pr_date = require('./../library/persian_date_helper');
const auth = require('./../helper/auth');
const users_model = require('./../model/admin');
app.post('/add', uploadImage.single('file'), (req, res) => {
    auth.check(req)
        .then(async (r) => {
            let body={
                img: req.file.filename,
                video: req.body.video,
                title: req.body.title,
                description: req.body.description,
                created: new Date()
            }
            if(req.body.video2) body.video2=req.body.video2;
            if(req.body.video3) body.video3=req.body.video3;
            if(req.body.video4) body.video4=req.body.video4;
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
app.post('/edit_:id', uploadImage.single('file'), (req, res) => {
    auth.check(req)
        .then(async (r) => {
            let body = {
                title: req.body.title,
                description: req.body.description,
                video: req.body.video,
            };
            if(req.body.video2) body.video2=req.body.video2
            if(req.body.video3) body.video3=req.body.video3
            if(req.body.video4) body.video4=req.body.video4
            if (req.file) {
                body.img = req.file.filename;
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
            res.send({
                status:403
            })
        })
});
app.get('/add', (req, res) => {
    auth.check(req)
        .then(async (r) => {
            let as = await users_model.findOne({username: r.username}).exec();
            res.render('admin/media/add.ejs', {d: false, pr: as.perm})
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
            let as = await users_model.findOne({username: r.username}).exec();
            news_model.findOne({_id: req.params.id}, (e, d) => {
                res.render('admin/media/edit.ejs', {d, s: null, pr: as.perm});
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
                ob.is_video = false;
                if (data[i].description.length > 10) data[i].description = await data[i].description.substring(0, 10);
                if (data[i].video) ob.is_video = true;
                a.push(ob);
                co++;
            }
            console.log(data);
            res.render('admin/media/index.ejs', {data: a, pr: as.perm})
        })
        .catch(() => {
            res.redirect('/admin/login')

        })
    // res.render('./news/index.ejs')
});
module.exports = app;