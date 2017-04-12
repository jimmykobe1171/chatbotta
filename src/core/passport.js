/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/**
 * Passport.js reference implementation.
 * The database schema used in this sample is available at
 * https://github.com/membership/membership.db/tree/master/postgres
 */

import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { User } from '../data/models';
// import { auth as config } from '../config';


passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
},
    (email, password, done) => {
      User.findOne({ where: { email } }).then((user) => {
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        if (!user.authenticate(password)) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      }).catch(err => done(err));
    },
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  }).catch((err) => {
    done(err, null);
  });
});


export default passport;
