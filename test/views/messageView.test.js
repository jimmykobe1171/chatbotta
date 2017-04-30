import chai from 'chai';
import request from 'supertest';
import models from '../../src/data/models';
import app from '../../src/app';
import { loadFixtures } from '../../src/data/utils';


const assert = chai.assert;

/*
 * post a message
 */
describe('POST /api/messages/', () => {
  beforeEach((done) => {
    models.sync({ force: true })
    .then(() => loadFixtures())
    .then(() => {
      done();
    })
    .catch(done);
  });

  it('should respond 401 unautherized without login', (done) => {
    request(app)
    .post('/api/messages/')
    .send({ courseId: 1, content: 'test message' })
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
        // post a message
        agent
        .post('/api/messages/')
        .send({ courseId: 1, content: 'Hello!' })
        .expect('Content-Type', /json/)
        .expect(200, done);
      }
    });
  });
});


/*
 * get messages
 */
describe('GET /api/messages/', () => {
  beforeEach((done) => {
    models.sync({ force: true })
    .then(() => loadFixtures())
    .then(() => {
      done();
    })
    .catch(done);
  });

  it('should respond 401 unautherized without login', (done) => {
    request(app)
    .get('/api/messages/')
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
        // get a messages
        agent
        .post('/api/messages/')
        .send({ courseId: 1, content: 'Hello!' })
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err || !res.ok) {
            done(err);
          } else {
            // get messages after one sec
            setTimeout(() => {
              console.log('Wait a sec.');
              agent
                .get('/api/messages/?courseId=1')
                .expect('Content-Type', /json/)
                .expect((res) => {
                  // console.log(res.body);
                  // console.log(res.body.length);
                  assert(res.body.length === 2);
                  assert(res.body[0].studentId === 1);
                  assert(res.body[1].senderType === 'chatbot');
                })
                .expect(200, done);
            }, 1500);
          }
        });
      }
    });
  });
});

