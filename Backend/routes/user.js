const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const user = require('../Models/user');

router.post('/signup', (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hashPassword => {
            const User = new user({
                email: req.body.email,
                password: hashPassword
            });
            console.log(User);
            User.save()
                .then(result => {
                    res.status(201).json({
                        message: "User created..!",
                        result: result
                    })
                })
                .catch(err => {
                    console.log(err)
                    res.send(500).json({
                        error: err
                    })
                })
        });
});

module.exports = router;