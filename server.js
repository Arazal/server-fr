const express = require('express');
const bodyParser =require('body-parser')
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors')
const knex = require('knex')

const register = require('./controllers/register')
const signin = require('./controllers/signin')
const profile = require('./controllers/profile')
const image = require('./controllers/image')

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : '',
      database : 'smart-brain'
    }
  });

 db.select('*').from('users')
  .then(data => {
     // console.log(data)
  })

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => { 
    res.send(database.users);
})
// signin 
app.post('/signin', (req, res) => {
    signin.handleSignin(req, res, db, bcrypt)})
//register
app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)}) 
//profile
app.get('/profile/:id', (req, res) => {profile.handleprofileGet(req, res, db)})
//image entries count
app.put('/image', (req, res) => {image.handleImage(req, res, db)})
app.post('/imageurl', (req, res) => {image.handleApiCall(req, res)})

app.listen(3000, ()=> {
    console.log('runnin on 3000');
})
