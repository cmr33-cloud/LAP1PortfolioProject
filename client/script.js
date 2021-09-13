// Elements     - HTML
const timeline = document.getElementById('timeline');
const newEntryBtn = document.getElementById('addNewEntryBtn');
const newEntryForm = document.getElementById('newEntry');

// Elements  -  GIPHY
const addGiphyBtn = document.getElementById('addGiphy');
const searchGiphy = document.getElementById('searchGyphy');

// Elements  - entry with ID
const newCommentInput = document.getElementById('newCommentText');
const newCommentBtn = document.getElementById('addNewCommentBtn');
const selectEntry = document.getElementById('timeline')

const emojis = document.getElementById('addEntryEmojis');


//   Event Listeners  -  new entry
selectEntry.addEventListener('click', entryById)


//   Event Listeners  -  new entry





function getTags(string){
    let keywords = ["a", "an", "i", "is", "in", "it", "of", "the", "to"];
    let allwords = [];
    for(let a of string.split(" ")){
     if(!keywords.includes(a.toLowerCase()) && !allwords.includes(a.toLowerCase())){allwords.push(a.toLowerCase())}
    }
  let wordcounts = [];
  for (let a of allwords) {
    wordcounts.push([a]);
  }
  for (let a of wordcounts) {
    let count = 0;
    for (let b of string.split(" ")) {
      if (a[0] == b.toLowerCase()) {
        count++;
      }
    }
    a.push(count);
  }
  console.log(wordcounts);
  let ordered = wordcounts.sort((a, b) => (b[1] > a[1] ? 1 : -1));
  console.log(ordered);
  let tags = [ordered[0][0], ordered[1][0], ordered[2][0]];
  return tags;
}
async function getanew(){let url;
    await fetch("https://api.giphy.com/v1/gifs/random?api_key=TcBkX2mTEeOViaTrLzZIf766tBvbY4Fm")
        .then((res) => res.json())
        .then((res) => {url = res.data.images.original.url})
    const options = await {
      method: "POST",
      body: JSON.stringify({
        title: newEntry.children[0].value,
        body: newEntry.children[1].value,
        tags: getTags(newEntry.children[1].value),
        image: url,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };

    await fetch("http://localhost:3000/newentry", options).then((res) => {
      console.log(res);
      addEntry.hidden = false;
      Object.values(newEntry.children).forEach((element) => {
        element.value = "";
      });
      addEntry.value = "Add entry";
      setTimeout(function () {
        addEntry.hidden = true;
      }, 3000);
    });
  }


  emojis.addEventListener('click', (e) => {
    e.preventDefault();
    let targetEmoji = e.target.closest('a');
    let entryId = e.target.closest('article').id;
    // change number on the entry page
    let emojiCount = parseInt(targetEmoji.querySelector('p').textContent);
    let emojiIndex = targetEmoji.id.slice(-1);
    targetEmoji.querySelector('p').textContent = String(emojiCount+1)
    console.log(targetEmoji)
})


function addNewEntry() {
  if (
    newEntry.children[0].value != "" &&
    newEntry.children[1].value != "" &&
    newEntry.children[1].value.length <= 3000
  ) {getanew()
} else {
    alert("Please fill out the form.");
  }
}

addNewEntryBtn.addEventListener("click", (e) => {
  e.preventDefault();
  addNewEntry();
});

document.querySelector("body").addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    e.preventDefault();
    addNewEntry();
  }
});


function entryById(e) {
    try {
        e.preventDefault()
        let id = e.target.closest('article').dataset.value
        console.log(id)
        document.getElementById('timeline').style.display="none"
        
        fetch(`http://localhost:3000/entry/${id}`)
        .then( r => r.json())
        .then( data => {
            console.log(data)
            let div = document.getElementById("displayById")
            let entry = `<article class="card" data-value = ${id}>
            <h3 class="entryTitle">${data['title']}</h3>
            <img  class="entryImg" src="" alt="">
            <div class="entryDescription">${data['description']}</div>
            <div class="entryReactions">
              <div class="entryComments">${data['comments'].length}</div>
              <div class="entryEmoji">
                <i class="far fa-smile"></i>
                <i class="far fa-surprise"></i>
                <i class="fas fa-angry"></i>
              </div>
            </div>
        </article>`
        
        console.log(entry)
        div.insertAdjacentHTML('beforeend', entry)
        })
    }
    catch (error) {
        console.log(error);

    }
}

