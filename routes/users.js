const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const { User } = require('../models/index.js');
const authOnly = require('../helpers/auth.js');

const router = express.Router();

// number of iterations of the hashing algorithm that are performed for each password,
// recommended: 12
const saltRounds = 12;

async function checkPassword(actualPassword, inputPassword) {
  const match = await bcrypt.compare(inputPassword, actualPassword);
  if(match) {
    return true;
  }

  return false;
}

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser(async (id, cb) => {
  try {
    const user = await User.findByPk(id);
    cb(null, user);
  }
  catch(err) {
    return cb(err);
  }
});

passport.use(new LocalStrategy(
  async (username, password, cb) => {
    const user = await User.findOne({
      raw: true,
      where: {
        username: username
      }
    })

    // if user does not exists in db
    if (!user) {
      return cb(null, false);
    }

    // if user exists, check if the password is correct
    const isAuthenticated = await checkPassword(user.password, password)

    if (isAuthenticated) {
      return cb(null, user);
    }
    else {
      return cb(null, false);
    }

  })
);

/* Route to login page */
router.get('/login', function(req, res, next) {
  res.render('login');
});

/* Handle login form submission */
router.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/users/login'})
);

/* Route to logout page */
router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});

/* Route to register page */
router.get('/register', function(req, res, next) {
  res.render('register');
});

/* Handle user registerion */
router.post('/register', async (req, res, next) => {
  const passwordHash = await bcrypt.hash(req.body.password, saltRounds);

  console.log(req.body.firstName);

  User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    username: req.body.username,
    password: passwordHash
  });

  res.redirect('/users/login');
});

router.get('/hello', authOnly, (req, res, next) => {
  res.send(req.user);
});

module.exports = router;
