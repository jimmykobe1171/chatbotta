import express from 'express';
import passport from 'passport';
import { isAuthenticated } from '../core/middleware';
import { User } from '../data/models';


const router = express.Router();


/*
 * get users list
 */
router.get('/users/', isAuthenticated, (req, res) => {
  res.json([{ id: 1, email: 'jimmy@test.com' }]);
    // res.end();
    // res.status(400).json({error: 'invalid data'})
});

/*
 * get user
 */
router.get('/user/:userId/', isAuthenticated, (req, res) => {
  res.send(`get user: ${req.params.userId}`);
});

/*
 * user registration
 */
router.post('/register/', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const school = req.body.school; // school id
  const courses = req.body.courses; // list of course id
  // console.log(email);
  // console.log(password);
  // console.log(school);
  // console.log(courses);
  if (email && password && school) {
    // create user
    User.create({
      username: email,
      email,
      password,
    })
    .then((user) => {
      user.setSchool(school)
        .then(() => {
          res.json({ userId: user.id });
        })
        .catch((err) => {
          res.status(400).json({ error: err.message });
        });
    })
    .catch((err) => {
      res.status(400).json({ error: err.message });
    });
  } else {
    res.status(400).json({ error: 'invalid data' });
  }
});

/*
 * user login
 */
router.post('/login/',
    passport.authenticate('local'),
    (req, res) => {
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.
        // res.redirect('/users/' + req.user.username);
      res.json({});
    },
);

/*
 * user logout
 */
router.get('/logout/', isAuthenticated, (req, res) => {
  req.logout();
  res.json({});
});


export default router;
