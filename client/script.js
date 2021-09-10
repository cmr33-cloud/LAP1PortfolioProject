submit.addEventListener("click", (e) => {
    e.preventDefault();
    if(newentry.children[0].value != "" && 
    newentry.children[1].value != "" && 
    newentry.children[1].value.length <= 5000 &&
    newentry.children[2].value != ""){
    // fetch("localhost:3000/").then(res=> {
        success.hidden=false;
        Object.values(newentry.children).forEach(element => {
            element.value = ""
        });
        submit.value="Add entry"
        setTimeout(function(){success.hidden=true}, 3000);
    }
    else {alert("Please fill out the form.")}
// })
})

