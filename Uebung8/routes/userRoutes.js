const express = require('express');
const router = express.Router();

// eine GET-Anfrage
router.get('/', async(req, res) => {

    res.send({ message: "Hello FIW!" });
});

//post one user
router.post('/', async(req, res) =>{
    const username = req.body.username;
    const email = req.body.email;
    let user = await User.findOne({ username : username});
    console.log('user nach username : ', user)
     let email = await User.findOne({ email : email});
    console.log('user nach email : ', user)
    const newUser = newUser({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        role:   req.body.role
    })
    await newUser.save();
    req.statusCode(201);
    res.send(newUser);
});
module.exports = router;