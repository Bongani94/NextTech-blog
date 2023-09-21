const express = require('express');
const router = express.Router();
const Post = require('../models/Post');


// Home page
router.get('', async (req, res) => {
    try {
        const locals = {
            title: "Next Tech Blog",
            description: "This platform aims to provide a space for tech enthusiasts to share their personal stories, experiences, challenges, and valuable insights on excelling in this dynamic field."
        }

        let perPage = 10;
        let page = req.query.page || 1;
        const recentPost = await Post.findOne().sort({ createdAt: -1 });

        const data = await Post.aggregate([ { $sort: { createdAt: -1 }} ])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();

        const count = await Post.count();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        res.render("home", {
            locals,
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null,
            recentPost
        });

    } catch (err) {
        console.log(err)
    }
});

// Get Id from post
router.get('/post/:id', async (req, res) => {
    try {
        
        let slug = req.params.id;

        const data = await Post.findById({ _id: slug });

        const locals = {
            title: data.title,
            description: "",
        }
        res.render("post", { locals, data })
    } catch (err) {
        console.log(err)
    }
});

/* Post -> searchTerm*/
router.post('/search', async (req, res) => {
    try {
        const locals = {
            title: "Search",
            description: ""
        }

        let searchTerm = req.body.searchTerm;
        const noSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "")


        const data = await Post.find({
            $or: [
                { title: { $regex: new RegExp(noSpecialChar, 'i') }},
                { body: { $regex: new RegExp(noSpecialChar, 'i') }}
            ]
        });
        res.render('search', { locals, data });
    }
    catch (err) {
        console.log(err)
    }
})

/**
 * GET /
 * About Page
 */
router.get('/about', (req, res) => {
    res.render('about');
});

/**
 * GET /
 * contact Page
 */
router.get('/contact', (req, res) => {
    res.render('contact')
})

module.exports = router;