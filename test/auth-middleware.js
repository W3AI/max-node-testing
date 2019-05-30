const expect = require('chai').expect;
const jwt = require('jsonwebtoken');
const sinon = require('sinon');

const authMiddleware = require('../middleware/is-auth');

describe('Auth middleware', function () {
    // Unit test for 1 function
    it('should throw an error if no authorization header is present', function () {
        // define Unit test context/scenario
        const req = {
            get: function () {
                return null;
            }
        };
        // passing the call through mocha and chai
        expect(authMiddleware.bind(this, req, {}, () => { })).to.throw('Not authenticated.');
    });

    // Another test
    it('should throw an error if the authorization header is only one string', function () {
        // define Unit test context/scenario
        const req = {
            get: function () {
                return 'xyz';
            }
        };
        expect(authMiddleware.bind(this, req, {}, () => { })).to.throw();
    });

    it('should yield an userId after decoding the token', function () {
        // define Unit test context/scenario
        const req = {
            get: function () {
                return 'Bearer xyeknvenrvinreatnvz';
            }
        };
        // added sinon to preserve the initial value for jwt.verify / userId
        sinon.stub(jwt, 'verify');
        // this line below is made available by sinon
        jwt.verify.returns({ userId: 'fairAI' });
        authMiddleware(req, {}, () => { });
        expect(req).to.have.property('userId');
        expect(req).to.have.property('userId', 'fairAI');
        expect(jwt.verify.called).to.be.true;
        // possible with sinon
        jwt.verify.restore();
    });

    it('should throw an error if the token cannot be verified', function () {
        // define Unit test context/scenario
        const req = {
            get: function () {
                return 'Bearer xyz';
            }
        };
        expect(authMiddleware.bind(this, req, {}, () => { })).to.throw();
    });
})

