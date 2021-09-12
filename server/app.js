const express = require("express"),
  cors = require("cors"),
  entries = require("../data"),
  app = express();
function getTags(string){
    let keywords = ["a", "of", "the", "in", "to"];
    for(let a of string.split(" ")){
    
    }
}
app.use(express.json());
app.use(cors());

const entryRoutes = require("./controllers/entries");
app.use("/entries", entryRoutes);

app.get("/", (req, res) => {
  res.send("Hello there!");
});

app.get("/newentry", (req, res) => {
  let newentry = {
    title: req.query.title,
    description: req.query.description,
    entry: req.query.entry,
    date: Date(),
    tags: getTags(req.query.entry),
  };
  entries.push(newentry);
});

app.get("/allEntries", (req, res) => {res.json(entries)
  });

app.post("/", (req, res) => {
  res.status(405).send("Not allowd!");
});


app.listen(localhost, port, () => {console.log(`Listening on localhost:${port}...`))
});

module.exports = app;
