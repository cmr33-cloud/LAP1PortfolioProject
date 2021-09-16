const request = require('supertest');
// import server
const app = require('../app');
//import model
const entries = require('../models/entries.js')

describe('API server', () => {
    let api;
    let testEntry = {
        id: 3,
        title: 'This is an entry',
        body: 'This is the body of the entry',
        date: Date(),
        emojis: [ 0, 0, 0 ],
        comments: []
    };

    beforeAll(() => {
        // start the server and store it in the api variable
        api = app.listen(5000, () =>
            console.log('Test server running on port 3000')
        );
    });

    afterAll((done) => {
        // close the server, then run done
        console.log('Gracefully stopping test server');
        api.close(done);
    });

    it('responds to get / with status 200', (done) => {
        request(api).get('/').expect(200, done);
    });

    it('responds to get /allentries with status 200', (done) => {
        request(api).get('/allentries').expect(200, done);
    });

    it('responds to post /newentry with status 201', (done) => {
        request(api)
            .post('/newentry')
            .send(testEntry)
            .set('Accept', /application\/json/)
            .expect(201)
             .expect({ ...testEntry }, done);
     });

    it('retrieves an entry by id', (done) => {
        request(api)
            .get('/entry/1')
            .expect(200)
            .expect({
                "id": 1,
                "title": "The world is an amazing place!",
                "body": "I'd like to thank the people of the world, it is so fantastic to live on such a beautiful planet. Everyday, the earth inspires me to do my best.",
                "image": "https://giphy.com/embed/mf8UbIDew7e8g",
                "tags": [
                  "world",
                  "people",
                  "thank"
                ],
                "date": "Tue Sep 14 2021 16:35:52 GMT+0100 (British Summer Time)",
                "emojis": [
                  0,
                  0,
                  0
                ],
                "comments": [
                  {
                    "date": "Fri Sep 10 2021 18:13:00 GMT+0100 (British Summer Time)",
                    "comment": "great!"
                  }
                ]
              }, done);
    });

    it('responds to a unknown entry id with a 404', (done) => {
        request(api).get('/entry/2000').expect(404).expect({}, done);
    });

    it('responds to non existing paths with 404', (done) => {
        request(api).get('/enteries').expect(404, done);
    });

    it('responds to invalid method request with 405', (done) => {
        request(api).post('/').expect(405, done);
    });

    it('retrieves the emojis by id on path /entry/:id/reaction', (done) => {
        request(api)
        .get('/entry/1/reactions')
        .expect(200)
        .expect('[0,0,0]',done)
        })

    it('retrieves the comment array by id on path /entry/:id/comments', (done) => {
        request(api)
        .get('/entry/1/comments')
        .expect(200)
        .expect([
            {
              date: 'Fri Sep 10 2021 18:13:00 GMT+0100 (British Summer Time)',
              comment: 'great!'
            }
          ], done)

})
})