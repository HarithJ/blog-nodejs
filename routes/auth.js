const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const { User } = require('../models/index.js');

const router = express.Router();

// number of iterations of the hashing algorithm that are performed for each password,
// recommended: 12
const saltRounds = 12;

/* function to check if the password is correct */
async function checkPassword(inputPassword, actualPassword) {
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

/* Middleware that gets executed when a user signs in */
passport.use(new LocalStrategy(
  async (username, password, cb) => {
    // check if the user exists with the given username
    const user = await User.findOne({
      raw: true,
      where: {
        username: username
      }
    });

    // if user does not exists in db
    if (!user) {
      return cb(null, false);
    }

    // if user exists, check if the password is correct
    const isAuthenticated = await checkPassword(password, user.password)

    // if user is authenticated, then return the callback function with the user
    if (isAuthenticated) {
      return cb(null, user);
    }
    // else return false instead of a user
    else {
      return cb(null, false);
    }

  })
);

/* Route to login page */
router.get('/login', function(req, res, next) {
  // render login template
  res.render('login');
});

/* Handle login form submission */
router.post('/login',
  // call passport's local authentication strategy
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/auth/login'})
);

/* Route to logout page */
router.get('/logout', function(req, res, next) {
  // logout the user using passport's functionality
  req.logout();

  // redirect the user to index page
  res.redirect('/');
});

/* Route to register page */
router.get('/register', function(req, res, next) {
  // render sign in template
  res.render('register');
});

/* Handle user registerion */
router.post('/register', async (req, res, next) => {
  // hash user's password
  const passwordHash = await bcrypt.hash(req.body.password, saltRounds);

  // save the user in the db
  User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    username: req.body.username,
    password: passwordHash
  });

  // redirect user to the login page
  res.redirect('/auth/login');
});

module.exports = router;
