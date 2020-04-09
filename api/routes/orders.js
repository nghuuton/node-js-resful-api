const express = require('express');
const router = express.Router();

const orderController = require('../controllers/orderController')
const checkAuth = require('../middleware/check-auth');


router.get('/', checkAuth, orderController.index);

router.post("/", checkAuth, orderController.store);

router.get('/:orderId', checkAuth, orderController.show)

router.delete('/:orderId', checkAuth, orderController.delete)

module.exports = router;