const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const Post = require('../models/post');
const FeedController = require('../controllers/feed');

// Testing with a test-projects database instead of posts or test-messages
describe('Feed Controller', function () {
    before(function(done) {
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

    beforeEach(function () {
        // to set/reset things before each test
        // eg: >>> setup new contexts according to the results of Cogito's input queries !!!
    });

    afterEach(function () {
        // to cleanup, etc after each test
        // eg: >>> to mark test / functionality Done and commit to repo and notify successors !!!
    });

    // to add done in function of it() for async/promisses 
    it('should add a created post to the posts of the creator', function(done) {

        const req = {
            body: {
                title: 'Test Project',
                content: 'A Test Project/Post'
            },
            file: {
                path: 'abc'
            },
            userId: '5c0f66b979af55031b34728a'
        };
        const res = { status: function() {
            return this;
        }, json: function() {} };

        FeedController.createPost(req, res, () => {}).then((savedUser) => {
            expect(savedUser).to.have.property('posts');
            expect(savedUser.posts).to.have.length(1);
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

