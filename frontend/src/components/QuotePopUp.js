import React,{useState} from 'react'
import MiniUserDetail from './MiniUserDetail'
import { requests} from '../constants/requests'
import instance from '../constants/axios'

export default function QuotePopUp({quotePopUp,quoteUpdate, setQuotePopUp, tweet, setTweets, userProfileObj}) {
  const [comment, setComment] = useState('');
  // tweet object with tweet and userDetails
 
  const repost = async () => {
    try {
      setQuotePopUp(!quotePopUp)
      const token = JSON.parse(localStorage.getItem('user')).token;
      instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await instance.post(requests.repost + '/' + tweet.tweet._id, {tweet: comment});

      // creating a new post with the same content
      // add reposted_from to the tweet as tweet.userDetails
      if (quoteUpdate) {
        setTweets((prevTweets) => {
          return [{tweet: response.data.tweetsData, userDetails: userProfileObj}, ...prevTweets];
      } 
      );
      }

      
    } catch(error) {
      console.log('error:', error);
    }
  }

  return (
    <div className='quote-retweet-pop-up'>
    <div className='close-quote-retweet-pop-up' onClick={() => setQuotePopUp(!quotePopUp)}> X </div>
    <div>
      <div className='quote-retweet-user-profile-input'>
            <div className='userProfilePic'>
                {userProfileObj.profile_pic ?  
                    <img src={userProfileObj.profile_pic} alt='profile' /> : 
                    <img src='https://cdn-icons-png.flaticon.com/128/5460/5460794.png' alt='default profile' /> 
                }
            </div>
            <div className='quote-input'>
            <textarea onChange={(e)=> {setComment(e.target.value)}} className='quote-input-textarea' type="text" placeholder="Add a comment" />
            <div className='quote-retweet-tweet'>
            {
                <MiniUserDetail key={tweet.tweet.id} user={tweet.userDetails}   createdAt={tweet.tweet.createdAt || tweet.tweet.updatedAt}  tweet={tweet.tweet} setTweets={setTweets}/>
            }

            </div> 
            <div className='quote-retweet-tweet-buttons'>
            <div className='post-private'>
                <div>
                <svg viewBox="0 0 24 24" aria-hidden="true" className='post-private' ><g><path d="M12 1.75C6.34 1.75 1.75 6.34 1.75 12S6.34 22.25 12 22.25 22.25 17.66 22.25 12 17.66 1.75 12 1.75zm-.25 10.48L10.5 17.5l-2-1.5v-3.5L7.5 9 5.03 7.59c1.42-2.24 3.89-3.75 6.72-3.84L11 6l-2 .5L8.5 9l5 1.5-1.75 1.73zM17 14v-3l-1.5-3 2.88-1.23c1.17 1.42 1.87 3.24 1.87 5.23 0 1.3-.3 2.52-.83 3.61L17 14z"></path></g></svg>
             
                </div>
                <span>Everyone can reply</span>
              
              </div>
              <div className='post-Retweet'>
                <button className='tweetPostbtn' onClick={() => {repost()}} >Post</button>
              </div>
            </div>
            </div>


      </div>
    </div>
  </div>
  )
}
