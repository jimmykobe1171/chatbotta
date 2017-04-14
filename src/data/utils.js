import { User, Course, School } from './models';


function loadFixtures() {
  const courseNames = ['Machine Learning', 'Advance Software Engineering', 'Algorithms'];
  const schoolNames = [
  'Columbia University', 'NYU', 'Harvard University', 'MIT',
  'Princeton University', 'Yale University', 'Stanford University'
  ];
  // create user
  User.create({
    username: 'jimmy',
    email: 'jimmy@test.com',
    password: 'jimmy123',
  })
  .then((user) => {
    // create courses
    const allPromises = [];
    for (let i = 0; i < courseNames.length; i++) {
      allPromises.push(Course.create({name: courseNames[i]}));
    }
    return Promise.all(allPromises);
  })
  .then(() => {
    // create schools
    const allPromises = [];
    for (let i = 0; i < schoolNames.length; i++) {
      allPromises.push(School.create({name: schoolNames[i]}));
    }
    return Promise.all(allPromises);
  })
  .catch((err) => {
    console.log(err);
  });
}

export { loadFixtures };
