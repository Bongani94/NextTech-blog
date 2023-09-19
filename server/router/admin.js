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
 * GET /
 * Login page
 */
router.get('/admin', async (req, res) => {
    try {
        const locals = {
            title: "Admin",
            description: ""
        }

        res.render('admin/login', {
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
            currentRoute: `/edit-post/${par}`
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
    res.redirect('/admin');
});

/**
 * GET /
 * Register page
 */
router.get('/register', async (req, res) => {
    try {
        const locals = {
            title: "Admin",
            description: ""
        }

        res.render('admin/register', {
            locals,
            adminLayout,
            currentRoute: '/admin'
        });
    } catch (err) {
        console.log(err)
    }
})

 /**
  * POST /
  * Register admin
  */
 router.post("/register", async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPass
        });

        const user = await newUser.save();
        res.status(200).json({ message: 'User Created', user});
    }
    catch (err) {
        res.status(500).json({ message: 'User already in use'});
    }
});


module.exports = router;