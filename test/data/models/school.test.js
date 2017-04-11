import chai from 'chai';
import models, { User, School } from '../../../src/data/models';

const assert = chai.assert;


describe('School Model', () => {
  beforeEach((done) => {
    models.sync({ force: true }).then(() => {
      done();
    }).catch((error) => {
      done(error);
    });
  });

  it('should create School correctly', (done) => {
    School.create({
      name: 'columbia',
    }).then(() => {
      School.findOne({ where: { name: 'columbia' } }).then(() => {
        done();
      }).catch(done);
    }).catch(done);
  });

  it('should add User to school correctly', (done) => {
    User.create({
      username: 'jimmy',
      email: 'jimmy@test.com',
      password: 'jimmy123',
      type: 'student',
    }).then((user) => {
      School.create({
        name: 'columbia',
      }).then((school) => {
        school.hasUser(user).then((result) => {
          assert.equal(result, false);
          school.addUser(user).then(() => {
            school.hasUser(user).then((result1) => {
              assert.equal(result1, true);
              done();
            }).catch(done);
          }).catch(done);
        }).catch(done);
      }).catch(done);
    }).catch(done); // are you kidding me??? so called promise?
  });
});
