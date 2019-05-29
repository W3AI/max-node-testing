const expect = require('chai').expect;

const authMiddleware = require('../middleware/is-auth');

// Unit test for 1 function
it('should throw an error if no authorization header is present', function() {
    // define Unit test context/scenario
    const req = {
        get: function() {
            return null;
        }
    };
    // passing the call through mocha and chai
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw('Not authenticated.');
})