import chai from 'chai';
import models, { User, Course } from '../../../src/data/models';

const assert = chai.assert;


describe('Course Model', () => {
  beforeEach((done) => {
    models.sync({ force: true }).then(() => {
      done();
    }).catch((error) => {
      done(error);
    });
  });

  it('should create Course correctly', (done) => {
    Course.create({
      name: 'course 1',
      description: 'course 1',
    }).then(() => {
      Course.findOne({ where: { name: 'course 1' } }).then(() => {
        done();
      }).catch(done);
    }).catch(done);
  });

  it('should add User to Course correctly', (done) => {
    User.create({
      username: 'jimmy',
      email: 'jimmy@test.com',
      password: 'jimmy123',
      type: 'student',
    }).then((user) => {
      Course.create({
        name: 'course 1',
        description: 'course 1',
      }).then((course) => {
        course.hasUser(user).then((result) => {
          assert.equal(result, false);
          course.addUser(user).then(() => {
            course.hasUser(user).then((result1) => {
              assert.equal(result1, true);
              done();
            }).catch(done);
          }).catch(done);
        }).catch(done);
      }).catch(done);
    }).catch(done); // are you kidding me??? so called promise?
  });

  it('should add Course to User correctly', (done) => {
    User.create({
      username: 'jimmy',
      email: 'jimmy@test.com',
      password: 'jimmy123',
      type: 'student',
    }).then((user) => {
      Course.create({
        name: 'course 1',
        description: 'course 1',
      }).then((course) => {
        user.hasCourse(course).then((result) => {
          assert.equal(result, false);
          user.addCourse(course).then(() => {
            user.hasCourse(course).then((result1) => {
              assert.equal(result1, true);
              done();
            }).catch(done);
          }).catch(done);
        }).catch(done);
      }).catch(done);
    }).catch(done); // are you kidding me??? so called promise?
  });

});
