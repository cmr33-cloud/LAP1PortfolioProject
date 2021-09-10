const express = require("express");
const app = express();
const cors = require("cors");
const { request } = require("express");
app.use(cors());
const port = 3000;
const entries = require('../data');

app.listen(port, () => {
    console.log(`Listening on localhost:${port}...`);
  });