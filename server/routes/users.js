const express =require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const verifyToken = require('./verifyToken');

router.post('/register', async (req, res) => {
    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    });
    User.findOne({ email: req.body.email }).then(user => {
        if(!user) {
            bcrypt.genSalt(10,  (err, salt) => {
                bcrypt.hash(newUser.password, salt,async (err, hash) => {
                    newUser.password = hash;
                    newUser.save();
                });
            });
        } else {
            res.json({ message: 'This email is already there' });
            console.log('This email is already there');
        }
    }).catch(err => console.log(err));
});

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

router.post('/users',verifyToken, async (req, res) => {
    try {
        jwt.verify(req.token, 'secretKey', async (err, authData) => {
            if(err) {
                res.sendStatus(403);
            }
            if(authData.role === 'admin') {
                let users = await User.find();
                await res.json(users.map(user => {
                    return {
                        'name': user.name,
                        'email': user.email,
                        'role': user.role,
                    };
                }));
            }
            else {
                res.json('This is protected page')
            }
        });
    } catch (err) {
        res.sendStatus(500);
    }
});

router.post('/dashboard', verifyToken, (req, res) => {
    try {
        jwt.verify(req.token, 'secretKey', (err, authData) => {
            if(err) {
                res.sendStatus(403);
            } else {
                res.json({ user: authData, token: req.token });
            }
        });
    } catch (err) {
        res.sendStatus(500);
    }
});

router.post('/login', async (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if(err) {
            return res.status(500).json({
                title: 'server error',
                error: err,
            })
        }
        if(!user) {
            return res.status(401).json({
                title: 'user not found',
                error: 'invalid credentials'
            })
        }
        if(!bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(401).json({
                title: 'login failed',
                error: 'invalid credentials'
            })
        }
        else {
            let token = jwt.sign({ id: user.id, name: user.name, role: user.role, email: user.email },
                'secretKey', { expiresIn: 86400 });
            res.status(200).header('auth-token', token).send({ auth: true, token: token, user: user });
        }
    });

});

module.exports = router;