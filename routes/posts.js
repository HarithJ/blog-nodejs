var express = require('express');
const Entities = require('html-entities').AllHtmlEntities;

const { authOnly } = require('../helpers/auth.js');
const { userAuth } = require('../helpers/auth.js');

var router = express.Router();
const entities = new Entities();

var { blog } = require('../models/index.js');

/* GET all blog posts */
router.get('/', async function(req, res, next) {
  try {
    // fetch all blog posts from the db
    const posts = await blog.findAll({ raw: true });

    // render template to display all blog posts
    return res.render('posts', { posts });
  }
  catch (error) {
    res.status(500).send(error);
  }
});

/* Display the page to write blog content to */
router.get('/write', authOnly, (req, res, next) => {
  return res.render('write-or-edit-post', {pathname: 'write'});
});

/* Route to save the blog post to DB */
router.post('/write', authOnly, async (req, res, next) => {
  try {
    // save the blog post to db
    const post = await blog.create({
      title: req.body.title,
      body: req.body.blogPost,
      description: req.body.description,
    });

    // link the blog post with the logged in user
    await req.user.addPosts(post);

    // redirect the user to the route that displays their posts
    res.send({redirect: '/me/posts'});
  }
  catch (error) {
    res.status(500).send(error);
  }
});

/* GET one blog post */
router.get('/posts/:blogTitle', async function(req, res, next) {
  try {
    // fetch one blog posts from the db according to the title
    const post = await blog.findOne({
      where: { title: req.params.blogTitle },
      raw: true
    });

    // if post is not found, throw an error
    if (!post) {
      error = new Error('Post not found');
      error.status = 404;
      return next(error);
    }

    // if post is found, render the template to display the post
    return res.render('post', { post });
  }
  catch (error) {
    res.status(500).send(error);
  }
});

/* GET blog post for editing */
router.get('/posts/:blogTitle/edit', async function(req, res, next) {
  try {
    // get post of the currently logged in user matching the blogTitle
    // he wants to edit. getPosts returns an array of posts.
    let post = await req.user.getPosts({
      where: { title: req.params.blogTitle },
      raw: true
    });

    // if the array is empty
    if (!post.length) {
      error = new Error('Post not found');
      error.status = 404;
      return next(error);
    }

    // remove the post from the array into an object
    post = post[0];

    // render the template to edit the post passing in the post to edit
    // and the pathname
    return res.render('write-or-edit-post', { post: post, pathname: "edit" });
  }
  catch (error) {
    res.status(500).send(error);
  }
});

/* Save edited blog post */
router.put('/posts/:blogPrevTitle/edit', async (req, res, next) => {
  try {
    // update post in the db with the new changes
    const post = await blog.update(
      {
        title: req.body.newTitle,
        body: req.body.blogPost,
        description: req.body.description,
      },
      {
        where: { title: req.params.blogPrevTitle }
      }
    );

    // redirect the user to the route that displays their posts
    return res.send({redirect: '/me/posts'});
  }
  catch (error) {
    res.status(500).send(error);
  }
});

/* GET blogposts of the current user */
router.get('/me/posts', authOnly, async (req, res, next) => {
  try {
    // get all the posts of the currently logged in user
    const posts = await req.user.getPosts();

    // render the template that displays the posts
    return res.render('user-posts', { posts });
  }
  catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
