const puppeteer = require('puppeteer');

let browser, page;

beforeEach(async () => {
    browser = await puppeteer.launch({
        headless: false
    });
    page = await browser.newPage();
    await page.goto('localhost:3000');
});

afterEach(async () => {
    // await browser.close();
});

test('The header has the correct text', async () => {
    const text = await page.$eval('a.brand-logo', (el) => el.innerHTML);
    expect(text).toEqual('Blogster');
});

test('clicking login starts oauth flow', async () => {
    await page.click('.right a');
    const url = await page.url();
    expect(url).toMatch(/accounts\.google\.com/);
});

test.only('When sign in, show logout button',async () => {

    const id = '5ede402faf2ed7ae17983230';
    const Buffer = require('safe-buffer').Buffer;
    const sessionObject = {
        passport: {
            user: id
        }
    };
    // we gotta emulate the sessionString and the signature that are generated when we sign in
    // we use Buffer in combination with Keygrip to accomplish that, and simulate a successful
    // login, using an existing user id

    // generates session string
    const sessionString = Buffer.from(
        JSON.stringify(sessionObject)
    ).toString('base64');
    // generate signature
    const Keygrip = require('keygrip');
    const keys = require('../config/keys');
    const keygrip = new Keygrip([keys.cookieKey]);
    const sig = keygrip.sign('session=' + sessionString);

    await page.setCookie({ name: 'session', value: sessionString });
    await page.setCookie({ name: 'session.sig', value: sig });
    await page.goto('localhost:3000');
});