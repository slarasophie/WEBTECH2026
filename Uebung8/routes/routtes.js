const express = require('express');
const router = express.Router();
const Member = require('./models/members');

// get all members
router.get('/members', async(req, res) => {
    const allMembers = await Member.find();
    console.log(allMembers);
    res.send(allMembers);
});

module.exports = router;
// post one member
router.post('/members', async(req, res) => {
    const newMember = new Member({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        ipaddress: req.body.ipaddress
    })
    await newMember.save();
    res.send(newMember);
});