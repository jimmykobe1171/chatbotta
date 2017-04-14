import chai from 'chai';
import request from 'supertest';
import models, { User, Course, School } from '../../src/data/models';
import app from '../../src/app';
import { loadFixtures } from '../../src/data/utils';


const assert = chai.assert;

/*
 * get users list
 */
describe('GET /api/users/', () => {
  beforeEach((done) => {
    models.sync({ force: true })
    .then(() => {
      return loadFixtures();
    })
    .then(() => {
      done();
    })
    .catch(done);
  });

  it('should respond 401 unautherized without login', (done) => {
    request(app)
    .get('/api/users/')
    .expect('Content-Type', /json/)
    .expect(401, done);
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
        .get('/api/users/')
        .expect('Content-Type', /json/)
        .expect(200, done);
      }
    });
  });

});

/*
 * user login
 */
describe('GET /api/login/', () => {
  beforeEach((done) => {
    models.sync({ force: true })
    .then(() => {
      return loadFixtures();
    })
    .then(() => {
      done();
    })
    .catch(done);
  });

  it('should respond 401 unautherized with wrong email', (done) => {
    const agent = request.agent(app);
    agent
    .post('/api/login/')
    .send({ email: 'jimmy@wrong.com', password: 'jimmy123' })
    .expect(401, done);
  });

  it('should respond 401 unautherized with wrong password', (done) => {
    const agent = request.agent(app);
    agent
    .post('/api/login/')
    .send({ email: 'jimmy@test.com', password: 'jimmy' })
    .expect(401, done);
  });

  it('should respond 200 with correct email and password', (done) => {
    const agent = request.agent(app);
    agent
    .post('/api/login/')
    .send({ email: 'jimmy@test.com', password: 'jimmy123' })
    .expect('Content-Type', /json/)
    .expect(200, done);
  });

});

/*
 * user logout
 */
describe('GET /api/logout/', () => {
  beforeEach((done) => {
    models.sync({ force: true })
    .then(() => {
      return loadFixtures();
    })
    .then(() => {
      done();
    })
    .catch(done);
  });

  it('should respond 401 unautherized without login', (done) => {
    const agent = request.agent(app);
    agent
    .get('/api/logout/')
    .expect('Content-Type', /json/)
    .expect(401, done);
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
        // logout user
        agent
        .get('/api/logout/')
        .expect('Content-Type', /json/)
        .expect(200, done);
      }
    });
  });
});

/*
 * user register
 */
describe('POST /api/register/', () => {
  beforeEach((done) => {
    models.sync({ force: true })
    .then(() => {
      return loadFixtures();
    })
    .then(() => {
      done();
    })
    .catch(done);
  });

  it('should respond 400 with registered email', (done) => {
    const agent = request.agent(app);
    agent
    .post('/api/register/')
    .send(
      { 
        email: 'jimmy@test.com',
        password: 'jimmy123',
        school: 1,
        courses: [
          {
            id: 1,
            joinType: 'student'
          },
          {
            id: 2,
            joinType: 'ta'
          }
        ]
      }
    )
    .expect('Content-Type', /json/)
    .expect(400, done);
  });

  it('should respond 200 with new email', (done) => {
    const agent = request.agent(app);
    agent
    .post('/api/register/')
    .send(
      { 
        email: 'jimmy1@test.com',
        password: 'jimmy1123',
        school: 1,
        courses: [
          {
            id: 1,
            joinType: 'student'
          },
          {
            id: 2,
            joinType: 'ta'
          }
        ]
      }
    )
    .expect('Content-Type', /json/)
    .expect((res) => {
      assert.isNotNull(res.body.userId);
    })
    .expect(200, done);
  });
});
