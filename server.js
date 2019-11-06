const express = require('express') // express package
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require ('cors');
const knex = require('knex'); //knex library for connecting our databse to the server
const profile = require('./controllers/profile');
const register = require('./controllers/register');
const image = require('./controllers/image');
const signin = require('./controllers/signin');
const db= knex({
        client: 'pg',
        connection: {
          host : '127.0.0.1', //localhost
          user : 'postgres',
          password : '789456',
          database : 'smartweb'
        }
  





      });
      
 
      const db = knex({
        client: 'pg',
        connection: {
          host : '127.0.0.1',
          user : 'postgres',
          password : '789456',
          database : 'smart-brain'
        }
      });
 
 
 
      const app = express();


app.use(bodyParser.json()); //using body-parser library

app.use(cors()); //using cors library


app.get('/', (req,res) => {res.send('it is working')})
app.post('/signin',(req,res) => {signin.handleSignin(req,res , db , bcrypt)})
app.post('/register',(req,res) =>  {register.handleRegister(req,res,db,bcrypt)}) //dependency injection method
app.get ('/profile:id' , (req,res) => {msWriteProfilerMark.handleprofileGet (req , res , db)})
app.put ('/image' , (req,res) => {image.handleImage(req,res,db)})
app.post ('/imageurl' , (req,res) => {image.handleApiCall(req,res,db)})




// for Signin 
app.post ('/signin', (req,res) =>{
    db.select('email','hash').from('login') //selecting or searchiing for email&hash from login database
    .where('email' , '=' , req.body.email )
    .then(data => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      
      if (isValid){ //if email and password matche the database ,  he enters home page
        return db.select('*').from('users')
        .where('email', '=' , req.body.email)
        .then(user => {
          res.json(user[0]) //first item
        })
       .catch(err => res.status(400).json("unable to get the user"))
      } else{
        res.status(400).json('wrong credentials ') //if user enters wrong info

      }
   })
    
    .catch(err => res.status(400).json('wrong credentials'))
})

//---------------------------------------------------------------------------------------------------------------------------//
// For register

app.post('/register',(req,res)=>{
  const {email , name , password } = req.body; // getting all the info from json in body
   const hash = bcrypt.hashSync(password);
   
   db.transaction(trx =>{  //Knex props
     trx.insert({  //insert these two values into
       hash: hash,
       email:email
     }) //we are creating transcactin between login and users databse. If the user regisrs , the info will be sent to login and users databse
     .into('login') //into login
      .returning('email')
     
     .then(loginEmail => {
        return trx('users')
           .returning('*')
           .insert({
              email: loginEmail[0] ,
              name: name ,
              joined: new Date()
          }) //insert ends here
       
            .then(user => {
            res.json(user[0]);     
             })
          
       })//LoginEmail ends here
                    
           .then (trx.commit)        
           .catch(trx.rollback)
          
          })  // db.transaction ends here
         
          .catch(err => res.status(400).json('unable to register')) 


        }) //app.post(register) ends here
 



// for checking ID
app.get('/profile/:id', (req,res)=>{
     const { id } = req.params;

     db.select('*').from('users').where({id})
     .then(user =>{ 
         console.log(user)
         if (user.length){ //if user enters wrong ID
             res.json(user[0])
         } else {
          res.status(400).json('not found')
         }
     })

     .catch(err =>res.status(400).json('not found'))

})


// for Image and entries & updating the user's entry
app.put('/image',(req,res)=>{
    const {id} = req.body;
    db('users').where('id', '=' ,id) 
    .increment('entries',1)
    .returning('entries')
    .then(entries =>{
        res.json(entries[0]);
    })
    
     .catch(err => res.status(400).json('not found'));
    
})


app.listen(process.env.PORT || 3000 , () =>{
    console.log(`app is running on port ${process.env.PORT}`);
})

/*
 --> res = this is working
 /sigin --> POST = success/fail  --> done
 / register --> POST = new user  --> done
 /profile/:userId --> GET = user --> done
 /image --> PUT --> user
 */
