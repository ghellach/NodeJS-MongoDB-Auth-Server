const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
//Import routes
const webRoute = require('./routes/web');
const authRoute = require('./routes/auth');

//config
dotenv.config();

//Connect DB
mongoose.connect(
    process.env.DB_CONNECT,
    { useNewUrlParser: true },
    () => console.log('Connected to DB !')
);

//To use body parser
app.use(express.json())


//Route middlewares
app.use('/', webRoute);
app.use('/api/user', authRoute);


app.listen(3000, () => { console.log('Server up and running.') })