const express = require("express"),
  cors = require("cors"),
  entries = require("./entries.json"),
  Entries = require("./models/entries")
  app = express(),
  port = 3000,
  fs = require('fs');
app.use(express.json());
app.use(cors());

const entryRoutes = require("./controllers/entries");
app.use("/entries", entryRoutes);

app.get("/", (req, res) => {
  res.send("Hello there!");
});

app.post("/newentry", (req, res) => { //handles post requests and then writes data to entries.json
  const data = req.body;
  const newEntry = Entries.createEntry(data);
  const fileData = JSON.parse(fs.readFileSync('entries.json'))
  fileData.push(newEntry)
  fs.writeFileSync('entries.json', JSON.stringify(fileData, null, 2), (err) => {
    if (err) {
        throw err;
    }
})
res.status(201).send(newEntry);
})

// router.post('/', (req, res) => );

app.get("/allEntries", (req, res) => {res.json(entries)
  });

app.post("/", (req, res) => {
  res.status(405).send("Not allowd!");
});

app.get('/entry/:id', (req, res) => {
    res.send(entries[req.params.id-1])
})

app.all('/entry/:id/reactions', (req, res) => {
  res.send(entries[req.params.id-1].reactions)
})

app.all('/entry/:id/comments', (req, res) => {
  res.send(entries[req.params.id-1].comments)
})

app.get('/search', (req, res) => {let results = [];
for(let a of Object.values(req.query)){for(let b of entries){if(b.tags.includes(a)){results.push(b)}}}
res.json(results)
})
app.listen(port, () => {console.log(`Listening on localhost:${port}...`)})

module.exports = app;
