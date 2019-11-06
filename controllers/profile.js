const handleprofileGet = (req,res,db)=>{
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
}

module.exports = {
 handleprofileGet: handleprofileGet
}