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

            //We attempted to create more tests, but couldn't figure out a good way to do it without refactoring a large amount of our code.
            //If we had factored our code correctly from the start, we could have made more tests to get to the required coverage on the client side.
            //I struggled to find examples of client side tests to help me.

        })
    })
})