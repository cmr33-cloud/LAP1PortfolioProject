
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
home.addEventListener("click", (e) => {window.location.reload()});

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

showNewEntryForm.addEventListener("click", (e) => {e.preventDefault();
  if(newEntryHere.hidden){newEntryHere.hidden = false}
});

cancel.addEventListener("click", (e) => {e.preventDefault();
  newEntryHere.hidden = true; newEntryTitle.value = ""; newEntryText.value = ""; searchGyphy.value = "";
  while (preview.children.length > 0) {
    preview.removeChild(preview.lastChild);
  }
  gifadded = false;

});

//Event listener and function forsearching by tags
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

//Function for generating tags based on the content of each entry
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

//This function creates a new entry and posts it to the server
async function getanew() {
  let url;
  if (gifadded) {url = yourgif;
  } else {
    url =
      `https://cliparting.com/wp-content/uploads/2017/03/Pen-clipart-to-download.jpg`;
  }
  let newPost = {
    title: newEntry.children[0].value,
    body: newEntry.children[1].value,
    tags: getTags(newEntry.children[1].value),
    image: url,
  };
  const options = await {
    method: "POST",
    mode: 'cors',
    body: JSON.stringify(newPost),
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
    Object.values(newEntry.children).forEach((element) => {
      element.value = "";
    });
    unhide(addEntry)
  });
}

//Event listener for the Gif button
addGiphyBtn.addEventListener("click", (e)=>{e.preventDefault(); 
if(preview.children.length>0){gifadded = true; yourgif = preview.children[0].src; unhide(gifAdded1)}
else {alert("No gif selected!")}
})

//Event listener for the gif preview button
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

//handleEmoji handles emoji clicks
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

//sendEmoji sendsthe emoji data to the server with a PATCH method
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
//Makes sure new entry is the correct length and isn't blank
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

//event listener for add new entry button
addNewEntryBtn.addEventListener("click", (e) => {
  e.preventDefault();
  addNewEntry();
});

//allows enter to bepressed instead of clicking the add new ntry button
// document.querySelector("body").addEventListener("keydown", (e) => {
//   if (e.key == "Enter") {
//     e.preventDefault();
//     addNewEntry();
//   }
// });
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
        current.className = "col-md-5  col-sm-12 card text-center shadow mx-4 my-4";
        current.dataset.value = data.id;
        // entry title
        let title = document.createElement("h3");
        title.className = "card-title entryTitle";
        current.appendChild(title);
        title.textContent = data.title;

       // entry date
       let date = document.createElement('small')
       date.textContent = data.date
       current.appendChild(date)
       date.className = "card-subtitle text-muted mb-2"

       // card body 
       cardBody = document.createElement("div");
       cardBody.className ="card-body"
       current.appendChild(cardBody);
       

        //  img inside card body
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
        cardBody.appendChild(image);
        image.class = "entryImage";
        image.src = data.image;
        

        // text inside card body
        entryText = document.createElement("div")
        cardBody.appendChild(entryText);
        entryText.textContent = data.body;
        entryText.className="card-text my-3 entryBody";
       

        
      // comments inside card body
      commentsWraper = document.createElement("div")
      commentsWraper.className = "text-start px-2 mt-4"
      commentsWraper.id = "commentsBox"
      cardBody.appendChild(commentsWraper)

      comments = document.createElement("div")

      
      commentsWraper.appendChild(comments);

      renderComments(comments,data)

      renderAddCommentBox(cardBody)
      
      //  emijis 
      allTheEmojis = document.createElement("div")
      
        cardBody.appendChild(allTheEmojis);
        renderEmoji(allTheEmojis, data)
        allTheEmojis.className = "col emojiBox d-flex flex-row justify-content-end"
          


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
       // console.log(commentInput)
        const submitNewCommentBtn = document.getElementById('submitNewCommentBtn')
       // console.log(submitNewCommentBtn)
        
        submitNewCommentBtn.addEventListener("click", (e) => {
          e.preventDefault(); 
          let nnn = document.getElementById('commentsBox')
            console.log(nnn)
            console.log(commentInput.value)

          if (
            commentInput.value != "" &&
            commentInput.value.length <= 1000
            ) {
              addNewComment(entryId, commentInput.value);
              renderNewComment(Date(),commentInput.value,nnn)
              commentInput.value = "";
              //window.location.reload(true);
              unhide(comsucc)
            } else {
              alert("Please say something nice.");
              console.log(nnn)
            }
          });
        
        });
        }
   catch (error) {
    console.log(error);
  }
}

//unhides target object
function unhide(object){
  object.hidden = false;
  setTimeout(function () {
    object.hidden = true;
  }, 3000);
}

