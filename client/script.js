function getTags(string){
    let keywords = ["a", "of", "the", "in", "to"];
    let allwords = [];
    for(let a of string.split(" ")){
     if(!keywords.includes(a.toLowerCase()) && !allwords.includes(a.toLowerCase())){allwords.push(a.toLowerCase())}
    }
    let wordcounts = [];
    for(let a of allwords){wordcounts.push([a])}
    for(let a of wordcounts){let count = 0;
      for(let b of string.split(" ")){if(a[0]==b.toLowerCase()){count++}}
    a.push(count)
    }
console.log(wordcounts);
let ordered = wordcounts.sort((a,b) => b[1] > a[1] ? 1 : -1);
console.log(ordered);
let tags = [ordered[0][0], ordered[1][0], ordered[2][0]];
return tags
};
submit.addEventListener("click", (e) => {
    e.preventDefault();
    if(newentry.children[0].value != "" && 
    newentry.children[1].value != "" && 
    newentry.children[2].value != ""&&
    newentry.children[2].value.length <= 3000){
const options = { 
    method: 'POST',
    body: JSON.stringify({
        title: newentry.children[0].value,
        description: newentry.children[1].value,
        body: newentry.children[2].value,
        tags: getTags(newentry.children[2].value)
    }),
    headers: {
        "Content-Type": "application/json"
    }
};
    fetch('http://localhost:3000/newentry', options).then(res => {console.log(res);
        success.hidden=false;
        Object.values(newentry.children).forEach(element => {
            element.value = ""
        });
        submit.value="Add entry"
        setTimeout(function(){success.hidden=true}, 3000);
    })
}
    else {alert("Please fill out the form.")}
})

function search(string){

}