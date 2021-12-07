console.log("IN THE NAME OF ALLAH");
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb',extended: true, parameterLimit: 1000000}));
app.use(cors());
const mongoose=require('mongoose');
const cookieParser=require('cookie-parser');
mongoose.Promise = global.Promise;
// connect to mongodb
mongoose.connect('mongodb://127.0.0.1:27017/transfo', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});



app.use((req,res,next)=>{
    res.locals.uRoute='http://localhost'
    next()
})
global.MYDIR=__dirname;
global.MYROUTE='http://iran-transfo.com';
// app.use(expressLayouts);
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());
app.set('view engine', 'ejs');
app.use('/',require('./index'));
//app.disable('x-powered-by');
//var helmet = require('helmet');
//app.use(helmet());

const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100 
});
//app.use(limiter);
// fast_links
const fs_model=require('./model/false_link')
//conatact_det
const contact_det=require('./model/contact_det')
const banner=require('./model/banner');
app.get('/crm',async (req,res)=>{
    let fs=await fs_model.find().exec();
    let bannerD=await banner.findOne({type:17}).exec();
    let img=''
    if(bannerD){
        img=MYROUTE+'/'+bannerD.img;
    }
    res.render('crm.ejs',{st:null,fs,f:null,bnr:img})
})


app.use('/admin',require('./admin/index'))

app.get('/tt',async (req,res)=>{
   const enc_hlp=require('./helper/e_n_c');
   const user_model=require('./model/admin');
   let ps=await enc_hlp.hash({password:'123'});
   let a=new user_model({
       username:"admin",
       perm:[1],
       hash:ps.hash,
       salt:ps.salt,
       created:new Date()
   }).save((e,d)=>{
       console.log(e);
       res.send(d)
   });
});

app.get('/download/:f',(req,res)=>{
	res.download(__dirname+'/public/'+req.params.f)
})
app.listen(80, function () {
    console.log("btrans");
    console.log("I'm listening on Port 80")
});
