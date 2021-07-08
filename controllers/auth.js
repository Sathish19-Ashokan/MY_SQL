const mysql = require('mysql2');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'sathish',
  password: 'Sathish@19',
  database: 'ecommerce',
});

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).render('login', { count: 1, message: 'please provide email and password', title: 'Login' });
    }
    connection.query('SELECT * FROM customer WHERE email = ?', [email],
      async (err, result) => {
        if (err) {
          res.send('Server Error..', err);
        }
        if (result.length === 0 || !(await bcrypt.compare(password, result[0].password))) {
          res.status(401).render('login', { count: 1, message: 'Email or Password is incorrect', title: 'Login' });
        } else {
          req.session.userId = result[0].customer_id;
          req.session.user = result[0];
          console.log('No result id', result[0].customer_id);
          res.redirect('/home');
        }
      });
  } catch (error) {
    console.log(error);
  }
};

exports.register = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const alert = errors.array();
    res.render('signup', { alert, alerts: 'Not', title: 'Signup' });
  } else {
    const { email, username, password } = req.body;
    const count = 0;
    connection.query('SELECT email FROM customer WHERE email = ?', [email],
      async (err, result) => {
        if (err) {
          // throw err;
          res.send('Server Error..', err);
        }
        if (result.length > 0) {
          const alert = errors.array();
          return res.render('signup', { alert, alerts: 'Exist', title: 'Signup' });
        }
        const hashedPassword = await bcrypt.hash(password, 8);
        connection.query('INSERT INTO customer(username,password,email) VAlUES (?, ?, ?)', [username, hashedPassword, email], (err, result) => {
          if (err) {
            // throw err;
            res.send('Server Error..', err);
          } else {
            console.log(result);
            res.render('validation', { count, message: 'Registration Successful', title: 'Validation' });
          }
        });
      });
  }
};

exports.home = (req, res) => {
  let user = req.session.user;
  let userId = req.session.userId;
  if (userId == null) {
    return res.redirect('/login');
  }
  connection.query('SELECT * FROM customer WHERE customer_id = ?', [userId], (err, results) => {
    res.render('user', { title: 'Home' });
  });
};

exports.logout = (req, res) => {
  if (req.session.user) {
    req.session.destroy(() => {
      res.redirect('/login');
    });
  }
};

exports.start = (req, res) => {
  res.render('loginOrSignup', { title: 'Login or Signup' });
};
