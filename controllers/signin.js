const handleSignin = (req,res , db , bcrypt) =>{
  
  const {email , password} = req.body; 
  
  if (!email || !password){ // if one of those values are empty , it will turn true
    return res.status(400).json('incorrect form submission') // we use return to end the execution after incorrect submission
  }

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

}

module.exports = {
    handleSignin: handleSignin
}