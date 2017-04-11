import chai from 'chai';
import models, { Lecture, LectureMaterial } from '../../../src/data/models';

const assert = chai.assert;


describe('LectureMaterial Model', () => {
  beforeEach((done) => {
    models.sync({ force: true }).then(() => {
      done();
    }).catch((error) => {
      done(error);
    });
  });

  it('should create LectureMaterial correctly', (done) => {
    LectureMaterial.create({
      name: 'LectureMaterial 1',
      description: 'good LectureMaterial',
    }).then(() => {
      LectureMaterial.findOne({ where: { name: 'LectureMaterial 1' } }).then(() => {
        done();
      }).catch(done);
    }).catch(done);
  });

  it('should add LectureMaterial to Lecture correctly', (done) => {
    LectureMaterial.create({
      name: 'LectureMaterial 1',
      description: 'LectureMaterial 1',
    }).then((lectureMaterial) => {
      Lecture.create({
        name: 'lecture 1',
        description: 'lecture 1',
      }).then((lecture) => {
        lecture.hasLectureMaterial(lectureMaterial).then((result) => {
          assert.equal(result, false);
          lecture.addLectureMaterial(lectureMaterial).then(() => {
            lecture.hasLectureMaterial(lectureMaterial).then((result1) => {
              assert.equal(result1, true);
              done();
            }).catch(done);
          }).catch(done);
        }).catch(done);
      }).catch(done);
    }).catch(done); // are you kidding me??? so called promise?
  });
});
