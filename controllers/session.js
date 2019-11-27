const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/users.js');

router.get('/', (req, res) => {
	res.json(req.session.user)
})

router.delete('/', (req, res) => {
    req.session.destroy(() => {
        res.json({
            destroyed:true
        });
    })
});

router.post('/', (req, res) => {
    User.findOne({username:req.body.username}, (error, foundUser) => {
        if(foundUser === null){
            res.json({
                message:'User not found',
            });
        } else {
            const doesPasswordMatch = bcrypt.compareSync(req.body.password, foundUser.password);
            if(doesPasswordMatch){
            	req.session.user = foundUser
            	// console.log(req.session.user)
                res.json(foundUser)
            } else {
                res.json({
                    message:'Incorrect Password'
                });
            }
        }
    });
});

module.exports = router
