const express = require('express');

const router = express.Router();

const authController = require('../controllers/auth');

router.get('/', authController.start);

router.get('/login', (req, res) => {
  res.render('login', { count: 0, message: '', title: 'Login' });
});

router.get('/signup', (req, res) => {
  res.render('signup', { alerts: 'hh', title: 'Signup' });
});

router.get('/home', authController.home);

router.get('/logout', authController.logout);

module.exports = router;
