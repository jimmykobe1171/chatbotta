import chai from 'chai';
import models, { User } from '../../../src/data/models';

const assert = chai.assert;


describe('User Model', () => {
  beforeEach((done) => {
    models.sync({ force: true }).then(() => {
      done();
    }).catch((error) => {
      done(error);
    });
  });

  it('should create User correctly', (done) => {
    User.create({
      username: 'jimmy',
      email: 'jimmy@test.com',
      password: 'jimmy123',
    }).then(() => {
      User.findOne({ where: { email: 'jimmy@test.com' } }).then((user) => {
        assert.equal(user.get('username'), 'jimmy');
        assert.equal(user.get('email'), 'jimmy@test.com');
        done();
      }).catch(done);
    }).catch(done);

  });

  it('should authenticate User correctly with correct password', (done) => {
    User.create({
      username: 'jimmy',
      email: 'jimmy@test.com',
      password: 'jimmy123',
    }).then(() => {
      User.findOne({ where: { email: 'jimmy@test.com' } }).then((user) => {
        const isAuthenticated = user.authenticate('jimmy123');
        assert.equal(isAuthenticated, true);
        done();
      }).catch(done);
    }).catch(done);

  });
});
