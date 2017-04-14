import express from 'express';
import passport from 'passport';
import { isAuthenticated } from '../core/middleware';
import { User, School, Course } from '../data/models';


const router = express.Router();

function getUserLoginData(user) {
    const data = {
        userId: user.id,
        email: user.email,
        username: user.username,
        courses: []
    };
    return School.findById(user.SchoolId)
    // User.findById(user.id)
    // .then((user) => {
    //     console.log(user.getSchool);
    //     console.log(user.getCourses);

    //     return user.getSchool();
    // })
    .then((school) => {
        data.schoolId = school.id;
        data.schoolName = school.name;
        return user.getCourses();
    })
    .then((courses) => {
        for (let i=0; i<courses.length; i++) {
            const course = courses[i];
            const courseData = {
                id: course.id,
                name: course.name,
                joinType: course.UserCourse.joinType
            }
            data.courses.push(courseData);
        }
        return data;
    });
}

    // return User.findById(user.id, {
    //     attributes: ['id', 'email', 'username', 'SchoolId'],
    //     include: [{
    //         model: Course,
    //         // as: 'courses',
    //         attributes: ['id', 'name', 'description'],
    //         through: {
    //             attributes: ['joinType']
    //         }
    //     }]
    // })
    // .then((foundUser) => {
    //     // console.log(foundUser);
    //     const data = {
    //         userId: foundUser.id,
    //         email: foundUser.email,
    //         username: foundUser.username,
    //         school: foundUser.SchoolId,
    //         courses: []
    //     }
    //     for (let i=0; i<foundUser.Courses.length; i++) {
    //         const course = foundUser.Courses[i];
    //         const courseData = {
    //             id: course.id,
    //             name: course.name,
    //             joinType: course.UserCourse.joinType
    //         }
    //         data.courses.push(courseData);
    //     }
    //     return data;
    // });

/*
 * get users list
 */
router.get('/users/', isAuthenticated, (req, res) => {
    User.findAll({
            attributes: ['id', 'email', 'username', 'SchoolId'],
            include: [{
                model: Course,
                attributes: ['id', 'name', 'description'],
                through: {
                    attributes: ['joinType']
                }
            }]
        })
        .then((users) => {
            res.json(users);
        })
        .catch((err) => {
            res.status(400).json({ error: 'get users failed' });
        });
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
    const schoolId = req.body.school; // school id
    const courses = req.body.courses; // list of course id
    const courseIds = courses.map(x => x.id);
    const joinTypes = courses.map(x => ({ joinType: x.joinType }));
    if (email && password && schoolId) {
        // create user
        const dic = {};
        User.create({
                username: email,
                email,
                password,
            })
            .then((user) => {
                dic.user = user;
                return School.findById(schoolId);
            })
            .then((school) => {
                // set school to user
                const user = dic.user;
                return school.addUser(user);
            })
            .then(() => {
                // set courses to user
                const user = dic.user;
                const allPromises = [];
                for (let i = 0; i < courses.length; i++) {
                    allPromises.push(user.addCourse(courseIds[i], joinTypes[i]));
                }
                return Promise.all(allPromises);
            })
            .then(() => {
                const user = dic.user;
                // login new registered user
                req.logIn(user, function(err) {
                    if (err) {
                        res.status(400).json({ error: 'login user failed' });
                    } else {
                        res.json({ userId: user.id });
                    }
                });
            })
            .catch((err) => {
                res.status(400).json({ error: 'create user failed' });
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
        const user = req.user;
        getUserLoginData(user)
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({error: 'login success but get user data failed'});
        })
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
