/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

global.fetch = require('jest-fetch-mock');
let script;

describe('script', () => {
    beforeEach(() => {
        document.documentElement.innerHTML = html.toString();
        script = require('../script.js')
    })

    afterEach(() => {
        fetch.resetMocks();
    })

    describe('requests', () => {
        describe('getanew', () => {
            test('it makes a get request to /entry/id', () => {
                script.entryById()
                // expect(fetch).toHaveBeenCalledWith(expect.stringMatching(/\/cats$/))
                expect(fetch.mock.calls[0][0]).toMatch(/allentries$/)
              
            })
            test('it makes fetch request with sendEmoji', () => {
                script.sendEmoji(1,1,1)
                expect(fetch.mock.calls[0][0]).toMatch("https://portfolio-project-lap-1.herokuapp.com/entry/1/reactions")
            })
            test('it makes fetch request with addNewComment', () => {
                script.addNewComment()
                expect(fetch.mock.calls[0][0]).toMatch("https://portfolio-project-lap-1.herokuapp.com/entry/undefined/comments")
            })
        })
    })
})