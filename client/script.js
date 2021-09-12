submit.addEventListener("click", (e) => {
    e.preventDefault();
    if(newentry.children[0].value != "" && 
    newentry.children[1].value != "" && 
    newentry.children[2].value != ""&&
    newentry.children[2].value.length <= 3000){
        let url =
`localhost:3000/newentry?title=${newentry.children[0].value}&description=${newentry.children[1].value}&entry=${newentry.children[2].value}`;
    fetch(url).then(res=> {
        success.hidden=false;
        Object.values(newentry.children).forEach(element => {
            element.value = ""
        });
        submit.value="Add entry"
        setTimeout(function(){success.hidden=true}, 3000);
    }
    else {alert("Please fill out the form.")}
})
})

function search(string){

}

