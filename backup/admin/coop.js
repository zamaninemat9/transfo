const app = require('express').Router();
const coop_model = require('./../model/coop');
const pr_date = require('./../library/persian_date_helper');
const auth = require('./../helper/auth');
const users_model = require('./../model/admin');
app.delete('/remove/:id', (req, res) => {
    auth.check(req)
        .then(() => {
            coop_model.findOneAndDelete({_id: req.params.id}, (e, data) => {
                res.send({
                    issuccessful: true
                })
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
            let data = await coop_model.find().sort({_id: -1}).exec()

            let arr = [];
            for (let i in data) {
                let obj = {};
                obj.data = data[i]
                //ho_status
                // z_nahveyetamin
                obj.ho = 'سهامی عام';
                if (data[i].ho_status == 2) obj.ho = 'سهامی خاص';
                if (data[i].ho_status == 3) obj.ho = 'با مسئولیت محدود';
                if (data[i].ho_status == 4) obj.ho = 'سایر با ذکر عنوان';
                obj.nhv = 'شرکت اصلی'
                if (data[i].z_nahveyetamin == 2) obj.nhv = 'فروشندگی';
                if (data[i].z_nahveyetamin == 3) obj.nhv = 'نمایندگی';
                obj.cr = pr_date.get_def_date(data[i].created)
                console.log(obj);
                arr.push(obj)
            }
            res.render('admin/coop/index.ejs', {data: arr, pr: as.perm})

        })
        .catch(() => {
            res.redirect('/admin/login')
        })
});
module.exports = app;