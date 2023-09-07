const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/post");
const categoryRoute = require("./routes/categories");
const multer = require("multer");
const dotenv = require("dotenv");

const app = express();
dotenv.config();
app.use(express.json());

// connect to mangodb
mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        
    })
    .then(console.log("Connect to mongoDB"))
    .catch((err) => console.log(err));

// ejs template
app.set('view engine', 'ejs');

// middleware
app.use(express.urlencoded({ extendend: true }));
app.use(morgan('dev'));

// Image upload
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "images");
    },
    filename: (req, file, callback) => {
        callback(null, req.body.name);
    },
});

const upload = multer({storage:storage});
app.post("/api/upload", upload.single("file"), (req, res) => {
    res.status(200).json("File has been uploaded")
});

// Routes pages
app.use("/auth", authRoute);
app.use("/users", userRoute);
app.use("/posts", postRoute);
app.use("/categories", categoryRoute);


// 404 error page
app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
})

app.listen(3000)