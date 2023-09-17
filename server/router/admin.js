const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminLayout = '../views/layouts/admin';
const jwtSecret = process.env.JWT_SECRET

/**
 * Check Login
 */
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json( { message: 'Unauthorized'} );
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        return res.status(401).json( { message: 'Unauthorized'} );
    }
}


/**
 * Login page
 */
router.get('/admin', async (req, res) => {
    try {
        const locals = {
            title: "Admin",
            description: ""
        }

        res.render('admin/home', {
            locals,
            adminLayout,
            currentRoute: '/admin'
        });
    } catch (err) {
        console.log(err)
    }
})

/**
 * Login page
 */
router.post('/admin', async (req, res) => {
    try {

        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if(!user) {
            return res.status(401).json( { message: 'Invalid credentials' } );
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid) {
            return res.status(401).json( { message: 'Invalid credentials' } );    
        }
        const token = jwt.sign({ userId: user._id}, jwtSecret);
        res.cookie('token', token, { httpOnly: true });

        res.redirect('/dashboard')

    } catch (err) {
        console.log(err)
    }
});

/**
 * Get /
 * Admin dashboard
 */
router.get('/dashboard', authMiddleware, async (req, res) => {
    try {
        const locals = {
            title: 'Dashboard',
            description: ""
        }

        const data = await Post.find();
        res.render('admin/dashboard', {
            locals,
            data,
            layout: adminLayout,
            currentRoute: '/dashboard'
        })  
    } catch (err) {
        console.log(err);
    }

});

/**
 * GET /
 * Admin - Create New Post
 */
router.get('/add-post', authMiddleware, async (req, res) => {
    try {
        const locals = {
            title: 'Add Post',
            description: ""
        }

        const data = await Post.find();
        res.render('admin/add-post', {
            locals,
            layout: adminLayout,
            currentRoute: '/add-post'
        })  
    } catch (err) {
        console.log(err);
    }

});

/**
 * Post /
 * Admin - Create New Post
 */
router.post('/add-post', authMiddleware, async (req, res) => {
    try {
        console.log(req.body)
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
router.get('/edit-post/:id', authMiddleware, async (req, res) => {
    try {
        const locals = {
            title: "Edit Blog",
            description: "",
            currentRoute: '/post'
        };
        const data = await Post.findOne({ _id: req.params.id });

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
router.put('/edit-post/:id', authMiddleware, async (req, res) => {
    try {

        await Post.findByIdAndUpdate(req.params.dictionary, {
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
router.delete('/delete-post/:id', authMiddleware, async (req, res) => {
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
    res.clearCookie('token');
    res.json({ message: 'Logout Successful'});
    res.redirect('/');
});

 /**
  * POST /
  * Register admin
  */

router.post('/register', async (req, res) => {
    try {

        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            const user = await User.create({ username, password:hashedPassword })
            res.status(201).json({ message: 'User Created', user})

        } catch (err) {
            if(err.code === 11000) {
                res.status(409).json({ message: 'User already in use'})
            }
            res.status(500).json({ message: 'Internal server error'})
        }
        
    } catch (err) {
        console.log(err)
    }
});

module.exports = router;