const multer = require('multer');
const shortid = require("shortid");
const path = require("path"); // Ensure path is required for filename extension extraction

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let dir;
        switch (file.fieldname) {
            case 'thumbnail':
            case 'pictures':
                dir = 'public/thumbnail';
                break;
            case 'cover':
                dir = 'public/cover';
                break;
            case 'trailer':
                dir = 'public/trailer';
                break;
            case 'files':
                dir = 'public/videos';
                break;
            default:
                dir = 'public/';
        }
        cb(null, dir);
    },
    filename: async (req, file, cb) => {
        const ext = path.extname(file.originalname);

        if (req.body.episodeNumber) {
            const { seasonNumber, episodeNumber, seriesTitle } = req.body;
            const title = seriesTitle.replace(/\s+/g, '-');
            cb(null, `${title}-Season${seasonNumber}Episode${episodeNumber}-${shortid.generate()}-streamvibe${ext}`);
        }
        else {
            const title = req.body.title.replace(/\s+/g, '-');
            cb(null, `${title}-${req.body.release_date}-${shortid.generate()}-streamvibe${ext}`);
        }
    },
});

const upload = multer({ storage });


//! movie controller
exports.movieUploader = upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: "cover", maxCount: 1 }, { name: 'trailer', maxCount: 1 }, { name: 'files' }]);

//! series controller
exports.seriesUploader = upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: "cover", maxCount: 1 }, { name: 'trailer', maxCount: 1 }]);

//! episode controller
exports.episodeUploader = upload.fields([{ name: 'files' }, { name: 'pictures', maxCount: 2 }]);





// const fs = require('fs').promises;
// const path = require('path');
// const sharp = require('sharp');
// const multer = require('multer');
// const shortid = require('shortid');

// // Multer storage configuration
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         let dir;
//         switch (file.fieldname) {
//             case 'thumbnail':
//             case 'pictures':
//                 dir = 'public/thumbnail';
//                 break;
//             case 'cover':
//                 dir = 'public/cover';
//                 break;
//             case 'trailer':
//                 dir = 'public/trailer';
//                 break;
//             case 'files':
//                 dir = 'public/videos';
//                 break;
//             default:
//                 dir = 'public/';
//         }
//         cb(null, dir);
//     },
//     filename: async (req, file, cb) => {
//         const ext = path.extname(file.originalname);

//         if (req.body.episodeNumber) {
//             const { seasonNumber, episodeNumber, seriesTitle } = req.body;
//             const title = seriesTitle.replace(/\s+/g, '-');
//             cb(null, `${title}-Season${seasonNumber}Episode${episodeNumber}-${shortid.generate()}-streamvibe${ext}`);
//         } else {
//             const title = req.body.title.replace(/\s+/g, '-');
//             cb(null, `${title}-${req.body.release_date}-${shortid.generate()}-streamvibe${ext}`);
//         }
//     },
// });

// const upload = multer({ storage });

// // Middleware to process images with sharp
// const processImages = async (req, res, next) => {
//     if (!req.files) return next();

//     const imageFields = ['thumbnail', 'pictures', 'cover'];
//     const resizePromises = [];

//     imageFields.forEach(field => {
//         if (req.files[field]) {
//             req.files[field].forEach(file => {
//                 const outputPath = path.join(file.destination, `resized-${file.filename}`);
//                 resizePromises.push(
//                     sharp(file.path)
//                         .resize(300, 300, { fit: 'inside' })
//                         .toFormat('jpeg')
//                         .jpeg({ quality: 80 })
//                         .toFile(outputPath)
//                         .then(async () => {
//                             try {
//                                 // Add a delay before removing the original file
//                                 await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay
//                                 // Remove the original file
//                                 await fs.unlink(file.path);
//                                 // Update the file path to the resized image
//                                 file.path = outputPath;
//                                 file.filename = `resized-${file.filename}`;
//                             } catch (err) {
//                                 console.error(`Error deleting file: ${file.path}`, err);
//                             }
//                         })
//                 );
//             });
//         }
//     });

//     await Promise.all(resizePromises);
//     next();
// };

// //! movie controller
// exports.movieUploader = [upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: "cover", maxCount: 1 }, { name: 'trailer', maxCount: 1 }, { name: 'files' }]), processImages];

// //! series controller
// exports.seriesUploader = [upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: "cover", maxCount: 1 }, { name: 'trailer', maxCount: 1 }]), processImages];

// //! episode controller
// exports.episodeUploader = [upload.fields([{ name: 'files' }, { name: 'pictures', maxCount: 2 }]), processImages];






