import {tweetsData} from "./data.js"
import { v4 as uuidv4 } from 'https://jspm.dev/uuid'


 function addOwnTweet(){
    const myInput = document.getElementById("my-input")
    if(myInput.value){ //only if you type something
        const petrasTweet = {
            handle: `Petra 💎`,
            profilePic: `images/chamelleon.jpg`,
            likes: 0,
            retweets: 0,
            tweetText: myInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
            }
        console.log(petrasTweet)

        tweetsData.unshift(petrasTweet) //add it highest upp to the array
        myInput.value = ""
        render(tweetsData)
    }
}

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
        
        if (oneTweet.replies.length > 0){ //DEEPER LOOP IN IF TO GET OBJECTS IN THE ARRAY OF REPLIES IN EVERY TWEET INSIDE OF A VARIABLE
            for (let oneReply of oneTweet.replies){
                comments += `
                <div class="tweet-reply">
                    <div class="tweet-inner">
                        <img src="${oneReply.profilePic}" class="profile-pic">
                            <div>
                                <p class="handle">${oneReply.handle}</p>
                                <p class="tweet-text">${oneReply.tweetText}</p>
                            </div>
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
                        <span class="tweet-detail"><i class="fa-solid fa-heart ${heartsClass}" data-hearts="${oneTweet.uuid}"></i> ${oneTweet.likes}</span>
                        <span class="tweet-detail"><i class="fa-solid fa-retweet ${retweetClass}" data-retweets="${oneTweet.uuid}"></i>${oneTweet.retweets}</span>
                    </div>   
                </div>            
            </div>
             <div class="hidden" id="replies-${oneTweet.uuid}">
                ${comments}
                <div class="reply-input">
                    <input type="text" id="reply-input-${oneTweet.uuid}" placeholder="Write a reply..." />
                    <button data-reply-btn="${oneTweet.uuid}">Reply</button>
                </div>
             </div>  
        </div>
        `
        })
    return tweetsection
    }
        
    function render(tweets){ //you can place any word in here as long as it matches within the function, the function above gets it that it is the same thing, it is the render call with the real data.js that is avgörande. Also if you call the real thing every time, you do not need any arguments in any of the functions.
    document.getElementById('feed').innerHTML = getFeedHtml(tweets)
}

render(tweetsData)


document.addEventListener("click",(e) => { // 3 LISTENERS ON ICON CLICKS VIA DATASET, FUNCTIONS LISTED BELOW
    if(e.target.dataset.replies){
        toggleComments(e.target.dataset.replies)
    }
    else if(e.target.dataset.replyBtn) {  // This handles the "Reply" button click
        addOwnComment(e.target.dataset.replyBtn);
    }
    else if(e.target.dataset.hearts){
        handleLike(e.target.dataset.hearts)
    }
    else if(e.target.dataset.retweets){
        handleRetweet(e.target.dataset.retweets)
    }
})

function toggleComments(tweetUuid){
document.getElementById(`replies-${tweetUuid}`).classList.toggle("hidden")
} //no need for rerender as you do not modify the data

function addOwnComment(tweetUuid){
    const InputField = document.getElementById(`reply-input-${tweetUuid}`)
    let myComment = InputField.value

    if(myComment){
        tweetsData.map((tweet) => {
            if (tweetUuid === tweet.uuid){
                tweet.replies.unshift({
                    handle: `Petra 💎`,
                    profilePic: `images/chamelleon.jpg`,
                    tweetText: myComment
                })
            }
        })
    }
    myComment = ""
    render(tweetsData)
}

function handleLike(tweetUuid){ 
    const targetTweetObj = tweetsData.filter((tweet) => {   //shallow copy of tweetsData object created, it means the original data is modifiable with every new change
        return tweet.uuid === tweetUuid                     //when you filter, you want to return truth or false
    })[0]                                                   //filter method iterates over an array of objects and returns a shallow copy with a filtered out array, if you want to return object, then use [] 
    
    console.log(targetTweetObj)//when modifying advanced data types such as objects and arrays, you modify the type on the heap, in other words, the original changes
    console.log(tweetsData) //same SHALLOW
    
    if (targetTweetObj.isLiked){
        targetTweetObj.likes-- //modifying the filtered shallow copy
    }
    else{
        targetTweetObj.likes++  //modifying the filtered shallow copy
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    
    render(tweetsData)  //you need to rerender html as data.js is changed now to see the changes
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
    
    render(tweetsData)  //you need to rerender html as data.js is changed now to see the changes
}





//---------------------------------------------------------------------------------------------------------------
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