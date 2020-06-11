const Buffer = require('safe-buffer').Buffer;
const Keygrip = require('keygrip');
const keys = require('../../config/keys');
const keygrip = new Keygrip([keys.cookieKey]);

module.exports = (user) => {
    const sessionObject = {
        passport: {
            user: user._id.toString()
        }
    };
    // we gotta emulate the session and the signature that are generated when we sign in
    // we use Buffer in combination with Keygrip to accomplish that, and simulate a successful
    // login, using an existing user id

    // generates session string
    const session = Buffer.from(JSON.stringify(sessionObject)).toString('base64');
    // generate signature with dev's environment key
    const sig = keygrip.sign('session=' + session);

    return { session, sig };
};