// const multer = require('multer');
// const sharp = require('sharp');
// const shortid = require("shortid");
// const path = require("path");
// const fs = require('fs');
// const util = require('util');

// const unlinkAsync = util.promisify(fs.unlink);

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         let dir;
//         switch (file.fieldname) {
//             case 'thumbnail':
//             case 'pictures':
//                 dir = 'public/thumbnail';
//                 break;
//             case 'cover':
//                 dir = 'public/cover';
//                 break;
//             case 'trailer':
//                 dir = 'public/trailer';
//                 break;
//             case 'files':
//                 dir = 'public/videos';
//                 break;
//             default:
//                 dir = 'public/';
//         }
//         cb(null, dir);
//     },
//     filename: (req, file, cb) => {
//         const ext = path.extname(file.originalname);

//         if (req.body.episodeNumber) {
//             const { seasonNumber, episodeNumber, seriesTitle } = req.body;
//             const title = seriesTitle.replace(/\s+/g, '-');
//             cb(null, `${title}-Season${seasonNumber}Episode${episodeNumber}-${shortid.generate()}-streamvibe${ext}`);
//         } else {
//             const title = req.body.title.replace(/\s+/g, '-');
//             cb(null, `${title}-${req.body.release_date}-${shortid.generate()}-streamvibe${ext}`);
//         }
//     },
// });

// const upload = multer({ storage });

// const processImage = async (filePath) => {
//     try {
//         const outputPath = filePath.replace(/\.(jpg|jpeg|png|webp)$/, '-processed$&');

//         await sharp(filePath)
//             .resize({ width: 800 }) // Resize to a width of 800 pixels
//             .toFile(outputPath);

//         // Remove the original file if it's not needed
//         await unlinkAsync(filePath);

//         return outputPath;
//     } catch (error) {
//         console.error('Error processing image:', error);
//         throw error;
//     }
// };

// const imageProcessingMiddleware = (req, res, next) => {
//     // Process all files uploaded
//     const files = req.files ? Object.values(req.files).flat() : [];
//     const imageFiles = files.filter(file => /\.(jpg|jpeg|png|webp)$/.test(file.originalname));

//     Promise.all(imageFiles.map(file => processImage(file.path)))
//         .then(() => next())
//         .catch(err => next(err));
// };

// //! movie controller
// exports.movieUploader = [upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: "cover", maxCount: 1 }, { name: 'trailer', maxCount: 1 }, { name: 'files' }]), imageProcessingMiddleware];

// //! series controller
// exports.seriesUploader = [upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: "cover", maxCount: 1 }, { name: 'trailer', maxCount: 1 }]), imageProcessingMiddleware];

// //! episode controller
// exports.episodeUploader = [upload.fields([{ name: 'files' }, { name: 'pictures', maxCount: 2 }]), imageProcessingMiddleware];


// const multer = require('multer');
// const sharp = require('sharp');
// const shortid = require("shortid");
// const path = require("path");
// const fs = require('fs');
// const util = require('util');

// const unlinkAsync = util.promisify(fs.unlink);

// // Setup multer storage
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         let dir;
//         switch (file.fieldname) {
//             case 'thumbnail':
//             case 'pictures':
//                 dir = 'public/thumbnail';
//                 break;
//             case 'cover':
//                 dir = 'public/cover';
//                 break;
//             case 'trailer':
//                 dir = 'public/trailer';
//                 break;
//             case 'files':
//                 dir = 'public/videos';
//                 break;
//             default:
//                 dir = 'public/';
//         }
//         cb(null, dir);
//     },
//     filename: (req, file, cb) => {
//         const ext = path.extname(file.originalname);
//         const filenameWithoutExt = path.basename(file.originalname, ext);

//         if (req.body.episodeNumber) {
//             const { seasonNumber, episodeNumber, seriesTitle } = req.body;
//             const title = seriesTitle.replace(/\s+/g, '-');
//             cb(null, `${title}-Season${seasonNumber}Episode${episodeNumber}-${shortid.generate()}-streamvibe${ext}`);
//         } else {
//             const title = req.body.title.replace(/\s+/g, '-');
//             cb(null, `${title}-${req.body.release_date}-${shortid.generate()}-streamvibe${ext}`);
//         }
//     },
// });

// const upload = multer({ storage });

// // Process the image
// const processImage = async (filePath) => {
//     try {
//         const outputPath = filePath.replace(/\.(jpg|jpeg|png|webp)$/, '-processed$&');

