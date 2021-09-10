const express = require('express');
const router = express.Router();

const Entries= require('../models/entries.js');

router.get('/', (req, res) => {
    res.send('You are at the entries')
});

router.get('/:id', (req, res) => {
    try {
        const entryId = parseInt(req.params.id);
        const selectedId = Entries.findById(entryId);
        res.send(selectedId);
    } catch (err) {
        console.log(err);
        res.status(404).send(err);
    }
});

module.exports = router;