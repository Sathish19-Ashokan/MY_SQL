const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'sathish',
  password: 'Sathish@19',
  database: 'ecommerce',
});

connection.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('mysql is connected....');
});

const app = express();
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', `${__dirname}/public/views`);

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/', [
  check('username', 'Username must be 3+ char long')
    .exists()
    .isLength({ min: 3 }),
  check('email', 'Invalid Email')
    .isEmail()
    .normalizeEmail(),

], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const alert = errors.array();
    res.render('signup', { alert, alerts: 'Not' });
  } else {
    const { email, username, password } = req.body;
    let count = 0;
    connection.query('INSERT INTO customer(username,password,email) VAlUES (?, ?, ?)', [username, password, email],
      (err) => {
        if (err) {
          count += 1;
        }
        const errors = validationResult(req);
        if (count > 0) {
          const alert = errors.array();
          res.render('signup', { alert, alerts: 'Exist' });
        } else {
          res.render('validation', { count });
        }
      });
  }
});

app.get('/', (req, res) => {
  res.render('loginOrSignup');
});

app.post('/user', (req, res) => {
  const { email, password } = req.body;
  const checkLogin = 'select * from customer';
  let count = 0;
  connection.promise().query(checkLogin)
    .then(([results, fields]) => {
      for (let i = 0; i < results.length; i += 1) {
        if (results[i].email === email && results[i].password === password) {
          count += 1;
        }
      }
      if (count > 0) {
        res.render('user');
      } else {
        res.send('Invalid Login');
      }
    })
    .catch((err) => {
      res.send(err);
    });
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/signup', (req, res) => {
  res.render('signup', { alerts: 'hh' });
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});
