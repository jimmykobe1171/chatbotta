// import chai from 'chai';
import request from 'supertest';
import models from '../../src/data/models';
import app from '../../src/app';
import { loadFixtures } from '../../src/data/utils';


// const assert = chai.assert;

/*
 * get school list
 */
describe('GET /api/schools/', () => {
  beforeEach((done) => {
    models.sync({ force: true })
    .then(() => loadFixtures())
    .then(() => {
      done();
    })
    .catch(done);
  });

  it('should respond 200 even unautherized without login', (done) => {
    request(app)
    .get('/api/schools/')
    .expect('Content-Type', /json/)
    .expect(200, done);
  });

  it('should respond 200 with login', (done) => {
    const agent = request.agent(app);
    agent
    .post('/api/login/')
    .send({ email: 'jimmy@test.com', password: 'jimmy123' })
    .end((err, res) => {
      if (err || !res.ok) {
        done(err);
      } else {
        // get /api/users/
        agent
        .get('/api/schools/')
        .expect('Content-Type', /json/)
        .expect(200, done);
      }
    });
  });

});
