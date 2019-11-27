var express = require('express');
var router = express.Router();

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
router.get('/write', function(req, res, next) {
  return res.render('write-blog');
});

module.exports = router;
