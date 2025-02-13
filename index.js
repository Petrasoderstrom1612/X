import { tweetsData as initialTweetsData } from "./data.js"
import { v4 as uuidv4 } from 'https://jspm.dev/uuid'

let tweetsData = JSON.parse(localStorage.getItem("tweetsData")) || initialTweetsData; // Initialize tweetsData from localStorage, or use the hardcoded one from data.js if you did not use the app before


function loadTweetsFromLocalStorage() {
    const storedTweets = JSON.parse(localStorage.getItem("tweetsData"));
    if (storedTweets) {
        tweetsData = storedTweets; // Update tweetsData with stored values. Since we always update tweetsData in our functions with saveToLocalStorage(), we override whatever is in local storage on initial render (as this function only runs when you start the page). This is when you have used the app before, hence previously had saved stuff in local storage.
    }
    render(tweetsData);  // Render the tweets on page load
}

loadTweetsFromLocalStorage(); // Call this function initially to load and render tweets from localStorage

function saveToLocalStorage() {
    localStorage.setItem("tweetsData", JSON.stringify(tweetsData));
}




function getFeedHtml(tweets){ //THE HTML CREATOR
    let tweetsection = ""
    
    tweets.forEach((oneTweet) =>{         //I USED FOREACH IN THE FIRST BIG FORLOOP TO HAVE VARIATION
        let comments = ""
        
        
        const heartsClass = oneTweet.isLiked ? "liked" : ""
        const retweetClass = oneTweet.isRetweeted ? "retweeted" : ""  //you can normally place null in ternarys but since here it will be a class, better to leave it empty so it does not look weird in inspector tools
        
        if (oneTweet.replies.length > 0){ //DEEPER LOOP IN IF TO GET OBJECTS IN THE ARRAY OF REPLIES IN EVERY TWEET INSIDE OF A VARIABLE
            for (let oneReply of oneTweet.replies){
                comments += `
                <div class="tweet-reply">
                <div class="tweet-inner">
                <img src="${oneReply.profilePic}" class="profile-pic">
                <div>
                    <p class="handle ${oneReply.handle === 'Petra' ? 'fixed-margin-comment' : ''}">${oneReply.handle}</p>
                    <button data-delete-own-reply="${oneTweet.uuid}+${oneReply.commentUuid}" class="delete-comment ${oneReply.handle === 'Petra' ? '' : 'hidden-comment'}">X</button>
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
        <p class="handle ${oneTweet.handle === 'Petra' ? 'fixed-margin' : ''}">${oneTweet.handle}</p>
        <button data-delete-own-tweet="${oneTweet.uuid}" class="delete ${oneTweet.handle === 'Petra' ? '' : 'hidden'}">X</button>
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
    document.getElementById('feed').innerHTML = getFeedHtml(tweets) //you do this as a separate function because we want to separate tasks in JS
}

render(tweetsData) 
    
    
    
document.addEventListener("click",(e) => { // LISTENERS ON ICON CLICKS VIA DATASET, FUNCTIONS LISTED BELOW, also click on id for main tweet button
    if(e.target.id === "tweet-btn"){
        addOwnTweet()
    }
    else if(e.target.dataset.deleteOwnTweet){
        removeOwnTweet(e.target.dataset.deleteOwnTweet)
    }
    else if(e.target.dataset.replies){
        toggleComments(e.target.dataset.replies)
    }
    else if(e.target.dataset.replyBtn) { 
        addOwnComment(e.target.dataset.replyBtn);
    }
    else if(e.target.dataset.deleteOwnReply) { //jag ska bara kunna radera mina egna kommentarer
        const [tweetUuid, commentUuid] = e.target.dataset.deleteOwnReply.split('+');
        if (tweetUuid && commentUuid) { //bara jag får commentUuid i comment section
            removeOwnComment(tweetUuid, commentUuid);
        }
    }
    else if(e.target.dataset.hearts){
        handleLike(e.target.dataset.hearts)
    }
    else if(e.target.dataset.retweets){
        handleRetweet(e.target.dataset.retweets)
    }
})

    function addOwnTweet(){
        const myInput = document.getElementById("my-input")
        if(myInput.value){ //only if you type something
            const petrasTweet = {
                handle: `Petra`,
                profilePic: `images/chamelleon.jpg`,
                likes: 0,
                retweets: 0,
                tweetText: myInput.value,
                replies: [],
                isLiked: false,
                isRetweeted: false,
                uuid: uuidv4()
                }
            saveToLocalStorage();  // Save the updated tweetsData to localStorage
            tweetsData.unshift(petrasTweet) //add it highest upp to the array
            myInput.value = ""
            render(tweetsData)
        }
    }

    function removeOwnTweet(tweetUuid){
        const targetTweetIndex = tweetsData.findIndex((tweet) => tweet.uuid === tweetUuid);
        if (targetTweetIndex !== -1 && tweetsData[targetTweetIndex].handle === "Petra") {
            tweetsData.splice(targetTweetIndex, 1);
            saveToLocalStorage();  // Save the updated tweetsData to localStorage
        }
        render(tweetsData);
    }


    function addOwnComment(tweetUuid){
        const InputField = document.getElementById(`reply-input-${tweetUuid}`)
        let myComment = InputField.value
        
        if(myComment){
            tweetsData.map((tweet) => {
                if (tweetUuid === tweet.uuid){
                    tweet.replies.push({
                        handle: "Petra",
                        profilePic: `images/chamelleon.jpg`,
                        tweetText: myComment,
                            commentUuid: uuidv4()
                        })
                    }
                })
            saveToLocalStorage();  // Save the updated tweetsData to localStorage
            }
        myComment = ""
        render(tweetsData)
        toggleComments(tweetUuid)
    }
    
    function removeOwnComment(tweetUuid, commentUuid) {
        const targetTweetObj = tweetsData.find((tweet) => tweet.uuid === tweetUuid);
        
        const targetReplyIndex = targetTweetObj.replies.findIndex(reply => 
            reply.handle === "Petra" && reply.commentUuid === commentUuid
        );
        
        if (targetReplyIndex !== -1) { //if reply was found, its index will be 0 or positive number, as index -1 does not exist
            targetTweetObj.replies.splice(targetReplyIndex, 1);
            saveToLocalStorage();  // Save the updated tweetsData to localStorage
        } 
        
        render(tweetsData);
        if(targetTweetObj.replies.length > 0){
            toggleComments(tweetUuid)
        }
    }
    
    function toggleComments(tweetUuid){
        document.getElementById(`replies-${tweetUuid}`).classList.toggle("hidden")
    } //no need for rerender as you do not modify the data
        
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
        
        render(tweetsData)  //you need to rerender html as data.js is changed now to see the changes. Also note how you take advantage of the shallow copy targetTweetObj you created on the heap based on tweetsData
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

