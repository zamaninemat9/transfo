const app = require('express').Router();
const legal_model = require('./../model/crm_legal');
const users_model = require('./../model/admin');
const auth = require('./../helper/auth');
const pr_hlp = require('./../library/persian_date_helper');
// legal =>
app.get('/', async (req, res) => {
    auth.check(req)
        .then(async (r) => {
            let as = await users_model.findOne({username: r.username}).exec();
            let legal = await legal_model.find({}).sort({_id:-1}).exec();
            let arr = [];
            for (let i in legal) {
                let obj = {};
                obj.data = legal[i];
                obj.cr=await pr_hlp.get_def_date(legal[i].created);
                //    request_title
                let request_tile = 'شکایت';
                if (legal[i].request_tile == 2) request_tile = 'پیشنهاد';
                if (legal[i].request_tile == 3) request_tile = 'استعلام';
                obj.request_tile = request_tile;
                //    request_type
                let request_type = 'فروش'
                if (legal[i].request_type == 2) request_type = ' خدمات پس از فروش';
                obj.request_type = request_type;
                //    forosh
                let forosh = 'شرکت بازرگانی';
                if (legal[i].forosh == 2) forosh = 'نمایندگی فروش';
                if (legal[i].forosh == 3) forosh = 'فروش اینترنتی';
                if (legal[i].forosh == 4) forosh = 'ایران ترانسفو';
                obj.forosh = forosh;
                //    pas_az_forosh
                let pas_az_forosh = 'شرکت خدمات پس از فروش'
                if (legal[i].pas_az_forosh == 2) pas_az_forosh = 'نمایندگی خدمات پس از فروش';
                obj.pas_az_forosh = pas_az_forosh;
                //    product_type
                let product_type = 'نرمال خشک';
                switch (legal[i].product_type) {
                    case 2:
                        product_type = 'نرمال روغنی';
                        break;
                    case 3:
                        product_type = 'ویژه خشک';
                        break;
                    case 4:
                        product_type = 'ویژه روغنی';
                        break;
                    case 5:
                        product_type = 'فوق توزیع خشک';
                        break;
                    case 6:
                        product_type = 'فوق توضیع روغنی';
                        break;
                    case 7:
                        product_type = 'قدرت روغنی';
                        break;
                }
                obj.product_type = product_type;
                arr.push(obj)
            }
            res.render('admin/legal_crm/index.ejs', {data: arr, pr: as.perm})
        })
        .catch(() => {
            res.redirect('/admin/login')
        })
});
app.delete('/remove/:id', (req, res) => {
    auth.check(req)
        .then(async (r) => {
            legal_model.findOneAndDelete({_id: req.params.id}, (e, d) => {
                res.send({
                    issuccessful: true
                })
            });
        })
        .catch(() => {
            res.redirect('/admin/login')
        })
});

module.exports = app;