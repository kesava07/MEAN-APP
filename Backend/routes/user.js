const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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
                .catch(() => {
                    res.status(500).json({
                        message: "Invalid authentication credentials"
                    });
                });
        });
});

router.post("/login", (req, res, next) => {
    let fetchedUser;
    user.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: "Authentication Failed" });
            }
            fetchedUser = user;
            return bcrypt.compare(req.body.password, user.password)
        })
        .then(result => {
            if (!result) {
                return res.status(401).json({ message: "Authentication Failed" });
            }
            const token = jwt.sign(
                { email: fetchedUser.email, userId: fetchedUser._id },
                "secret_this_should_be_longer",
                { expiresIn: '1h' }
            )
            res.status(200).json({
                token: token,
                expiresIn: 3600,
                userId: fetchedUser._id
            })
        })
        .catch(() => {
            return res.status(401).json({ message: "Invalid authentication credentials" });
        })
})

module.exports = router;