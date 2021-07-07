const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('loginOrSignup', { title: 'Login or Signup' });
});

router.get('/login', (req, res) => {
  res.render('login', { count: 0, message: '', title: 'Login' });
});

router.get('/signup', (req, res) => {
  res.render('signup', { alerts: 'hh', title: 'Signup' });
});

module.exports = router;