// Sends new comment to server with a PUT request
function addNewComment(entryId,commentText) {
  console.log(entryId, commentText);
  const options = {
    method: "PUT",
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

//   -----  adding new comment on the card 

 function renderNewComment(date, text, element) {
 const singleCommentBox = document.createElement('div');
    const commentDate = document.createElement('small');
    const commentText = document.createElement('p');
    commentDate.className = "text-muted mb-2";
    commentText.className = "card-text";

    commentDate.textContent = date;
    commentText.textContent = text;

    singleCommentBox.appendChild(commentDate)
    singleCommentBox.appendChild(commentText)
  
    
    element.appendChild(singleCommentBox)
 }

//   ------------------   timeline render
fetch(`https://${host}/allentries`)
  .then((r) => r.json())
  .then((res) => {
    for (let a of res.slice().reverse()) {
      let current = document.createElement("article");
      timeline.appendChild(current);
      current.className = "col-md-5  col-sm-12 card text-center shadow mx-4 my-4";

      current.dataset.value = a.id;
      // -------  title 
      let title = document.createElement("h3");
      title.className ="card-title my-3 entryTitle"
      title.textContent = a.title;
      current.appendChild(title);
      //  ------- date 
      let date = document.createElement('small')
      date.textContent = a.date
      date.className="card-subtitle text-muted mb-2"
      current.appendChild(date);
      //--   card body 

      let cardBody = document.createElement('div')
      cardBody.className = "card-body"
      current.appendChild(cardBody);
      
       //  ------ img inside card body
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
          cardBody.appendChild(image);
          image.class = "entryImage";
        image.src = a.image;
       //  ----  entry main text inside card body
       (entryText = document.createElement("div")),
       entryText.className = "entryBody card-text my-2 ";
       cardBody.appendChild(entryText);
       entryText.textContent = a.body;
       // --------- card footer 
        cardFooter = document.createElement("div") 
        cardFooter.className = "row card-footer text-muted justify-content-between"
        current.appendChild(cardFooter);
        
        // -------- number of comments inside cardFooter
        
        (commentsCount = document.createElement("div"))
        commentsCount.className ="col"
        commentsCount.textContent = `${a.comments.length} comment`; if(a.comments.length>1){commentsCount.textContent += "s"};
         cardFooter.appendChild(commentsCount);
         

        //  ------- emoji box inside card footer 
        (allTheEmojis = document.createElement("div"))
        allTheEmojis.className = "col emojiBox d-flex flex-row justify-content-around"
        cardFooter.appendChild(allTheEmojis);
          renderEmoji(allTheEmojis, a)
      
    }
  });


//  ------------  render emoji box-------------

function renderEmoji(element, data) {
  const emojiIcons = ["far fa-smile", "far fa-angry", "far fa-surprise"]

  for (i = 0; i < data.emojis.length; i++) {
    clickableEmoji = document.createElement('a')
    clickableEmoji.href = ""
    clickableEmoji.name = i+1
    clickableEmoji.className += "emoji px-2"
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
  
  for (i = 0; i < data.comments.length; i++) {
    const singleCommentBox = document.createElement('div');
    const commentDate = document.createElement('small');
    const commentText = document.createElement('p');
    commentDate.className = "text-muted mb-2";
    commentText.className = "card-text";

    commentDate.textContent = data.comments[i].date;
    commentText.textContent = data.comments[i].comment;

    singleCommentBox.appendChild(commentDate)
    singleCommentBox.appendChild(commentText)
  
    
    element.appendChild(singleCommentBox)
  }
}

function renderAddCommentBox(element) {
    
    // new comment box
    const newCommentBox = document.createElement('form');

    const newCommentInput = document.createElement('textarea');
    newCommentInput.placeholder="Your comment";
    newCommentInput.id="newCommentInput";
    newCommentInput.className ="form-control mt-2";
    newCommentInput.rows = "3";


    submitNewComment = document.createElement('input');
    submitNewComment.type="submit"
    submitNewComment.value="Add comment"
    submitNewComment.id="submitNewCommentBtn"
    submitNewComment.className ="btn btn-outline-secondary mt-2";
    comsucc = document.createElement('text'); comsucc.textContent ="Comment successfully added!";
    comsucc.style = "color:red"; comsucc.hidden = true;

    newCommentBox.appendChild(newCommentInput)
    newCommentBox.appendChild(submitNewComment)
    newCommentBox.appendChild(comsucc);

    element.appendChild(newCommentBox)
   
};

//exported functions for testing
module.exports = {
      getanew,
      sendEmoji,
      entryById,
      addNewComment
}
