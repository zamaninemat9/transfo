const app = require('express').Router();
const rp = require('request-promise')
const news_model = require('./model/news');
const mzyd_model = require('./model/mzyd');
const media_model = require('./model/media');
const tabe_news_model = require('./model/tabe_news');
const notif_model = require('./model/notif');
const product_slider_model = require('./model/product_slider');
const social_model = require('./model/social');
const pr_hlp = require('./library/persian_date_helper');
const product_model = require('./model/product');
const contact_us_model = require('./model/contactus');
const slider_model = require('./model/slider');
const gallery_model = require('./model/gallery');
const chart_model = require('./model/chart');
const rahbord_model = require('./model/rahbord');
const about_model = require('./model/about');
const catalog_model = require('./model/catalog');
const reporting_model = require('./model/reporting');
const job_model = require('./model/job');
const persons_model = require('./model/persons');
const coop_model = require('./model/coop');
//crm
const actual_model = require('./model/crm_actual');
const legal_model = require('./model/crm_legal');
// fast_links
const fs_model = require('./model/false_link');
// after_sell
const after_sell_model = require('./model/after-sell');

// tabe MODULES
const tabe_model = require('./model/tabe');
const banner = require('./model/banner')
const news_slider_model = require('./model/news_slider')
const {uploadImage} = require('./library/uploader')
const contact_det = require('./model/contact_det')
const {check, validationResult} = require('express-validator');


