const express = require("express"),
  cors = require("cors"),
  entries = require("./data"),
  Entries = require("./models/entries")
  app = express(),
  port = 3000;
app.use(express.json());
app.use(cors());

const entryRoutes = require("./controllers/entries");
app.use("/entries", entryRoutes);

app.get("/", (req, res) => {
  res.send("Hello there!");
});

app.post("/newentry", (req, res) => {
  const data = req.body;
  const newEntry = Entries.createEntry(data);
  res.status(201).send(newEntry);
});

// router.post('/', (req, res) => );

app.get("/allEntries", (req, res) => {res.json(entries)
  });

app.post("/", (req, res) => {
  res.status(405).send("Not allowd!");
});

app.get('/entry/:id', (req, res) => {
    res.send(entries[req.params.id-1])
})

app.get('/search', (req, res) => {let results = [];
for(let a of Object.values(req.query)){for(let b of entries){if(b.tags.includes(a)){results.push(b)}}}
res.json(results)
})
app.listen(port, () => {console.log(`Listening on localhost:${port}...`)})

module.exports = app;
