const mysql = require('mysql2');
const { check, validationResult } = require('express-validator');

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
    connection.query('SELECT email, password FROM customer WHERE email = ? AND password = ?', [email, password],
      (err, result) => {
        console.log(result);
        if (result.length === 0) {
          res.status(401).render('login', { count: 1, message: 'Email or Password is incorrect', title: 'Login' });
        } else {
          res.render('user', { title: 'User' });
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
      (err, result) => {
        if (err) {
          throw err;
        }
        if (result.length > 0) {
          const alert = errors.array();
          return res.render('signup', { alert, alerts: 'Exist', title: 'Signup' });
        }
        connection.query('INSERT INTO customer(username,password,email) VAlUES (?, ?, ?)', [username, password, email], (err, result) => {
          if (err) {
            throw err;
          } else {
            console.log(result);
            res.render('validation', { count, message: 'Registration Successful', title: 'Validation' });
          }
        });
      });
  }
};