//=======================================
// MIDDLE
//=======================================
app.use(async (req, res, next) => {
    let social = await social_model.find().exec();
    res.locals.social = await get_social(social);
    res.locals.fs = await fs_model.find().exec();
    let dcontact_det = await contact_det.findOne({key: "btrns"}).exec();
    res.locals.contact_det = dcontact_det
    next();
});
//=======================================
// ROUTES
//=======================================
app.get('/', async (req, res) => {
    let news = await news_slider_model.find().exec();
    news = await get_news(news);
    let tbe = await tabe_model.find().exec();
    let gallery = await gallery_model.find().exec();
    let product_slider = await product_slider_model.find().exec();
    let slider = await slider_model.find().sort({_id:-1}).exec()
    let after_sell = await after_sell_model.find().exec();
    let news_slider = await news_slider_model.find().sort({_id:-1}).exec();
    res.render('index.ejs', {tbe, news, gallery, product_slider, slider, after_sell, news_slider})
});
app.get('/products',async (req, res) => {
    let bannerD=await banner.findOne({type:12}).exec();
    let img=''
    if(bannerD){
        img=MYROUTE+'/'+bannerD.img;
    }
    product_model.find({}, async (e, data) => {
        data = data.map(item => {
            return {
                _id: item._id,
                img: item.img1,
                title: item.title,
                parent: item.parent
            }
        });
        // return res.send(data)
      

        res.render('mahsolat.ejs', {data, bnr:img})
    });
});
app.get('/product/:id', (req, res) => {
    product_model.findOne({_id: req.params.id}, async (e, data) => {
        let parent = 'قدرت و فوق قدرت';
        if (data.parent == 2) {
            parent = 'توزیع و فوق توزیع'
        } else if (data.parent == 3) {
            parent = 'خشک رزینی'
        } else if (data.parent == 4) {
            parent = 'ویژه'
        } else if (data.parent == 5) {
            parent = 'تجهیزات و مواد'
        }
        data.parent = parent;
        res.render('mahsol.ejs', {data})
    })
});
app.post('/contact', async (req, res) => {

    let body = req.body;
    // let opt2 = {
    //     uri: 'https://cpch.ir/v1.0/check/hl6DZ6c1dfz7UwTSn',
    //     body: {
    //         captcha: req.body.captcha,
    //         captcha_code: req.body.captcha_code,
    //         user_agent: req.get('User-Agent'),
    //         ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
    //     },
    //     method: 'POST',
    //     json: true
    // };
    // let check_cap = await rp(opt2);
   // if (!check_cap.status) return res.render('contact.ejs', {d: 2});
    body.created = new Date();
 await contact_us_model.create({
            text:req.body.message,
            name:req.body.name,
            email:req.body.email,
            created:new Date()
    })
    res.send({
        status:200
    })
});
app.get('/news', async (req, res) => {
    let bannerD=await banner.findOne({type:6}).exec();
    let img=''
    if(bannerD){
        img=MYROUTE+'/'+bannerD.img;
    }
    let page = 1;
    let per_page = 10;
    if (req.query.page) page = parseInt(req.query.page);
    let skip = parseInt(page) * parseInt(per_page) - 10
    let ttl = await news_model.count().exec();
    let data = await news_model.find().skip(skip).limit(per_page).sort({created: -1}).exec();
    let arr = [];

    for (let i in data) {
        let obj = {};
        obj.data = data[i];
        obj.cr = pr_hlp.get_def_date(data[i].created);
        obj.desc = data[i].description.substring(0, 40) + " ...";
        arr.push(obj)
    }
    res.render('news.ejs', {
        data: arr,
        bnr:img,
        currentPage: parseInt(page),
        hasNextPage: (per_page * parseInt(page)) < ttl,
        hasPreviousPage: parseInt(page) > 1,
        nextPage: parseInt(page) + 1,
        previousPage: parseInt(page) - 1,
        lastPage: Math.ceil(ttl / per_page)
    });
});
app.get('/mzyd', async (req, res) => {
    let bannerD=await banner.findOne({type:9}).exec();
    let img=''
    if(bannerD){
        img=MYROUTE+'/'+bannerD.img;
    }
    let page = 1;
    let per_page = 10;
    if (req.query.page) page = parseInt(req.query.page);
    let skip = parseInt(page) * parseInt(per_page) - 10
    let ttl = await mzyd_model.count().exec();
    let data = await mzyd_model.find().skip(skip).limit(per_page).sort({created: -1}).exec();
    let arr = [];
    for (let i in data) {
        let obj = {};
        obj.data = data[i];
        obj.cr = pr_hlp.get_def_date(data[i].created);
        obj.desc = data[i].description;
        arr.push(obj)
    }
    // return res.send(arr);
    res.render('mzyd.ejs', {
        data: arr,
        bnr:img,
        currentPage: parseInt(page),
        hasNextPage: (per_page * parseInt(page)) < ttl,
        hasPreviousPage: parseInt(page) > 1,
        nextPage: parseInt(page) + 1,
        previousPage: parseInt(page) - 1,
        lastPage: Math.ceil(ttl / per_page)
    });
});
app.get('/mzydSingle/:id',async(req,res)=>{
    let bannerD=await banner.findOne({type:9}).exec();
    let img=''
    if(bannerD){
        img=MYROUTE+'/'+bannerD.img;
    }
    let data=await mzyd_model.findOne({_id:req.params.id}).exec();
    if(!data) return res.send("404");
    let obj={
        data,
        cr:pr_hlp.get_def_date(data.created)
    };
    res.render('mzydSingle.ejs',{data:obj,bnr:img})

})
app.get('/contact',async (req,res)=>{
    let bannerD=await banner.findOne({type:5}).exec();
    let img=''
    if(bannerD){
        img=MYROUTE+'/'+bannerD.img;
    }
    let det=await contact_det.findOne({key:"btrns"}).exec();
    res.render('contact.ejs',{d:null,det,bnr:img});
});
app.get('/media', async (req, res) => {
    let bannerD=await banner.findOne({type:8}).exec();
    let img=''
    if(bannerD){
        img=MYROUTE+'/'+bannerD.img;
    }
    let page = 1;
    let per_page = 10;
    if (req.query.page) page = parseInt(req.query.page);
    let skip = parseInt(page) * parseInt(per_page) - 10
    let ttl = await media_model.count().exec();
    let data = await media_model.find().skip(skip).limit(per_page).sort({created: -1}).exec();
    let arr = [];
    for (let i in data) {
        let obj = {};
        obj.data = data[i];
        obj.cr = pr_hlp.get_def_date(data[i].created);
        obj.desc = data[i].description;
        arr.push(obj)
    }
    // return res.send(arr)
    res.render('media.ejs', {
        bnr:img,
        data: arr,
        currentPage: parseInt(page),
        hasNextPage: (per_page * parseInt(page)) < ttl,
        hasPreviousPage: parseInt(page) > 1,
        nextPage: parseInt(page) + 1,
        previousPage: parseInt(page) - 1,
        lastPage: Math.ceil(ttl / per_page)
    });
});
app.get('/catalog', async (req, res) => {
    
    let page = 1;
    let per_page = 10;
    if (req.query.page) page = parseInt(req.query.page);
    let skip = parseInt(page) * parseInt(per_page) - 10
    let ttl = await catalog_model.count().exec();
    let data = await catalog_model.find().skip(skip).limit(per_page).sort({_id: -1}).exec();
    let arr = [];
    for (let i in data) {
        let obj = {};
        obj.data = data[i];
        obj.cr = pr_hlp.get_def_date(data[i].created);
        obj.desc = data[i].description;
        arr.push(obj)
    }
    let bnr = await banner.findOne({type: 8}).exec()||{};
    res.render('catalog.ejs', {
        data: arr,
        bnr:bnr.img,
        currentPage: parseInt(page),
        hasNextPage: (per_page * parseInt(page)) < ttl,
        hasPreviousPage: parseInt(page) > 1,
        nextPage: parseInt(page) + 1,
        previousPage: parseInt(page) - 1,
        lastPage: Math.ceil(ttl / per_page)
    });
});
app.get('/reporting', async (req, res) => {
    let page = 1;
    let per_page = 10;
    if (req.query.page) page = parseInt(req.query.page);
    let skip = parseInt(page) * parseInt(per_page) - 10
    let ttl = await reporting_model.count().exec();
    let data = await reporting_model.find().skip(skip).limit(per_page).sort({created: -1}).exec();
    let arr = [];
    for (let i in data) {
        let obj = {};
        obj.data = data[i];
        obj.cr = pr_hlp.get_def_date(data[i].created);
        obj.desc = data[i].description;
        arr.push(obj)
    }
    let bnr = await banner.findOne({type: 13}).exec()||{};
    res.render('reporting.ejs', {
        data: arr,
        bnr:bnr.img,
        currentPage: parseInt(page),
        hasNextPage: (per_page * parseInt(page)) < ttl,
        hasPreviousPage: parseInt(page) > 1,
        nextPage: parseInt(page) + 1,
        previousPage: parseInt(page) - 1,
        lastPage: Math.ceil(ttl / per_page)
    });
});
app.get('/job', async (req, res) => {
    let bannerD=await banner.findOne({type:14}).exec();
    let img=''
    if(bannerD){
        img=MYROUTE+'/'+bannerD.img;
    }
    let page = 1;
    let per_page = 10;
    if (req.query.page) page = parseInt(req.query.page);
    let skip = parseInt(page) * parseInt(per_page) - 10
    let ttl = await job_model.count().exec();
    let data = await job_model.find().skip(skip).limit(per_page).sort({created: -1}).exec();
    let arr = [];
    for (let i in data) {
        let obj = {};
        obj.data = data[i];
        obj.cr = pr_hlp.get_def_date(data[i].created);
        obj.desc = data[i].description;
        arr.push(obj)
    }
    res.render('job.ejs', {
        data: arr,
        bnr:img,
        currentPage: parseInt(page),
        hasNextPage: (per_page * parseInt(page)) < ttl,
        hasPreviousPage: parseInt(page) > 1,
        nextPage: parseInt(page) + 1,
        previousPage: parseInt(page) - 1,
        lastPage: Math.ceil(ttl / per_page)
    });
});
app.get('/tabe_news', async (req, res) => {
    let page = 1;
    let per_page = 10;
    if (req.query.page) page = parseInt(req.query.page);
    let skip = parseInt(page) * parseInt(per_page) - 10
    let ttl = await tabe_news_model.count().exec();
    let data = await tabe_news_model.find().skip(skip).limit(per_page).sort({created: -1}).exec();
    let arr = [];
    for (let i in data) {
        let obj = {};
        obj.data = data[i];
        obj.cr = pr_hlp.get_def_date(data[i].created);
        obj.desc = data[i].description.substring(0, 40) + " ...";
        arr.push(obj)
    }
    res.render('tabe_news.ejs', {
        data: arr,
        currentPage: parseInt(page),
        hasNextPage: (per_page * parseInt(page)) < ttl,
        hasPreviousPage: parseInt(page) > 1,
        nextPage: parseInt(page) + 1,
        previousPage: parseInt(page) - 1,
        lastPage: Math.ceil(ttl / per_page)
    });
});
app.get('/tabe_news/:id', async (req, res) => {
    tabe_news_model.findOne({_id: req.params.id}, async (e, data) => {
        if (!data) return res.send("404");
        data.cr = pr_hlp.get_def_date(data.created);
        res.render('tabe_single_news.ejs', {data});
    });
});
//notif
app.get('/notif', async (req, res) => {
    let bannerD=await banner.findOne({type:7}).exec();
    let img=''
    if(bannerD){
        img=MYROUTE+'/'+bannerD.img;
    }
    let page = 1;
    let per_page = 10;
    if (req.query.page) page = parseInt(req.query.page);
    let skip = parseInt(page) * parseInt(per_page) - 10
    let ttl = await notif_model.count().exec();
    let data = await notif_model.find().skip(skip).limit(per_page).sort({created: -1}).exec();
    let arr = [];
    for (let i in data) {
        let obj = {};
        obj.data = data[i];
        obj.cr = pr_hlp.get_def_date(data[i].created);
        obj.desc = data[i].description.substring(0, 40) + " ...";
        arr.push(obj)
    }
   
    res.render('notif.ejs', {
        data: arr,bnr:img,
        currentPage: parseInt(page),
        hasNextPage: (per_page * parseInt(page)) < ttl,
        hasPreviousPage: parseInt(page) > 1,
        nextPage: parseInt(page) + 1,
        previousPage: parseInt(page) - 1,
        lastPage: Math.ceil(ttl / per_page)
    });
});
app.get('/notif/:id', async (req, res) => {
    notif_model.findOne({_id: req.params.id}, async (e, data) => {
        if (!data) return res.send("404");
        data.cr = pr_hlp.get_def_date(data.created);
        res.render('notif_single_news.ejs', {data});
    });
});
//dar yek
app.get('/about', async (req, res) => {
    let data = await about_model.findOne({ref: 'btrns'}).exec();
    let bnr = await banner.findOne({type: 1}).exec()||{};
    res.render('about-history.ejs', {data, bnr:bnr.img});
});
app.get('/ceo', async (req, res) => {
    let bnr = await banner.findOne({type: 2}).exec()||{};
    res.render('ceo.ejs', {bnr:bnr.img});
});
app.get('/chart', async (req, res) => {
    let im = await chart_model.findOne({ref: 'btrns'}).exec();
    let bnr = await banner.findOne({type: 3}).exec()||{};
    res.render('chart.ejs', {im, bnr:bnr.img});
});
app.get('/rahbord', async (req, res) => {
    let data = await rahbord_model.find().exec();
    let bnr = await banner.findOne({type: 16}).exec()||{};
    res.render('rahbord.ejs', {data,bnr:bnr.img});
});
app.post('/crm/actual_add', [
    check('fullName').not().isEmpty().withMessage("مقدار نام و نام خانوادگی نمیتواند خالی بماند"),
    check('nationalCode').not().isEmpty().withMessage("مقدار کدملی نمیتواند خالی بماند"),
    check('mobile').not().isEmpty().withMessage("مقدار شماره همراه نمیتواند خالی بماند"),
    // check('adress').not().isEmpty().withMessage("مقدار آدرس نمیتواند خالی بماند"),
    check('email').not().isEmpty().withMessage("مقدار ایمیل نمیتواند خالی بماند"),
    check('fax').not().isEmpty().withMessage("مقدار فکس نمیتواند خالی بماند"),
    check('request_title').not().isEmpty().withMessage("مقدار عنوان درخواست نمیتواند خالی بماند"),
    check('product_serial_number').not().isEmpty().withMessage("مقدار شماره سریال محصول نمیتواند خالی بماند"),
    check('volt').not().isEmpty().withMessage("مقدار ولتاژ نمیتواند خالی بماند"),
    check('tavan').not().isEmpty().withMessage("مقدار توان نمیتواند خالی بماند"),
    check('request_type').not().isEmpty().withMessage("مقدار نوع محصول نمیتواند خالی بماند"),
    check('product_type').not().isEmpty().withMessage("مقدار نوع محصول نمیتواند خالی بماند"),
    check('request').not().isEmpty().withMessage("مقدار متن درخواست نمیتواند خالی بماند"),
    check('address').not().isEmpty().withMessage("مقدار شناسه کاربر نمیتواند خالی بماند"),
//
    check('nationalCode').isInt().withMessage("مقدار کدملی باید عددی باشد."),
    check('mobile').isInt().withMessage("مقدار موبایل باید عددی باشد."),
    check('fax').isInt().withMessage("مقدار فکس باید عددی باشد."),
    check('volt').isInt().withMessage("مقدار ولت باید عددی باشد."),
    check('tavan').isInt().withMessage("مقدار توان باید عددی باشد."),

], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('crm.ejs', {st: 2, f: errors.array()[0].msg})
    }
    req.body.created = new Date()
    let a = new actual_model(req.body).save(async (e, d) => {
        res.render('crm.ejs', {st: true})
    });
});
app.post('/crm/legal_add',
    [
        check('companyName').not().isEmpty().withMessage("مقدار نام شرکت نمیتواند خالی بماند"),
        check('company_national_number').not().isEmpty().withMessage("مقدار شناسه ملی شرکت نمیتواند خالی بماند"),
        check('refer_name').not().isEmpty().withMessage("مقدار نام و نام خانوادگی رابط نمیتواند خالی بماند"),
        check('jobTitle').not().isEmpty().withMessage("مقدار سمت سازمانی رابط نمیتواند خالی بماند"),
        check('refer_mobile').not().isEmpty().withMessage("مقدار شماره همراه رابط نمیتواند خالی بماند"),
       // check('adress').not().isEmpty().withMessage("مقدار آدرس  نمیتواند خالی بماند"),
        check('email').not().isEmpty().withMessage("مقدار ایمیل نمیتواند خالی بماند"),
        check('fax').not().isEmpty().withMessage("مقدار فکس نمیتواند خالی بماند"),
        check('request_title').not().isEmpty().withMessage("مقدار عنوان درخواست نمیتواند خالی بماند"),
        check('product_serial_number').not().isEmpty().withMessage("مقدار شماره سریال محصول نمیتواند خالی بماند"),
        check('volt').not().isEmpty().withMessage("مقدار ولتاژ نمیتواند خالی بماند"),
        check('tavan').not().isEmpty().withMessage("مقدار توان نمیتواند خالی بماند"),
        check('request_type').not().isEmpty().withMessage("مقدار نوع محصول نمیتواند خالی بماند"),
        check('request').not().isEmpty().withMessage("مقدار متن درخواست نمیتواند خالی بماند"),

        check('company_national_number').isInt().withMessage("مقدار شناسه ملی شرکت باید عددی باشد."),
        check('refer_mobile').isInt().withMessage("مقدار موبایل باید عددی باشد."),
        check('fax').isInt().withMessage("مقدار فکس باید عددی باشد."),
        check('volt').isInt().withMessage("مقدار ولت باید عددی باشد."),
        check('tavan').isInt().withMessage("مقدار توان باید عددی باشد."),
    ]
    , (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('crm.ejs', {st: 2, f: errors.array()[0].msg})
        }
        req.body.created = new Date();
        let a = new legal_model(req.body).save(async (e, d) => {
            res.render('crm.ejs', {st: true})
        });
    });
