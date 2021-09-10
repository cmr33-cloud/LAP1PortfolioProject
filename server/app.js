const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json())
app.use(cors());

const entryRoutes = require('./controllers/entries');
app.use('/entries', entryRoutes);

app.get('/', (req, res) => {
    res.send('Hello there!');
});

app.post('/', (req, res) => {
    res.status(405).send('Not allowd!');
});

module.exports = app