const auth_model = require('./../model/Auth');
const auth = (req) => {
    return new Promise((resolve, reject) => {
        let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        ip=ip.split(":")[0];
        let agent = req.get('User-Agent');
        auth_model.findOne({uuid: req.cookies.uuid, agent, ip}, (e, d) => {
            if (!d) {
                return reject({
                    issuccessful: false,
                    status: 403
                });
            }
            if (e) {
                return reject({
                    issuccessful: false,
                    status: 500
                });
            }
            resolve({
                issuccessful: true,
                username:d.username
            })
        })
    })
};
setInterval(() => {
    auth_model.deleteMany({ttl: {$lt: new Date()}}, (e, state) => {

    });
}, 30000);
module.exports.check = auth;