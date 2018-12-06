
const form = document.querySelector("#search");
const formInput = document.querySelector("#search-input");


/*
function cleanUpUrls (array) {
    array.map(function(item){
    //return what we want in the new array.
    return item.data.url
    }).filter(function(urls){
    //creating a new array that only contains URLS that contain i.redd
    return urls.includes("i.redd") || urls.includes("i.imgur");
    }).map(function(filteredURL){
    return filteredURL.replace(".gifv", ".gif");
})
}
*/
let results;
let currentIndex;
let slideshow;

function slide() {
    // Change the src attribute of the img tag
    if (currentIndex === results.length -1) {
        currentIndex = -1;
    }
    currentIndex++
    let currentImg = document.querySelector("img");
    currentImg.src = results[currentIndex];
}

function makeFetchHappen(url) {
    fetch(url)
    .then(function(responseObject){
        return responseObject.json();
    })
    .then(function(jsonResults){
        // store the array of result objects
        let resultsObjectsArray = jsonResults.data.children;

        //map the results objects array to an array of just URLS which we grab from inside those objects
        results = resultsObjectsArray.map(function(item){
            //return what we want in the new array.
            return item.data.url
        }).filter(function(urls){
            //creating a new array that only contains URLS that contain i.redd
            return urls.includes("i.redd");
        }).map(function(filteredURL){
            return filteredURL.replace(".gifv", ".gif");
        })
        //let imgUrls = cleanUpUrls(resultsObjectsArray);
        return results;
    })
    .then(function(){
        // remove old img
        let oldSlides = document.querySelector("img");
        if (oldSlides) {
            clearInterval(slideshow);
            document.body.removeChild(oldSlides);
        }

        currentIndex = 0
        let firstPhoto = document.createElement("img");
        firstPhoto.src = results[currentIndex];
        firstPhoto.alt = formInput.value;
        document.body.appendChild(firstPhoto);
        slideshow = setInterval(slide, 3000);
    })
    .catch(function(error){
        console.log("Bad news bears, there's an error", error);
    });
    
}

document.addEventListener("DOMContentLoaded", function(){
    submitBtn = document.querySelector("#submit-button");
    // What happens when my event btn is pushed
    submitBtn.addEventListener("click", function (e) {
        e.preventDefault();

        let requestURL = `https://www.reddit.com/search.json?q=${formInput.value}&limit=50`;

        // Making Fetch happen
        makeFetchHappen(requestURL);
        formInput.value = null;
    })

    
})