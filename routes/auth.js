const express = require('express');
const { check, validationResult } = require('express-validator');

const authController = require('../controllers/auth');

const router = express.Router();

router.post('/register', [
  check('password', 'Password must be 3+ char long')
    .isLength({ min: 3 }),
  check('username', 'Username must be 3+ char long')
    .exists()
    .isLength({ min: 3 }),
  check('email', 'Invalid Email')
    .isEmail()
    .normalizeEmail(),
], authController.register);

router.post('/user', authController.login);

router.post('/home', authController.home);

module.exports = router;
