var express = require('express');
const Entities = require('html-entities').AllHtmlEntities;

const authOnly = require('../helpers/auth.js');

var router = express.Router();
const entities = new Entities();

var { blog } = require('../models/index.js');

/* GET all blog posts */
router.get('/', async function(req, res, next) {
  try {
    const posts = await blog.findAll({ raw: true });

    return res.render('posts', { posts });
  }
  catch (error) {
    res.status(500).send(error);
  }
});

/* Display the page to write blog content to */
router.get('/write', authOnly, (req, res, next) => {
  return res.render('write-blog', {pathname: 'write'});
});

router.post('/write', async (req, res, next) => {
  try {
    const post = await blog.create({
      title: req.body.title,
      body: req.body.blogPost,
      description: req.body.description,
    });

    await req.user.addPosts(post);

    res.send({redirect: '/'});
  }
  catch (error) {
    res.status(500).send(error);
  }
})

/* GET one blog post */
router.get('/post/:blogTitle', async function(req, res, next) {
  try {
    const post = await blog.findOne({
      where: { title: req.params.blogTitle },
      raw: true
    });

    if (!post) {
      error = new Error('Post not found');
      error.status = 404;
      return next(error);
    }

    return res.render('post', { post });
  }
  catch (error) {
    res.status(500).send(error);
  }
});

/* GET blogposts of the current user */
router.get('/myposts', authOnly, async (req, res, next) => {
  try {
    const posts = await req.user.getPosts();

    return res.render('posts', { posts });
  }
  catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
