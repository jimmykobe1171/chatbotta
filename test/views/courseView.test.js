// import chai from 'chai';
import request from 'supertest';
import models from '../../src/data/models';
import app from '../../src/app';
import { loadFixtures } from '../../src/data/utils';


// const assert = chai.assert;

/*
 * get courses
 */
describe('GET /api/courses/', () => {
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
    .get('/api/courses/')
    .expect('Content-Type', /json/)
    .expect(200, done);
  });
});

/*
 * get a course
 */
// describe('GET /api/course/:courseId/', () => {
//   beforeEach((done) => {
//     models.sync({ force: true })
//     .then(() => {
//       return loadFixtures();
//     })
//     .then(() => {
//       done();
//     })
//     .catch(done);
//   });

//   it('should respond 200 even unautherized without login', (done) => {
//     request(app)
//     .get('/api/course/?courseId=1')
//     .expect('Content-Type', /json/)
//     .expect(200, done);
//   });
// });
