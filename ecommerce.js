const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');
//const expressSession = require('express-session');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'sathish',
    password:'Sathish@19',
    database: 'ecommerce'
  });

connection.connect((err) => {
    if(err){
        throw err;
    }
    console.log('mysql is connected....')
})

const app = express();
app.use(express.static('public'));

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));

//app.use(expressValidator());
//app.use(expressSession({secret : 'max', saveUninitialized: false, resave : false}));


// app.get('/', (req,res) => {
//     let sqlCode = 'SELECT first_name, last_name FROM users';
//     connection.query(sqlCode,
//     function(err, results) {
//         if(err){
//             throw err;
//         }
//       res.render('database',{ name : results });
//     }
//   );
// })

app.post('/', [
  check('username','Username must be 3+ char long')
    .exists()
    .isLength({ min : 3 }),
  check('email', 'Invalid Email')
    .isEmail()
    .normalizeEmail(),
 
],(req,res) => {
  // res.check('email', 'Invalid Email Address').isEmail();
  // res.check('password', 'Password is Invalid').isStrongPassword({minLength: 5, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1});
  // let errors = req.validationErrors();
  // if(errors){
  //   req.session.errors = errors;
  //   req.session.success = false;
  // }
  // else{
  //   req.session.success = true;
  // }
  // res.redirect('/signup');
  const errors = validationResult(req);
    if(!errors.isEmpty()){
      const alert = errors.array();
      res.render('signup',{ alert });
    }
  
  const { email, username, password } = req.body;
  let check = 'select * from customer';
  let count = 0;
  connection.query(check,
        function(err, results) {
            if(err){
                throw err;
            }
            for(let i=0;i<results.length;i++){
              //if(results[i].username === username || results[i].password === password || results[i].email === email){
              if(results[i].email === email){
                count++;
              }
            }
            if(count > 0){
              res.render('validation',{count});
            }
            else{
              let sqlCode = `INSERT INTO customer(username,password,email) VALUES('${username}','${password}','${email}')`;
              connection.query(sqlCode);
              // res.send(`<h3>SignUp Success</h3>
              // <button onclick="history.go(-1)">
              //   BACK
              // </button>`);
              console.log(count);
              res.render('validation', { count });
            }
        }
      );







  //console.log(username,password,email);
  // let sqlCode = `INSERT INTO customers(username,password,email) VALUES('${username}','${password}','${email}')`;
  // connection.query(sqlCode);
  // function(err,results) {
  //     if(err){
  //         throw err;
  //     }
  //   res.send('SignUp successful');
  // });
  });

app.get('/', (req,res) => {
  res.sendFile(`${__dirname}/loginOrSignup.html`);
})

app.post('/user', (req,res) => {
  const { email, password } = req.body;
  let check = 'select * from customers';
  let count = 0;
  connection.query(check,
    function(err, results) {
        if(err){
            throw err;
        }
        for(let i=0;i<results.length;i++){
          //if(results[i].username === username || results[i].password === password || results[i].email === email){
          if(results[i].email === email && results[i].password === password){
            count++;
          }
        }
        if(count > 0){
          //res.render('validation',{count});
          res.sendFile(`${__dirname}/user.html`);
        }
        else{
          res.send('Invalid Login');
        }
    }
  );
  //res.sendFile(`${__dirname}/user.html`);
})


// app.get('/login', (req,res) => {
//   let sqlCode = 'SELECT first_name, last_name FROM users';
//   connection.promise().query(sqlCode)
//     .then( ([rows,fields]) => {
//       res.render('database',{ name : rows});
//     })
//     .catch(console.log)
//   });

app.get('/login',(req,res) => {
  res.sendFile(`${__dirname}/login.html`)
})

app.get('/signup', (req,res) => {
  res.sendFile(`${__dirname}/signupForm.html`);
  // res.render('signup',{success : req.session.success, errors : req.session.errors});
  // req.session.errors = null;
})


app.listen(3000, (req,res) => {
    console.log('Listening on port 3000');
})
