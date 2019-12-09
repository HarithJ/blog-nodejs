var express = require('express');
var router = express.Router();

const Entities = require('html-entities').AllHtmlEntities;

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
router.get('/write', (req, res, next) => {
  return res.render('write-blog', {pathname: 'write'});
});

router.post('/write', async (req, res, next) => {
  await blog.create({
    title: req.body.title,
    body: req.body.blogPost,
    description: req.body.description,
  });

  res.send({redirect: '/'});
})

module.exports = router;
