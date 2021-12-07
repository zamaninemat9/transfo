const app = require('express').Router();
const contact_model = require('./../model/contactus');
const pr_hlp = require('./../library/persian_date_helper');
const auth = require('./../helper/auth');
const users_model=require('./../model/admin');
app.get('/', (req, res) => {
    auth.check(req)
        .then(async (r) => {
            let as=await users_model.findOne({username:r.username}).exec();
            contact_model.find({}, (e, d) => {
                let arr = [];
                for (let i in d) {
                    let obj = {};
                    obj.data = d[i];
                    obj.cr = pr_hlp.get_def_date(d[i].created);
                    arr.push(obj)
                }
                res.render('admin/contact/index.ejs', {data: arr,pr:as.perm});
            });
        })
        .catch(() => {
            res.redirect('/admin/login')
        })
});
app.delete('/remove/:id', (req, res) => {
    auth.check(req)
        .then(() => {
            contact_model.findOneAndDelete({_id: req.params.id}, (e, d) => {
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
module.exports = app;