app.get('/tabe', async (rqe, res) => {
    tabe_model.find({}, async (e, data) => {
        res.render('tabe', {st: true, data})
    });
});
app.get('/tabe_single/:id', async (req, res) => {
    tabe_model.findOne({_id: req.params.id}, async (e, data) => {
        if (!data) return res.send("404");
        res.render('tabe_single', {st: true, data})
    });
});

app.get('/cooperation',async (req, res) => {
    let bannerD=await banner.findOne({type:10}).exec();
    let img=''
    if(bannerD){
        img=MYROUTE+'/'+bannerD.img;
    }
    res.render('cooperation', {f: null,bnr:img})
});
app.post('/cooperation', [
    check('name').not().isEmpty().withMessage("مقدار نام شركت - كارگاه نمیتواند خالی بماند"),
    check('mobile').not().isEmpty().withMessage("مقدار تلفن و نمابر نمیتواند خالی بماند"),
    // check('site').not().isEmpty().withMessage("مقدار آدرس سايت اينترنتي  نمیتواند خالی بماند"),
    check('egh_code').not().isEmpty().withMessage("مقدار كد اقتصادي  نمیتواند خالی بماند"),
    check('ho_status').not().isEmpty().withMessage("مقدار وضعيت حقوقي نمیتواند خالی بماند"),
    check('z_nahveyetamin').not().isEmpty().withMessage("مقدار نحوه تامين نمیتواند خالی بماند"),
    check('z_neshany').not().isEmpty().withMessage("مقدار نشاني شركت / كارگاه نمیتواند خالی بماند"),
    check('z_faaliyat').not().isEmpty().withMessage("مقدار اهم زمينه هاي فعاليت شركت نمیتواند خالی بماند"),
    check('z_sesal').not().isEmpty().withMessage("مقدار اهم سوابق كاري نمیتواند خالی بماند"),
    check('z_fullname').not().isEmpty().withMessage("مقدار نام و نام خانوادگی نمیتواند خالی بماند"),
    check('z_semat').not().isEmpty().withMessage("مقدار سمت  نمیتواند خالی بماند"),
    check('z_tamas').not().isEmpty().withMessage("مقدار شماره تماس نمیتواند خالی بماند"),
], (req, res) => {
	  const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('cooperation.ejs', {f: 2, de: errors.array()[0].msg})
    }
    let body = req.body;
    body.created = new Date()
    let a = new coop_model(body).save(() => {
        res.render('cooperation', {f: 1, de: null});
    });
});

