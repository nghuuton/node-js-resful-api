const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController')

router.post('/signup', userController.sign);

router.post('/login', userController.login);

router.delete('/:userId', userController.delete);

module.exports = router;