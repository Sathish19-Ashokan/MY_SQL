const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

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

let session = require('express-session');

const app = express();

app.use(session({
  secret: 'secret cat',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 },
}));
app.use(express.static('public'));

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', require('./routes/page'));
app.use('/auth', require('./routes/auth'));

app.listen(3000, () => {
  console.log('Listening on port 3000');
});
