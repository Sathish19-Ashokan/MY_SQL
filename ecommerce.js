const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');

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
    console.log('mysql is connected....');
})

const app = express();
app.use(express.static('public'));

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/', [
  check('username','Username must be 3+ char long')
    .exists()
    .isLength({ min : 3 }),
  check('email', 'Invalid Email')
    .isEmail()
    .normalizeEmail(),
 
  ],(req,res) => {
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
              console.log(count);
              res.render('validation', { count });
            }
        }
  );
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
          if(results[i].email === email && results[i].password === password){
            count++;
          }
        }
        if(count > 0){
          res.sendFile(`${__dirname}/user.html`);
        }
        else{
          res.send('Invalid Login');
        }
    }
  );
})


app.get('/login',(req,res) => {
  res.sendFile(`${__dirname}/login.html`)
})

app.get('/signup', (req,res) => {
  res.sendFile(`${__dirname}/signupForm.html`);
})


app.listen(3000, (req,res) => {
    console.log('Listening on port 3000');
})
