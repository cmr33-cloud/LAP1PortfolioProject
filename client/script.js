

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
let gifadded;

//   Event Listeners  -  new entry
selectEntry.addEventListener("click", (e) => {
  e.preventDefault();
  const target = e.target;
  
  if (target.closest('a')) {
    handleEmoji(e)
  }
  else {
    entryById(e)
  }

});

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
      let ids = [];
      for (let a of res) {
        ids.push(String(a.id));
      }
      for (let a of selectEntry.children) {
        if (ids.includes(a.dataset.value)) {
          a.hidden = false;
        } else {
          a.hidden = true;
        }
      }
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
  let url;
  if (gifadded) {url = yourgif;
  } else {
    url =
      "https://cliparting.com/wp-content/uploads/2017/03/Pen-clipart-to-download.jpg";
  }
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
gifadded = false;
while (preview.children.length > 0) {
  preview.removeChild(preview.lastChild);
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

addGiphyBtn.addEventListener("click", (e)=>{e.preventDefault(); 
if(preview.children.length>0){gifadded = true; yourgif = preview.children[0].src; gifAdded.hidden = false; 
  setTimeout(function () {
    gifAdded.hidden = true;
  }, 3000);}
else {alert("No gif selected!")}
})

gifPreviewBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (searchGyphy.value == "") {
    alert("No gif selected!");
  } else {
    fetch("https://api.giphy.com/v1/gifs/search?api_key=TcBkX2mTEeOViaTrLzZIf766tBvbY4Fm&q=" + searchGyphy.value.replaceAll(" ", "+").toLowerCase())
    .then(res=>res.json())
    .then((res) => {
      while (preview.children.length > 0) {
        preview.removeChild(preview.lastChild);
      }
      let preev = document.createElement("iframe");
      preev.src = res.data[0].embed_url;
      preview.appendChild(preev);
    });
    gifadded=false;
  }
});

// --  add emoji reactions

function handleEmoji(e) {
  let targetEmoji = e.target.closest('a');
  let entry = e.target.closest('article');
  let entryId = entry.dataset.value;  
  console.log(entryId)
  // change number on the entry page
  let emojiCount = parseInt(targetEmoji.querySelector('p').textContent) + 1;
  targetEmoji.querySelector('p').textContent = String(emojiCount)

  //
  sendEmoji(entryId, parseInt(targetEmoji.name), emojiCount)
}

function sendEmoji(id, emojiId, emojiCount) {
  

  const options = {
    method: 'PATCH',
    body: JSON.stringify([emojiId, emojiCount]),
    headers: {
      'Content-Type': 'application/json',
    },
  };
  console.log(options);

  fetch(`http://localhost:3000/entry/${id}/reactions`, options)
    .then((r) => r.json())
    .then((r) => console.log(r))
    .catch(console.warn);
}

emojis.addEventListener('click', (e) => {
  e.preventDefault();
  handleEmoji(e);
})

