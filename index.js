import {tweetsData} from "./data.js"
const tweetBtn = document.getElementById("tweet-btn")
const myInput = document.getElementById("my-input")

tweetBtn.addEventListener("click", function(){
    console.log(myInput.value)
    myInput.value =""
})



function getFeedHtml(tweets){
let tweetsection = ""
let comments = ""
for (let oneTweet of tweets){
    if (oneTweet.replies.length > 0){ //DEEPER LOOP TO GET OBJECTS IN THE ARRAY OF REPLIES IN EVERY TWEET
        for (let oneReply of oneTweet.replies){
            comments += `
            <div>
                <p>${oneReply.handle}</p>
                <img src="${oneReply.profilePic}"/>
                <p>${oneReply.tweetText}</p>
            </div>
            
            `
        }
            
    }
                        //THE BIG LOOP TO LOOP OVER ALL OBJECTS, note ${comments} where I place the deeper loop's variable
    tweetsection += ` 
    <div class="tweet">
    <div class="tweet-inner">
        <img src="${oneTweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${oneTweet.handle}</p>
            <p class="tweet-text">${oneTweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">${oneTweet.replies.length} </span>
                </br>
                <span class="tweet-detail">
                    ${oneTweet.likes}
                </span>
                <span class="tweet-detail">
                    ${oneTweet.retweets}
                </span>
                <p>
                ${comments} 
                </p>
            </div>   
        </div>            
    </div>
</div>
    `
    }
feed.innerHTML = tweetsection
}
    
getFeedHtml(tweetsData)


