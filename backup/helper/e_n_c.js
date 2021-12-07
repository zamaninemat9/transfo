/* In the name of ALLAH */
const crypto = require('crypto');

const hash_pass = (r) => new Promise((fullfill , reject) => {
    let password = r.password;
    let iterations =10000;
    let salt = crypto.randomBytes(128).toString('base64');
    crypto.pbkdf2(password, salt, iterations, 64, 'sha512', (err, derivedKey) => {
        if (err){
            reject(err);
        }
        let hash = derivedKey.toString('hex');
        fullfill({
            salt: salt,
            hash: hash,
        });
    });
});
//
//
const check_pass = (r) => new Promise((fullfill , reject) => {
    let iterations = 10000;
    let passwordAttempt = r.password;
    let savedSalt = r.salt;
    let savedHash = r.hash;
    crypto.pbkdf2(passwordAttempt, savedSalt, iterations, 64, 'sha512', (err, derivedKey) => {
        if (err){
            reject(err);
        }
        let hash = derivedKey.toString('hex');
        fullfill(savedHash === hash);
    });
});

module.exports.hash = hash_pass;
module.exports.check = check_pass;
