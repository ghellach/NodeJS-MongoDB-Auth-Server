const router = require('express').Router();
const tokenCheck = require('./auth');
const User = require('../model/User')

router.all('/', (req, res) => {
    res.send('Hey, welcome to my auth server.')
})

router.post('/tokencheck', tokenCheck.tokenCheck, async (req, res) => {
    const user = await User.findOne({_id: req.user._id})
    res.json(
        {
            'joke': '(not really a joke) random route somewhere, but token is valid (I don\'t like that word)',
            'id': user._id
        }
    );
})

module.exports = router