//  --------------------- new Entry
function addNewEntry() {
  if (
    newEntry.children[0].value != "" &&
    newEntry.children[1].value != "" &&
    newEntry.children[1].value.length <= 3000
  ) {
    getanew();
  } else if (newEntry.children[1].value.length > 3000){alert("Entry is too long!")} else {
    alert("Please add a title and description.");
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
//      ------  get Entry By Id     render
function entryById(e) {
  try {
    e.preventDefault();
    let id = e.target.closest("article").dataset.value;
   
    selectEntry.style.display = "none";
    fetch(`http://localhost:3000/entry/${id}`)
      .then((r) => r.json())
      .then((data) => {
        
        let current = document.getElementById("displayById");
        current.class = "card";
        current.dataset.value = data.id;
        let title = document.createElement("h3");
        if (
          data.image ==
          "https://cliparting.com/wp-content/uploads/2017/03/Pen-clipart-to-download.jpg"
        ) {
          image = document.createElement("img");
          image.height = 150;
          image.width = 150;
        } else {
          image = document.createElement("iframe");
        }
        (entryText = document.createElement("div")),
          (allTheEmojis = document.createElement("div")),
          (emojiCounts = document.createElement("a")),
          (comments = document.createElement("div")),
        title.class = "entryTitle";
        image.class = "entryImage";
        entryText.class = "entryBody";
        current.appendChild(title);
        title.textContent = data.title;
        current.appendChild(image);
        image.src = data.image;
        current.appendChild(entryText);
        entryText.textContent = data.body;
        current.appendChild(allTheEmojis);
        current.appendChild(emojiCounts);


        renderEmoji(allTheEmojis, data)
        allTheEmojis.className += "emojiBox emoji"


        current.appendChild(comments);
        renderComments(comments,data)
       


        // let entry = `<article class="card" data-value = ${id}>
        //     <h3 class="entryTitle">${data["title"]}</h3>
        //     <img  class="entryImg" src="${data["image"]}" alt="">
        //     <div class="entryDescription">${data["description"]}</div>
        //     <div class="entryReactions">
        //       <div class="entryComments">${data["comments"].length}</div>
        //       <div class="entryEmoji">
        //         <i class="far fa-smile"></i>
        //         <i class="far fa-surprise"></i>
        //         <i class="fas fa-angry"></i>
        //       </div>
        //     </div>
        // </article>`;
        // document
        //   .getElementById("displayById")
        //   .insertAdjacentHTML("beforeend", entry);
      });
  } catch (error) {
    console.log(error);
  }
}
//   ----   timeline render
fetch("http://localhost:3000/allentries")
  .then((r) => r.json())
  .then((res) => {
    for (let a of res) {
      let current = document.createElement("article");
      selectEntry.appendChild(current);
      current.class = "card";
      current.dataset.value = a.id;
      let title = document.createElement("h3");
      if (
        a.image ==
        "https://cliparting.com/wp-content/uploads/2017/03/Pen-clipart-to-download.jpg"
      ) {
        image = document.createElement("img");
        image.height = 150;
        image.width = 150;
      } else {
        image = document.createElement("iframe");
      }
      (entryText = document.createElement("div")),
        (allTheEmojis = document.createElement("div")),
        (emojiCounts = document.createElement("a")),
        (commentsCount = document.createElement("div")),
      
      title.class = "entryTitle";
      image.class = "entryImage";
      entryText.class = "entryBody";
      current.appendChild(title);
      title.textContent = a.title;
      current.appendChild(image);
      image.src = a.image;
      current.appendChild(entryText);
      entryText.textContent = a.body;
      current.appendChild(allTheEmojis);
      
      renderEmoji(allTheEmojis, a)
      allTheEmojis.className += "emojiBox"

      //current.appendChild(emojiCounts);
      current.appendChild(commentsCount);
      commentsCount.textContent = `Comments:  ${a.comments.length}`

      
    }
  });


//  ------------  render emoji box-------------

function renderEmoji(element, data) {
  const emojiIcons = ["far fa-smile", "far fa-angry", "far fa-surprise"]

  for (i = 0; i < data.emojis.length; i++) {
    clickableEmoji = document.createElement('a')
    clickableEmoji.href = ""
    clickableEmoji.name = i+1
    clickableEmoji.className += "emoji"
    icon = document.createElement('i')
    icon.className += emojiIcons[i]


    emojiCount = document.createElement('p')
    emojiCount.textContent = data.emojis[i]
    emojiCount.className += "emoji"

    clickableEmoji.appendChild(icon)
    clickableEmoji.appendChild(emojiCount)
    element.appendChild(clickableEmoji)
  }
}

//  ----------------  render comment box  
function renderComments(element,data) {
  //  render existing comments
  console.log(data.comments)
  for (i = 0; i < data.comments.length; i++) {
    const singleCommentBox = document.createElement('div');
    const commentDate = document.createElement('p');
    const commentText = document.createElement('p');

    commentDate.textContent = data.comments[i].date;
    commentText.textContent = data.comments[i].comment;
  
    singleCommentBox.appendChild(commentDate)
    singleCommentBox.appendChild(commentText)
    element.appendChild(singleCommentBox)
  }
    
    // new comment box
    const newCommentBox = document.createElement('form');
    const newCommentInput = document.createElement('input');
    newCommentInput.type="textarea";
    newCommentInput.placeholder="Your comment";
    submitNewComment = document.createElement('input');
    submitNewComment.type="submit"
    submitNewComment.value="Add comment"
    

    newCommentBox.appendChild(newCommentInput)
    newCommentBox.appendChild(submitNewComment)

    element.appendChild(newCommentBox)
   
}
