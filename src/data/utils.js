import { User, Course, School } from './models';


function loadFixtures() {
  User.create({
    username: 'jimmy',
    email: 'jimmy@test.com',
    password: 'jimmy123',
  });
  Course.create({
    name: 'Machine Learning',
  });
  Course.create({
    name: 'Advance Software Engineering',
  });
  Course.create({
    name: 'Algorithms',
  });
  School.create({
    name: 'Columbia University',
  });
  School.create({
    name: 'NYU',
  });
  School.create({
    name: 'Harvard University',
  });
  School.create({
    name: 'MIT',
  });
  School.create({
    name: 'Princeton University',
  });
  School.create({
    name: 'Yale University',
  });
  School.create({
    name: 'Stanford University',
  });
}

export { loadFixtures };
