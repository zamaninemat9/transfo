/* In the anme of ALLAH */

// const helper = require('./public_helper');

const rnd = function(ln = 5,typ = 'num') {
    let res  = '';
    let ch = '';
    if(Array.isArray(typ)){
        typ.forEach((item, index)=> {
            if (item === 'num') {
                ch += '0123456789';
            } else if (item === 'fa') {
                ch += 'ابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی';
            } else if (item === 'low') {
                ch += 'abcdefghijklmnopqrstuvwxyz';
            } else if (item === 'up') {
                ch += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            } else if (item === 'mat') {
                ch += '%^*-=+';
            } else if (item === 'sym') {
                ch += '~!@#$%^&()_';
            } else if (item === 'dot') {
                ch += ',./;\'":\\[{}]`';
            }
        })
    } else {
        if (typ === 'num') {
            ch = '0123456789';
        } else if (typ === 'hex') {
            ch = '0123456789abcdef';
        } else if (typ === 'fa') {
            ch = 'ابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی';
        } else if (typ === 'en_low') {
            ch = 'abcdefghijklmnopqrstuvwxyz';
        } else if (typ === 'en_up') {
            ch = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        } else if (typ === 'en_num_low') {
            ch = 'abcdefghijklmnopqrstuvwxyz0123456789';
        } else if (typ === 'en_num_up') {
            ch = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        } else if (typ === 'en_num_all') {
            ch = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        } else if (typ === 'en_num_symbol') {
            ch = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ~!@#$%^&*()-=_+';
        } else {
            ch = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ,./;\'":\\[{}]`~!@#$%^&*()-=_+';
        }
    }
    const cL = ch.length;
    for ( let i = 0; i < ln; i++ ) {res += ch.charAt(Math.floor(Math.random() * cL));}
    return res;
};

const uuid = function(v = '',time = true,data1 = '',data2 = '') {
    let uu;
    if(v === 'v1') {
        const uuidv1 = require('uuid/v1');
        uu = uuidv1();
    } else if(v === 'v3') {
        const uuidv3 = require('uuid/v3');
        uu = uuidv3(data1,data2);//('hi.exam.com',uuidv3.DNS)$('http://exam.com/hi', uuidv3.URL);
    } else if(v === 'v4') {
        const uuidv4 = require('uuid/v4');
        uu = uuidv4();//Random
    } else if(v === 'v5') {
        const uuidv5 = require('uuid/v5');
        uu = uuidv5(data1,data2);//('hi.exam.com',uuidv5.DNS)$('http://exam.com/hi', uuidv5.URL);
    } else {
        if(data1 !== '') {
            uu = data1.slice(0,8) + '-';
        } else {
            uu = rnd(8,'hex') + '-';
        }
        if(data2 !== '') {
            uu += data2.slice(0,4) + '-' + data2.slice(4) + '-';
        } else {
            uu += rnd(4, 'hex') + '-';
            uu += rnd(4, 'hex') + '-';
        }
        uu += rnd(4,'hex') + '-';
        if(time) {
            let d = new Date();
            let v = d.getTime();
            let h = v.toString(16);
            let r = rnd(1,'hex');
            let p = rnd(1,'num');
            // uu += helper.glue(h,r,p);
        } else {
            uu += rnd(12,'hex');
        }
    }
    return uu;
};

const mac = function(rnd = true, pre = '') {
    if(rnd) {
        let mc = "XX:XX:XX:XX:XX:XX";
        mc.replace(/X/g, function () {
            return "0123456789ABCDEF".charAt(Math.floor(Math.random() * 16))
        });
        return mc;
    } else {
        let randomMac = require('random-mac');
        return randomMac(pre);//randomMac('00:50:56')
    }
};


module.exports.rnd = rnd;
module.exports.uid = uuid;
module.exports.mac = mac;
