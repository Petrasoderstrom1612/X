import {tweetsData} from "./data.js"
const tweetBtn = document.getElementById("tweet-btn")
const myInput = document.getElementById("my-input")

tweetBtn.addEventListener("click", function(){
    console.log(myInput.value)
    myInput.value =""
})