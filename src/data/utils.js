import { User, Course, School } from './models';


function loadFixtures() {
  /*-------------------- data --------------------*/
  /*----------------------------------------------*/
  const courseNames = ['Machine Learning', 'Advance Software Engineering', 'Algorithms', 'Natural Language Processing', 'Deep Learning'];
  const schoolNames = [
  'Columbia University', 'NYU', 'Harvard University', 'MIT',
  'Princeton University', 'Yale University', 'Stanford University'
  ];
  const usersData = [
    {
      username: 'jimmy',
      email: 'jimmy@test.com',
      password: 'jimmy123', 
    },
    {
      username: 'ethan',
      email: 'ethan@test.com',
      password: 'ethan123', 
    },
    {
      username: 'tom',
      email: 'tom@test.com',
      password: 'tom123', 
    },
    {
      username: 'rose',
      email: 'rose@test.com',
      password: 'rose123', 
    },
    {
      username: 'jack',
      email: 'jack@test.com',
      password: 'jack123', 
    },
  ];
  /*-------------------- data end ----------------*/
  /*----------------------------------------------*/

  let users = [];
  let courses = [];
  let schools = [];

  // create user
  const newUsersPromises = [];
  for (let i = 0; i < usersData.length; i++) {
    newUsersPromises.push(User.create(usersData[i]));
  }
  Promise.all(newUsersPromises)
  .then((newUsers) => {
    users = newUsers;
    // create courses
    const allPromises = [];
    for (let i = 0; i < courseNames.length; i++) {
      allPromises.push(Course.create({name: courseNames[i]}));
    }
    return Promise.all(allPromises);
  })
  .then((newCourses) => {
    courses = newCourses;
    // create schools
    const allPromises = [];
    for (let i = 0; i < schoolNames.length; i++) {
      allPromises.push(School.create({name: schoolNames[i]}));
    }
    return Promise.all(allPromises);
  })
  .then((newSchools) => {
    schools = newSchools;
    // link course with school
    const columbia = schools[0];
    return columbia.addCourses(courses);
  }).
  then(() => {
    // link user with school
    const columbia = schools[0];
    return columbia.addUsers(users);
  })
  .then(() => {
    // link user with courses
    const jimmy = users[0];
    const allPromises = [];
    for (let i = 0; i < 2; i++) {
        let joinType = i==0? 'student': 'ta';
        allPromises.push(jimmy.addCourse(courses[i].id, {joinType: joinType}));
    }
    return Promise.all(allPromises);
  })
  .catch((err) => {
    console.log(err);
  });
}

export { loadFixtures };
