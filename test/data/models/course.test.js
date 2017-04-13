import chai from 'chai';
import models, { User, Course } from '../../../src/data/models';

const assert = chai.assert;


describe('Course Model', () => {
  beforeEach((done) => {
    models.sync({ force: true })
    .then(() => {
      done();
    })
    .catch(done);
  });

  it('should create Course correctly', (done) => {
    Course.create({
      name: 'course 1',
      description: 'course 1',
    })
    .then(() => Course.findOne({ where: { name: 'course 1' } }))
    .then(() => {
      done();
    })
    .catch(done);
  });

  it('should add User to Course correctly', (done) => {
    const dic = {};
    User.create({
      username: 'jimmy',
      email: 'jimmy@test.com',
      password: 'jimmy123',
    })
    .then((user) => {
      dic.user = user;
      return Course.create({
        name: 'course 1',
        description: 'course 1',
      });
    })
    .then((course) => {
      dic.course = course;
      const user = dic.user;
      return course.hasUser(user);
    })
    .then((result) => {
      const course = dic.course;
      const user = dic.user;
      assert.equal(result, false);
      return course.addUser(user, { joinType: 'student' });
    })
    .then(() => {
      const course = dic.course;
      const user = dic.user;
      return course.hasUser(user);
    })
    .then((result) => {
      assert.equal(result, true);
      done();
    })
    .catch((error) => {
      done(error);
    });
  });

  it('should add Course to User correctly', (done) => {
    const dic = {};
    User.create({
      username: 'jimmy',
      email: 'jimmy@test.com',
      password: 'jimmy123',
    })
    .then((user) => {
      dic.user = user;
      return Course.create({
        name: 'course 1',
        description: 'course 1',
      });
    })
    .then((course) => {
      dic.course = course;
      const user = dic.user;
      return user.hasCourse(course);
    })
    .then((result) => {
      const course = dic.course;
      const user = dic.user;
      assert.equal(result, false);
      return user.addCourse(course, { joinType: 'student' });
    })
    .then(() => {
      const course = dic.course;
      const user = dic.user;
      return user.hasCourse(course);
    })
    .then((result) => {
      assert.equal(result, true);
      done();
    })
    .catch(done);
  });

});
