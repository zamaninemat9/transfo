const app = require('express').Router();
const social_model = require('./../model/social');
const pr_date = require('./../library/persian_date_helper');
const auth = require('./../helper/auth');
const users_model = require('./../model/admin');
app.post('/add', (req, res) => {
    auth.check(req)
        .then(async (r) => {
            let as = await users_model.findOne({username: r.username}).exec();
            // ,pr:as.perm
            let a = new social_model({
                socialName: req.body.socialName,
                socialLink: req.body.socialLink,
                status: true
            }).save(() => {
                res.send("hi")
            })
        })
        .catch(() => {
            res.redirect('/admin/login')
        })
});
app.get('/get', (req, res) => {
    auth.check(req)
        .then(() => {
            social_model.find({}, (e, data) => {
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
app.post('/edit_:id', (req, res) => {
    auth.check(req)
        .then(async (r) => {
            let as = await users_model.findOne({username: r.username}).exec();

            social_model.findOneAndUpdate({_id: req.params.id}, {socialLink: req.body.socialLink}, async (e, data) => {
                let d = await social_model.findOne({_id: req.params.id}).exec();
                res.render('admin/social/edit.ejs', {d, s: true, pr: as.perm, data: true});
            })
        })
        .catch(() => {
            res.redirect('/admin/login')
        })
});
app.delete('/remove/:id', (req, res) => {
    auth.check(req)
        .then(() => {
            social_model.findOneAndDelete({_id: req.params.id}, (e, data) => {
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
            res.render('admin/social/add.ejs', {d: false, pr: as.perm})
        })
        .catch(() => {
            res.redirect('/admin/login')
        })
})
app.get('/:id', (req, res) => {
    auth.check(req)
        .then(async (r) => {
            let as = await users_model.findOne({username: r.username}).exec();
            social_model.findOne({_id: req.params.id}, (e, d) => {
                res.render('admin/social/edit.ejs', {d, s: null, pr: as.perm, data: null});
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
            let data = await social_model.find().sort({_id: -1}).exec()

            let a = [];
            let co = 1;
            for (let i in data) {
                let ob = {};
                ob.data = data[i];
                ob.num = co;
                a.push(ob);
                co++;
            }
            res.render('admin/social/index.ejs', {data, pr: as.perm})
        })
        .catch(() => {
            res.redirect('/admin/login')
        })
    // res.render('./news/index.ejs')
});
app.put('/change_st_:id', (req, res) => {
    auth.check(req)
        .then(() => {
            social_model.findOne({_id: req.params.id}, (e, d) => {
                let status = !d.status;
                social_model.findOneAndUpdate({_id: req.params.id}, {status}, (e, d) => {
                    res.send({
                        issuccessful: true
                    })
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
module.exports = app;