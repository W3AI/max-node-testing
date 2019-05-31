const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const AuthController = require('../controllers/auth');

describe('Auth Controller', function () {
    before(function (done) {
        mongoose.connect(
            'mongodb+srv://steve_ai91:o82HN0KCxu6dtS5w@cluster0-n7ze3.mongodb.net/test-messages?retryWrites=true',
            { useNewUrlParser: true }
        ).then(result => {
            const user = new User({
                email: 'test@test.com',
                password: 'tester',
                name: 'Test',
                posts: [],
                _id: '5c0f66b979af55031b34728a'
            });
            return user.save();
        })
            .then(() => {
                done();
            })
    });

    // to add done in function of it() for async/promisses 
    it('should throw an error with code 500 if accessing the database fails', function (done) {
        sinon.stub(User, 'findOne');
        User.findOne.throws();

        const req = {
            body: {
                email: 'test@test.com',
                password: 'tester'
            }
        };

        AuthController.login(req, {}, () => { }).then(result => {
            expect(result).to.be.an('error');
            expect(result).to.have.property('statusCode', 500);
            // wait for the function to execute by calling done() from above / provided by mocha
            done();
        });

        User.findOne.restore();
    });

    it('should send a response with a valid user status for an existing user', function (done) {
        // connect to a test database (test-messages), retrive a user and respond with user.status + 200
        const req = { userId: '5c0f66b979af55031b34728a' };
        const res = {
            statusCode: 500,
            userStatus: null,
            status: function (code) {
                this.statusCode = code;
                return this;
            },
            json: function (data) {
                this.userStatus = data.status
            }
        };
        AuthController.getUserStatus(req, res, () => { })
            .then(() => {
                expect(res.statusCode).to.be.equal(200);
                expect(res.userStatus).to.be.equal('I am new!');
                done();
            });
    });

    after(function(done) {
        // Delete all users from the test database - use an empty obj {}
        User.deleteMany({})
            .then(() => {
                return mongoose.disconnect();
            })
            .then(() => {
                done();
            });
    });
});

