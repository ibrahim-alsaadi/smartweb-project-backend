// For register

const handleRegister = (req,res,db,bcrypt) => {
  if (!email || !name || !password){ // if one of those values are empty , it will turn true
    return res.status(400).json('incorrect form submission') // we use return to end the execution after incorrect submission

  }
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
  
  
          } //app.post(register) ends here
 
          module.exports ={
            handleRegister: handleRegister
          }