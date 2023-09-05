const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const blogRoutes = require('./routes/blogRoutes');

const app = express();

// connect to mangodb
const dbURI = 'mongodb+srv://tech:team1234@cluster0.ethqys6.mongodb.net/note?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(3000))
    .catch((err) => console.log(err));

// ejs template
app.set('view engine', 'ejs');

// middleware
app.use(express.urlencoded({ extendend: true }));
app.use(morgan('dev'));

// home page
app.get('/', (req, res) => {
    res.redirect('/blogs');
});

// about page
app.get('/about', (req, res) => {
    res.render('about', { title: 'About' })
});

// blog routes
app.use('/blogs', blogRoutes)

// 404 error page
app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
})