//         // Resize and save the processed image
//         await sharp(filePath)
//             .resize({ width: 800 }) // Resize to a width of 800 pixels
//             .toFile(outputPath);

//         // Remove the original file
//         await unlinkAsync(filePath);

//         return outputPath;
//     } catch (error) {
//         console.error('Error processing image:', error);
//         throw error;
//     }
// };

// // Middleware to process images
// const imageProcessingMiddleware = async (req, res, next) => {
//     try {
//         // Gather all files uploaded
//         const files = req.files ? Object.values(req.files).flat() : [];
//         const imageFiles = files.filter(file => /\.(jpg|jpeg|png|webp)$/.test(file.originalname));

//         // Process all image files
//         await Promise.all(imageFiles.map(file => processImage(file.path)));

//         next();
//     } catch (error) {
//         next(error);
//     }
// };

// // Export uploader functions
// exports.movieUploader = [upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: "cover", maxCount: 1 }, { name: 'trailer', maxCount: 1 }, { name: 'files' }]), imageProcessingMiddleware];
// exports.seriesUploader = [upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: "cover", maxCount: 1 }, { name: 'trailer', maxCount: 1 }]), imageProcessingMiddleware];
// exports.episodeUploader = [upload.fields([{ name: 'files' }, { name: 'pictures', maxCount: 2 }]), imageProcessingMiddleware];




//! V3
// const multer = require('multer');
// const sharp = require('sharp');
// const shortid = require("shortid");
// const path = require("path");
// const fs = require('fs');
// const util = require('util');

// const unlinkAsync = util.promisify(fs.unlink);

// // Setup multer storage
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         let dir;
//         switch (file.fieldname) {
//             case 'thumbnail':
//             case 'pictures':
//                 dir = 'public/thumbnail';
//                 break;
//             case 'cover':
//                 dir = 'public/cover';
//                 break;
//             case 'trailer':
//                 dir = 'public/trailer';
//                 break;
//             case 'files':
//                 dir = 'public/videos';
//                 break;
//             default:
//                 dir = 'public/';
//         }
//         cb(null, dir);
//     },
//     filename: (req, file, cb) => {
//         const ext = path.extname(file.originalname);
//         const filenameWithoutExt = path.basename(file.originalname, ext);

//         if (req.body.episodeNumber) {
//             const { seasonNumber, episodeNumber, seriesTitle } = req.body;
//             const title = seriesTitle.replace(/\s+/g, '-');
//             cb(null, `${title}-Season${seasonNumber}Episode${episodeNumber}-${shortid.generate()}-streamvibe${ext}`);
//         } else {
//             const title = req.body.title.replace(/\s+/g, '-');
//             cb(null, `${title}-${req.body.release_date}-${shortid.generate()}-streamvibe${ext}`);
//         }
//     },
// });

// const upload = multer({ storage });

// // Process the image
// const processImage = async (filePath) => {
//     try {
//         const outputPath = filePath.replace(/\.(jpg|jpeg|png|webp)$/, '-processed$&');

//         // Resize and save the processed image
//         await sharp(filePath)
//             .resize({ width: 800 }) // Resize to a width of 800 pixels
//             .toFile(outputPath);

//         // Remove the original file
//         await unlinkAsync(filePath);

//         return outputPath;
//     } catch (error) {
//         console.error('Error processing image:', error);
//         throw error;
//     }
// };

// // Middleware to process images
// const imageProcessingMiddleware = async (req, res, next) => {
//     try {
//         // Gather all files uploaded
//         const files = req.files ? Object.values(req.files).flat() : [];
//         const imageFiles = files.filter(file => /\.(jpg|jpeg|png|webp)$/.test(file.originalname));

//         // Process all image files
//         await Promise.all(imageFiles.map(async (file) => {
//             try {
//                 await processImage(file.path);
//             } catch (error) {
//                 console.error('Image processing error:', error);
//                 // Optionally handle the error or skip to next file
//             }
//         }));

//         next();
//     } catch (error) {
//         next(error);
//     }
// };

// // Export uploader functions
// exports.movieUploader = [upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: "cover", maxCount: 1 }, { name: 'trailer', maxCount: 1 }, { name: 'files' }]), imageProcessingMiddleware];
// exports.seriesUploader = [upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: "cover", maxCount: 1 }, { name: 'trailer', maxCount: 1 }]), imageProcessingMiddleware];
// exports.episodeUploader = [upload.fields([{ name: 'files' }, { name: 'pictures', maxCount: 2 }]), imageProcessingMiddleware];
