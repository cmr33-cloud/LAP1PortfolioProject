const express = require("express"),
  cors = require("cors"),
  entries = require("./entries.json"),
  Entries = require("./models/entries"),
  app = express(),
  port = process.env.PORT || 80,
  fs = require('fs'),
  host = 'portfolio-project-lap-1.herokuapp.com';
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
  const fileData = JSON.parse(fs.readFileSync('server/entries.json'))
  if (data.title !== 'This is an entry'){
  fileData.push(newEntry)
  fs.writeFileSync('server/entries.json', JSON.stringify(fileData, null, 2), (err) => {
    if (err) {
        throw err;
    }
})
  }
  else {
    console.log('test entry detected')
  }
res.status(201).send(newEntry);
})

// router.post('/', (req, res) => );

app.get("/allEntries", (req, res) => {res.json(entries)
  });

app.post("/", (req, res) => {
  res.status(405).send("Not allowd!");
});

app.get('/entry/:id', (req, res) => {
  if ((req.params.id-1)<=entries.length) {
    
    res.send(entries[req.params.id-1])
  }
  else {
    res.status(404).send('Not found')
  }
})

app.all('/entry/:id/reactions', (req, res) => {
  let emojiIndex = req.body[0]-1;

  let entryIndex= req.params.id-1;
  let newEmojiCount = req.body[1];
  entries[entryIndex].emojis[emojiIndex] = newEmojiCount;
  //   rewrite json 
  
  fs.readFile('server/entries.json', 'utf8', (err, data) => {
    if(err) {
        console.log(`Error reading file: ${err}`);
    } else {
      
      const fileData = JSON.parse(fs.readFileSync('server/entries.json'))
  
        //Replace entry in JSON file with new entry withu updated reacts
      
        fileData[entryIndex].emojis[emojiIndex] = newEmojiCount;  
        const jsonString = JSON.stringify(fileData, null, 2)
        fs.writeFile('server/entries.json', jsonString, (err) => {
            if (err) {
                console.log(`Error writing file: ${err}`);
            }
        });
        
        //console.log(`Updated number of reactions for entry index ${entryIndex}.`);  
      }
    })
  res.status(200)
  res.send(entries[req.params.id-1].emojis)
})


app.get('/entry/:id/comments', (req, res) => {
 res.send(entries[req.params.id-1].comments)
})


app.patch('/entry/:id/comments', (req, res) => {
  
  let entryIndex= req.params.id-1;
  //   rewrite json 
  
  fs.readFile('entries.json', 'utf8', (err, data) => {
    if(err) {
        console.log(`Error reading file: ${err}`);
    } else {
      
      const fileData = JSON.parse(fs.readFileSync('entries.json'))
  
        //Replace entry in JSON file with new entry withu updated reacts
      
        fileData[entryIndex].comments.push(req.body);  
        const jsonString = JSON.stringify(fileData, null, 2)
        fs.writeFile('entries.json', jsonString, (err) => {
            if (err) {
                console.log(`Error writing file: ${err}`);
            }
        });
        
        console.log(`Updated comments on entry index ${entryIndex}.`);  
      }
    })
  res.send({msg: entries[req.params.id-1].comments})
})



app.get('/search', (req, res) => {let results = [];
for(let a of Object.values(req.query)){for(let b of entries){if(b.tags.includes(a)){results.push(b)}}}
res.json(results)
})
//app.listen(port, () => {console.log(`Listening on localhost:${port}...`)}) app.listen(process.env.PORT || 5000);

module.exports = app;
