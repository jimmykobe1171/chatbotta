import chai from 'chai';
import request from 'supertest';
import models, { User } from '../../src/data/models';
import app from '../../src/app';


const assert = chai.assert;

describe('GET /api/users/', () => {
    beforeEach((done) => {
        models.sync({ force: true }).then(() => {
            User.create({
                    username: 'jimmy',
                    email: 'jimmy@test.com',
                    password: 'jimmy123',
                    type: 'student',
                })
                .then(() => {
                    done();
                })
                .catch(done);
        }).catch((error) => {
            done(error);
        });
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
            .end(function(err, res) {
                if (err || !res.ok) {
                    done(err);
                } else {
                    // get /api/users/
                    agent
                        .get('/api/users/')
                        .expect('Content-Type', /json/)
                        .expect(200, done);
                };
            });
    });

});
