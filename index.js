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
tweets.forEach((oneTweet) =>{         //I USED FOREACH IN THE FIRST FORLOOP TO HAVE VARIATION
    if (oneTweet.replies.length > 0){ //DEEPER LOOP IN IF TO GET OBJECTS IN THE ARRAY OF REPLIES IN EVERY TWEET INSIDE OF A VARIABLE
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
    
    tweetsection +=  //THE BIG LOOP TO LOOP OVER ALL OBJECTS, note ${comments} where I place the deeper loop's variable
    ` 
    <div class="tweet">
        <div class="tweet-inner">
            <img src="${oneTweet.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${oneTweet.handle}</p>
                <p class="tweet-text">${oneTweet.tweetText}</p>
                <div class="tweet-details">
                    <span class="tweet-detail"><i class="fa-regular fa-comment-dots" data-replies="${oneTweet.uuid}"></i>${oneTweet.replies.length} </span>
                    </br>
                    <span class="tweet-detail">
                       <i class="fa-regular fa-heart" data-hearts="${oneTweet.uuid}"></i> ${oneTweet.likes}
                    </span>
                    <span class="tweet-detail">
                        <i class="fa-solid fa-retweet" data-retweets="${oneTweet.uuid}"></i>${oneTweet.retweets}
                    </span>
                    <p>
                    ${comments} 
                    </p>
                </div>   
            </div>            
        </div>
    </div>
    `
    })
return tweetsection
}
    

function render(tweets){ //you can place any word in here as long as it matches within the function, the function above gets it that it is the same thing, it is the render call with the real data.js that is avgörande. Also if you call the real thing every time, you do not need any arguments in any of the functions.
feed.innerHTML = getFeedHtml(tweets)
}

render(tweetsData)

document.addEventListener("click",(e) => {
    if(e.target.dataset.replies){
        console.log(e.target.dataset.replies)
    }
    if(e.target.dataset.hearts){
        console.log(e.target.dataset.hearts)
    }
    if(e.target.dataset.retweets){
        console.log(e.target.dataset.retweets)
    }
})
