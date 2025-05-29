const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const shortid = require('shortid');


const uploadImage = (options) => {
    const upload = multer({
        limits: {
            fileSize: options.fileSize || 3000000, // default to 3MB
        },
        fileFilter(req, file, cb) {
            if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
                return cb(new Error('Please upload an image file (jpg, jpeg, png)'));
            }
            cb(undefined, true);
        },
        storage: multer.memoryStorage(),
    });

    const imageUpload = upload.single(options.fieldName || 'image');

    const imageProcessing = async (req, res, next) => {
        if (!req.file) {
            return next();
        }
        const filename = `${shortid.generate()}.jpg`;
        const filepath = path.join(__dirname, options.destination || '../public/', filename);

        await sharp(req.file.buffer)
            .resize(options.width || 500, options.height || 500)
            .jpeg({ quality: options.quality || 70 })
            .toFile(filepath);

        req.body[options.fieldName || 'image'] = filename;

        next();
    };

    return [imageUpload, imageProcessing];
};

module.exports = uploadImage;