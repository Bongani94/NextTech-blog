const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { ensureAuthenticated } = require('../config/auth')

const adminLayout = '../views/layouts/admin';

/**
 * Get /
 * Admin dashboard
 */
router.get('/dashboard', ensureAuthenticated, (req, res) => 
    res.render('admin/dashboard', {
        name: req.user.name,
        layout: adminLayout
    })
);

/**
 * GET /
 * Admin - Create New Post
 */
router.get('/add-post', ensureAuthenticated, async (req, res) => {
    try {
        const locals = {
            title: 'Add Post',
            description: ""
        }

        const data = await Post.find();
        res.render('admin/add-post', {
            locals,
            layout: adminLayout
        })  
    } catch (err) {
        console.log(err);
    }

});

/**
 * Post /
 * Admin - Create New Post
 */
router.post('/add-post', ensureAuthenticated, async (req, res) => {
    try {
        try {
            const newPost = new Post({
                title: req.body.title,
                body: req.body.body
            });
            await Post.create(newPost);
            res.redirect('/dashboard');

        } catch (err) {
            console.log(err)
        }


    } catch (err) {
        console.log(err);
    }

});

/**
 * GET /
 * Admin - Update old Blog
 */
router.get('/edit-post/:id', ensureAuthenticated, async (req, res) => {
    try {
        let par = req.params.id

        const data = await Post.findOne({ _id: par });

        const locals = {
            title: "Edit Blog",
            description: "",
        };
        

        res.render('admin/edit-post', {
            data,
            locals,
            layout: adminLayout,
        })

    } catch (err) {
        console.log(err);
    }

});

/**
 * PUT /
 * Admin - Update old Blog
 */
router.put('/edit-post/:id', ensureAuthenticated, async (req, res) => {
    try {

        await Post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            body: req.body.body,
            updatedAt: Date.now()
        });

        res.redirect(`/edit-post/${req.params.id}`)
    } catch (err) {
        console.log(err);
    }

});

/**
 * DELETE /
 * Delete -> Blog
 */
router.delete('/delete-post/:id', ensureAuthenticated, async (req, res) => {
    try {
        await Post.deleteOne( { _id: req.params.id } );
        res.redirect('/dashboard');
    } catch (err) {
        console.log(err)
    }
});

/**
 * GET /
 * Admin -> LOGOUT
 */
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
});

module.exports = router;