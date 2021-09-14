// Elements     - HTML
const timeline = document.getElementById("timeline");
const newEntryBtn = document.getElementById("addNewEntryBtn");
const newEntryForm = document.getElementById("newEntry");

// Elements  -  GIPHY
const addGiphyBtn = document.getElementById("addGiphy");
const searchGiphy = document.getElementById("searchGyphy");

// Elements  - entry with ID
const newCommentInput = document.getElementById("newCommentText");
const newCommentBtn = document.getElementById("addNewCommentBtn");
const selectEntry = document.getElementById("timeline");

const emojis = document.getElementById("addEntryEmojis");

//   Event Listeners  -  new entry
selectEntry.addEventListener("click", entryById);

searchByKeywordBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let searchers = searchByKeywordInput.value.split(" ");
  let url = "http://localhost:3000/search?word=" + searchers[0].toLowerCase();
  for (let i = 1; i < searchers.length; i++) {
    url += "&word" + String(i) + "=" + searchers[i].toLowerCase();
  }
  fetch(url)
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
    });
});

addEntry.style = "color:red";
//   Event Listeners  -  new entry

function getTags(string) {
  let keywords = ["a", "an", "and", "i", "is", "in", "it", "of", "the", "to"];
  let allwords = [];
  for (let a of string.split(" ")) {
    if (
      !keywords.includes(a.toLowerCase()) &&
      !allwords.includes(a.toLowerCase())
    ) {
      allwords.push(a.toLowerCase());
    }
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
async function getanew() {
  let newgif =
    "https://api.giphy.com/v1/gifs/search?api_key=TcBkX2mTEeOViaTrLzZIf766tBvbY4Fm&q=";
  for (let a of searchGyphy.value.split(" ")) {
    if (searchGyphy.value.split(" ").indexOf(a) != 0) {
      newgif += "&q" + String(searchGyphy.value.split(" ").indexOf(a));
    }
    newgif += a.toLowerCase();
  }
  await fetch(newgif)
    .then((res) => res.json())
    .then((res) => {
      url = res.data[0].url;
    });
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

emojis.addEventListener("click", (e) => {
  e.preventDefault();
  let targetEmoji = e.target.closest("a");
  let entryId = e.target.closest("article").id;
  // change number on the entry page
  let emojiCount = parseInt(targetEmoji.querySelector("p").textContent);
  let emojiIndex = targetEmoji.id.slice(-1);
  targetEmoji.querySelector("p").textContent = String(emojiCount + 1);
  console.log(targetEmoji);
});

function addNewEntry() {
  if (
    newEntry.children[0].value != "" &&
    newEntry.children[1].value != "" &&
    newEntry.children[1].value.length <= 3000
  ) {
    getanew();
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
    e.preventDefault();
    let id = e.target.closest("article").dataset.value;
    console.log(id);
    selectEntry.style.display = "none";
    fetch(`http://localhost:3000/entry/${id}`)
      .then((r) => r.json())
      .then((data) => {
        console.log(data);
        let entry = `<article class="card" data-value = ${id}>
            <h3 class="entryTitle">${data["title"]}</h3>
            <img  class="entryImg" src="" alt="">
            <div class="entryDescription">${data["description"]}</div>
            <div class="entryReactions">
              <div class="entryComments">${data["comments"].length}</div>
              <div class="entryEmoji">
                <i class="far fa-smile"></i>
                <i class="far fa-surprise"></i>
                <i class="fas fa-angry"></i>
              </div>
            </div>
        </article>`;
        document
          .getElementById("displayById")
          .insertAdjacentHTML("beforeend", entry);
      });
  } catch (error) {
    console.log(error);
  }
}

// for(let a of res){
//   selectEntry.appendChild(document.createElement('section'));
//   let current = selectEntry.children[0];
//   let title = document.createElement(h3), image = document.createElement(img), entryText = document.createElement(div),
//  allTheEmojis = document.createElement(div), emojiCounts = document.createElement(a),
//  comments = document.createElement(div), newComment = document.createElement(form);
//   current.appendChild(title); title.textContent = a.title;
//   current.appendChild(image); image.src = res.image;
//   current.appendChild(entryText); entryText.textContent = a.entry;
//   current.appendChild(allTheEmojis); 
//   current.appendChild(emojiCounts);
//   current.appendChild(comments);
//   current.appendChild(newComment);
//  }
// <section id="2" class="entryCard">
    
//         <h3 class="entryTitle">Entry 2 Title</h3>
//         <img  class="entryImg" src="https://picsum.photos/100" alt="">
//         <div class="entryText">Lorem ipsum lorem ipsum</div>
       
//         <div  id="allTheEmojis" class="emojis" > 
//             <text class="far fa-smile"></text>
//             <text class="far fa-surprise"></text>
//             <text class="fas fa-angry"></text>
//    </div><br>
//         <a  id="emojiCounts" class="emojis" > 
//             <text class="count">0</text>
//             <text class="count">3</text>
//             <text class="count">1</text>
    
// </a> 
//      <div class="comments">
//          <div class="singleComment">
//              <p class="commentText"> lorem lorem</p>
//              <p class="entryDate">17.09.2021</p>>
//          </div>
       


//         <form id ="newComment">
//             <input id="newCommentText" type="textarea" placeholder="Your comment">
//             <input id="addNewCommentBtn" type="submit" value="Add comment">

//         </form>    
//      </div>
   
// </section>

