import chai from 'chai';
import models, { Lecture, Course } from '../../../src/data/models';

const assert = chai.assert;


describe('Lecture Model', () => {
  beforeEach((done) => {
    models.sync({ force: true }).then(() => {
      done();
    }).catch((error) => {
      done(error);
    });
  });

  it('should create Lecture correctly', (done) => {
    Lecture.create({
      name: 'lecture 1',
      description: 'good lecture',
    }).then(() => {
      Lecture.findOne({ where: { name: 'lecture 1' } }).then(() => {
        done();
      }).catch(done);
    }).catch(done);
  });

  it('should add lecture to course correctly', (done) => {
    Lecture.create({
      name: 'lecture 1',
      description: 'lecture 1',
    }).then((lecture) => {
      Course.create({
        name: 'course 1',
        description: 'course 1',
      }).then((course) => {
        course.hasLecture(lecture).then((result) => {
          assert.equal(result, false);
          course.addLecture(lecture).then(() => {
            course.hasLecture(lecture).then((result1) => {
              assert.equal(result1, true);
              done();
            }).catch(done);
          }).catch(done);
        }).catch(done);
      }).catch(done);
    }).catch(done); // are you kidding me??? so called promise?
  });
});
