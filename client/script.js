
// Elements     - HTML
const host = "portfolio-project-lap-1.herokuapp.com";
const timeline = document.getElementById("timeline");
const newEntryBtn = document.getElementById("addNewEntryBtn");
const newEntryForm = document.getElementById("newEntry");

// Elements  -  GIPHY
const addGiphyBtn = document.getElementById("addGiphy");
const searchGiphy = document.getElementById("searchGyphy");

// Elements  - entry with ID
const newCommentInput = document.getElementById("newCommentText");
const newCommentBtn = document.getElementById("addNewCommentBtn");

const emojis = document.getElementById("addEntryEmojis");
let gifadded;

//   Event Listeners  -  new entry
timeline.addEventListener("click", (e) => {
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
  let url = `https://${host}/search?word=` + searchers[0].toLowerCase();
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
      for (let a of timeline.children) {
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
      `https://cliparting.com/wp-content/uploads/2017/03/Pen-clipart-to-download.jpg`;
  }
  const options = await {
    method: "POST",
    mode: 'cors',
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
  await fetch(`https://${host}/newentry`, options).then((res) => {
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
    fetch('https://api.giphy.com/v1/gifs/search?api_key=TcBkX2mTEeOViaTrLzZIf766tBvbY4Fm&q=' + searchGyphy.value.replaceAll(" ", "+").toLowerCase())
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
  let emojiCount;
  let targetEmoji = e.target.closest('a');
  let entry = e.target.closest('article');
  let entryId = entry.dataset.value;  
  console.log(entryId)
  // change number on the entry page
  if(targetEmoji.clicked){targetEmoji.clicked = false; emojiCount = parseInt(targetEmoji.querySelector('p').textContent) - 1}
  else {targetEmoji.clicked = true; emojiCount = parseInt(targetEmoji.querySelector('p').textContent) + 1}
  targetEmoji.querySelector('p').textContent = String(emojiCount)

  //
  sendEmoji(entryId, parseInt(targetEmoji.name), emojiCount)
}

function sendEmoji(id, emojiId, emojiCount) {
  

  const options = {
    method: 'PATCH',
    mode: 'cors',
    body: JSON.stringify([emojiId, emojiCount]),
    headers: {
      'Content-Type': 'application/json',
    },
  };
  console.log(options);

  fetch(`https://${host}/entry/${id}/reactions`, options)
    .then((r) => r.json())
    //.then((r) => console.log(r))
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
    let entryId = e.target.closest("article").dataset.value;
   
    timeline.style.display = "none";
    fetch(`https://${host}/entry/${entryId}`)
      .then((r) => r.json())
      .then((data) => {
        
        let current = document.getElementById("displayById");
        current.class = "card";
        current.dataset.value = data.id;
        let title = document.createElement("h3");
        if (
          data.image ==
          `https://cliparting.com/wp-content/uploads/2017/03/Pen-clipart-to-download.jpg`
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
        let date = document.createElement('p')
        date.textContent = data.date
        current.appendChild(date)
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
        //  ---  entryById reactions listener
        current.addEventListener("click", (e) => {
          e.preventDefault();
          const target = e.target;
          
          if (target.closest('a')) {
            handleEmoji(e)
          }
        });

        //   ----  entryById  -  new comment listener
        
        const commentInput =document.getElementById('newCommentInput')
        console.log(commentInput)
        const submitNewCommentBtn = document.getElementById('submitNewCommentBtn')
        console.log(submitNewCommentBtn)
        submitNewCommentBtn.addEventListener("click", (e) => {
          e.preventDefault(); 

          
          if (
            commentInput.value != "" &&
            commentInput.value.length <= 1000
            ) {
              addNewComment(entryId, commentInput.value);
              //window.location.reload(true);

            } else {
              alert("Please say something nice.");
            }
          });
        });
        }
   catch (error) {
    console.log(error);
  }
}
// ----------------
function addNewComment(entryId,commentText) {
console.log(entryId, commentText);
  const options = {
    method: "POST",
    mode: 'cors',
    body: JSON.stringify([Date(), commentText]),
    headers: {
      "Content-Type": "application/json",
    },
  };

   fetch(`https://${host}/entry/${entryId}/comments`, options)
   .then((r) => r.json())
    .then((r) => console.log(r))
    .catch(console.warn);
}
 

console.log("update at 11:52");







//   ------------------   timeline render
fetch(`https://${host}/allentries`)
  .then((r) => r.json())
  .then((res) => {
    for (let a of res) {
      
    

    
      let current = document.createElement("article");
      timeline.appendChild(current);
      current.class = "card";
      current.dataset.value = a.id;
      let title = document.createElement("h3");
      let date = document.createElement('p')
      date.textContent = a.date
      if (
        a.image ==
        `https://cliparting.com/wp-content/uploads/2017/03/Pen-clipart-to-download.jpg`
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
      current.appendChild(date);
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
    icon.clicked = false;


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
    newCommentInput.id="newCommentInput"
    submitNewComment = document.createElement('input');
    submitNewComment.type="submit"
    submitNewComment.value="Add comment"
    submitNewComment.id="submitNewCommentBtn"
    

    newCommentBox.appendChild(newCommentInput)
    newCommentBox.appendChild(submitNewComment)

    element.appendChild(newCommentBox)
   
}
