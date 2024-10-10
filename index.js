import {tweetsData} from "./data.js"
const tweetBtn = document.getElementById("tweet-btn")
const myInput = document.getElementById("my-input")


tweetBtn.addEventListener("click", function(){
    console.log(myInput.value)
    myInput.value =""
})

function getFeedHtml(tweets){ //THE HTML CREATOR
    let tweetsection = ""
    
    tweets.forEach((oneTweet) =>{         //I USED FOREACH IN THE FIRST BIG FORLOOP TO HAVE VARIATION
        let heartsClass = ""
        let retweetClass = ""
        let comments = ""

        if(oneTweet.isLiked){ //checking in the data.js which I might have modified through shallow copy
            heartsClass = "liked"
        }
        if(oneTweet.isRetweeted){ //checking in the data.js which I might have modified through shallow copy
            retweetClass = "retweeted"
        }
        
        if (oneTweet.isCommented){ //DEEPER LOOP IN IF TO GET OBJECTS IN THE ARRAY OF REPLIES IN EVERY TWEET INSIDE OF A VARIABLE
                for (let oneReply of oneTweet.replies){
                    comments += `
                    <div>
                    <div class="tweet-inner" style="flex-direction:column;">
                    <img src="${oneReply.profilePic}" class="profile-pic"/>
                    <p class="handle">${oneReply.handle}</p>
                    <p class="tweet-text">${oneReply.tweetText}</p>
                    </div>
                    </div>
                    
                    `
            }
                
        }
    
        tweetsection +=  // creating all HTML, note ${comments} where I place the deeper loop's variable
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
                        <i class="fa-solid fa-heart ${heartsClass}" data-hearts="${oneTweet.uuid}"></i> ${oneTweet.likes}
                        </span>
                        <span class="tweet-detail">
                            <i class="fa-solid fa-retweet ${retweetClass}" data-retweets="${oneTweet.uuid}"></i>${oneTweet.retweets}
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


document.addEventListener("click",(e) => { // 3 LISTENERS ON ICON CLICKS VIA DATASET, FUNCTIONS LISTED BELOW
    if(e.target.dataset.hearts){
        handleLike(e.target.dataset.hearts)
    }
    else if(e.target.dataset.retweets){
        handleRetweet(e.target.dataset.retweets)
    }
    else if(e.target.dataset.replies){
        detectReply(e.target.dataset.replies)
    }
    render(tweetsData)  //taking advantage of shallow copy to just reassign icons as the original data.js changes when shallow copy is created
})


function handleLike(tweetUuid){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetUuid
    })[0] //shallow copy of tweetsData object created, it means the original data is modifiable with every new change

    if (targetTweetObj.isLiked){
        targetTweetObj.likes-- //modifying the filtered shallow copy
    }
    else{
        targetTweetObj.likes++  //modifying the filtered shallow copy
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
}

function handleRetweet(tweetUuid){
    tweetsData.map((tweet) => { //shallow copy of tweetsData object created, it means the original data is modifiable with every new change
        if (tweetUuid === tweet.uuid){
            if(tweet.isRetweeted){
                tweet.retweets -- //modifying the filtered shallow copy
            } else if(!tweet.isRetweeted){
                tweet.retweets ++ //modifying the filtered shallow copy
            }
            tweet.isRetweeted = !tweet.isRetweeted
        } 
    })
}

function detectReply(tweetUuid){
    const targetTweetObj = tweetsData.filter((tweet) => {
        return tweet.uuid === tweetUuid                     //when you filter, you want to return truth or false
    })[0]                                                   //filter method iterates over an array of objects and returns a shallow copy with a filtered out array, if you want to return object, then use [] 

    console.log(targetTweetObj)//when modifying advanced data types such as objects and arrays, you modify the type on the heap, in other words, the original changes
    console.log(tweetsData) //same SHALLOW
    
    if (targetTweetObj.replies.length > 0){
        targetTweetObj.isCommented = !targetTweetObj.isCommented
    }

}


// function handleLike(tweetUuid){                         // just showing the variation you can have in forloops
//         for (let i =0; i < tweetsData.length;i++){
//             if(tweetsData[i].uuid === tweetUuid && !tweetsData[i].isLiked){
//                 tweetsData[i].likes ++
//                 console.log(tweetsData[i])
//             } else if (tweetsData[i].uuid === tweetUuid && tweetsData[i].isLiked){
//                 tweetsData[i].likes --
//                 console.log(tweetsData[i])
//             }
//             tweetsData[i].isLiked = !tweetsData[i].isLiked 
//         }
// }