app.get('/s_media/:id', async (req, res) => {
    let data = await media_model.findOne({_id: req.params.id}).exec()
    if (!data) res.send("404");
    res.render('media_single', {data})
})
app.get('/single_news/:id', async (req, res) => {
    let data = await news_model.findOne({_id: req.params.id}).exec()
    if (!data) res.send("404");
    res.render('single_news', {data})
})
app.get('/job/:id', async (req, res) => {
    let bannerD=await banner.findOne({type:14}).exec();
    let img=''
    if(bannerD){
        
        img=MYROUTE+'/'+bannerD.img;
    }

    let datas = await job_model.findOne({_id: req.params.id}).exec()
    if (!datas) res.send("404");
    let data={};
    data.data=datas
    data.cr=pr_hlp.get_def_date(datas.created);
    res.render('single_job', {data,bnr:img})
})

app.post('/job/add',uploadImage.single('resumeFile'),async(req,res)=>{
    let file=req.file.filename;
    let jb=await job_model.findOne({_id:req.body.jobId}).exec();
    if(!jb) return res.send({
        status:402,
        description:"فرصت شغلی یافت نشد"
    })
    await persons_model.findOneAndUpdate({mobile:req.body.phoneNumber,job:jb.title},{
        name:req.body.fullName,
        created:new Date(),
        resume:file
    },{upsert:true}).exec();
    res.send({
        status:200
    })
});
app.get('/saham',async (req, res) => {
    let bannerD=await banner.findOne({type:11}).exec();
    let img=''
    if(bannerD){
        img=MYROUTE+'/'+bannerD.img;
    }
    res.render('c_saham.ejs',{bnr:img})
})
app.get('/anjam_midam', (req, res) => {
    res.render('anjam.ejs')
})
module.exports = app;
const get_news = async (data) => {
    return new Promise(async (resolve, reject) => {
        let arr = [];
        for (let i in data) {
            let obj = {};
            obj.data = data[i];
            obj.date = pr_hlp.get_def_date(data[i].created);
            // data[i].date=await 'ss';
            arr.push(obj)
        }

        resolve(arr);
    })
};
const get_social = async (data) => {
    let obj = {};
    //socialName
    // socialLink
    await data.map(item => {
        if (item.socialName == "telegram") {
            obj.telegram = item;
        } else if (item.socialName == "linkdin") {
            obj.linkdin = item;
        } else if (item.socialName == "aparat") {
            obj.aparat = item;

        } else if (item.socialName == "instagram") {
            obj.instagram = item;

        }
    })
    return obj

};