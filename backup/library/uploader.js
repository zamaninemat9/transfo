const multer = require('multer')
const mkdirp = require('mkdirp')
let id = new Date()*1000+(Math.random()*100);
const ImageStorage = multer.diskStorage({
    destination: (err, file, callback) => {
        let dir = `./public/`;
        mkdirp(dir).then(made => callback(made, dir))
    },
    filename: (req, file, callback) => {
        callback(null, id + '-' + file.originalname)
    }
});
// const ImageFilter = (req, file, callback) => {
//     if (file.mimetype === "image/jpg" || file.mimetype === "image/png") {
//         callback(null, true)
//     } else {
//         callback(null, false)
//     }
// }
const uploadImage = multer({
    storage: ImageStorage,
    // limits: {
    //     fileSize: 1024 * 1024
    // },
    // fileFilter: ImageFilter
});
module.exports = {
    uploadImage
};
