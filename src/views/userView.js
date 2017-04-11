import express from 'express';
import passport from 'passport';
var router = express.Router();


// get users
router.get('/users/', function(req, res) {
    res.send('get users');
    // res.end();
    // res.status(400).json({error: 'invalid data'})

});

// get user
router.get('/user/:userId/', function(req, res) {
    res.send('get user: ' + req.params['userId']);
});

// user register
router.post('/register/', function(req, res) {
    var email = req.body['email'];
    var password = req.body['password'];
    var school = req.body['school'];
    var courses = req.body['courses'];
    if (email && password && school) {
        res.json({status: 'success'});
    }
    else {
        res.status(400).json({error: 'invalid data'})
    }
    res.send('get users');
});

// user login
router.post('/login/',
    passport.authenticate('local'),
    function(req, res) {
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.
        // res.redirect('/users/' + req.user.username);
        res.end();
    }
);

// user logout
router.get('/logout/', function(req, res) {
    req.logout();
    res.end();
});



export default router;
