const express = require('express');
const bodyParser =require('body-parser')
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors')
const knex = require('knex')

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
      console.log(data)
  })

const app = express();
app.use(bodyParser.json());
app.use(cors());

const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally',
            email: 'Sally@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }
    ],
    login: [
        {
            id: '987',
        }
    ] 
}

app.get('/', (req, res) => {
    
    res.send(database.users);
})

// signin 
app.post('/signin', (req, res) => {

    if(req.body.email === database.users[0].email && 
        req.body.password === database.users[0].password) {
           res.json(database.users[0]); 
        } else {
            res.status(400).json('error loading')
        }
})

//register
app.post('/register', (req, res) => {
    const {email, name, password } = req.body;

    db('users')
    .returning('*')
    .insert({
        email: email,
        name: name,
        joined: new Date()
    })
    .then(user => {
        res.json(user[0])
    })
    .catch(err => res.status(400).json('unable to register')); 
})

//profile
app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    
    db.select('*').from('users')
        .where({
            id: id
        })
        .then(user => {
            if(user.length){
            res.json(user[0])
            } else {
                res.status(400).json('not found') 
            }
        })
        .catch(err => res.status(400).json('error getting user'))
})

//image entries count
app.put('/image', (req, res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++
          return res.json(user.entries) 
        }
    })
    if (!found) {
        res.status(400).json('not found')
    }
})





app.listen(3000, ()=> {
    console.log('runnin on 3000');
})
