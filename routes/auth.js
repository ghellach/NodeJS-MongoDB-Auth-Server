const router = require('express').Router();
const User = require('../model/User');
const {loginValidator, registerValidator} = require('../validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const tokenCheck = (req, res, next) => {
    const token = req.header('access_token');
    if(!token) return res.status(401).send('Access Denied');

    try{
        const check = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = check;
        next();
    }catch(err) {
        res.status(400).send('Token invalid');
    }
};


router.post('/login', async (req, res) => {
    const {error} = loginValidator(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Email is not found');

    const password = await bcrypt.compare(req.body.password, user.password);
    if(!password) return res.status(400).send('Password is wrong');

    //Deliver JWT
    const token = jwt.sign({
        _id: user.id,
    }, process.env.TOKEN_SECRET);
    res.header('access_token', token).send(token)

    res.send('Correct !');
});


router.post('/register', async (req, res) => {

    //Validate data
    const {error} = registerValidator(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Check if email is unique
    const emailExists = await User.findOne({email: req.body.email});
    if(emailExists) return res.status(400).send('Email already exists');

    //Hash password
    const salt = await bcrypt.genSaltSync(10);
    const hashed = await bcrypt.hashSync(req.body.password, salt);

    //insert user
    const user = new User( {
        name: req.body.name,
        email: req.body.email,
        password: hashed,

    });
    try{
        const savedUser = await user.save();
        res.send(savedUser.id)
    }catch(err) {
        res.status(400).send(err)
    }
});

module.exports = router
module.exports.tokenCheck = tokenCheck