require('dotenv').config();

const express = require("express");
const expressLayout = require("express-ejs-layouts");
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const session = require('express-session');
const methodOverride = require('method-override');
const path = require('path');

const connectDB = require('./server/config/db')

const app = express();
const PORT = 3000 || process.env.PORT;

// connect to Database
connectDB();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));

// session express
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL
    })
}));

// stylish accept
app.use(express.static('public'));

// Templating Engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

// From server
app.use('/', require('./server/router/main'));
app.use('/', require('./server/router/admin'));

app.listen(PORT, () => {
    console.log(`App listening ${PORT}`)
});