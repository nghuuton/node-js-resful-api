const express = require('express');
const router = express.Router();
const multer = require('multer');

const productController = require('../controllers/productController');
const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '_' + file.originalname);
        // cb(null, new Date().toISOString() + file.originalname); MACOS
    }
})

const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype == "image/jpg") {
        cb(null, true);
    } else {
        cb(null, false);
        return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});




router.get('/', productController.index);

router.post('/', checkAuth, upload.single('productImage'), productController.store);

router.get('/:productId', checkAuth, productController.show);

router.patch('/:productId', checkAuth, productController.update);

router.delete('/:productId', checkAuth, productController.delete);

module.exports = router;