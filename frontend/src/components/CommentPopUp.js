import React, {useState} from 'react'
import MiniUserDetail from './MiniUserDetail'
import { requests} from '../constants/requests'
import instance from '../constants/axios'
import useSocket from '../hooks/useSocket'

export default function CommentPopUp({commentPopUp, setCommentPopUp, tweet, setTweets, userProfileObj}) {
    const {state} = useSocket();
    const socket = state.socket;
  // tweet object with tweet and userDetails
  const [comment, setComment] = useState('');
  const addComment = async () => {
    try {
      setCommentPopUp(!commentPopUp)
        const token = JSON.parse(localStorage.getItem('user')).token;
        instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const tweetId = tweet.tweet._id;
        const response = await instance.post(requests.addComment + '/' + tweetId, {comment});
        console.log('response:', response);

        setTweets(prevTweets => {
            return prevTweets.map(tweetItem => {
                if (tweetItem.tweet._id === tweetId) {
                    return {
                        ...tweetItem,
                        tweet: {
                            ...tweetItem.tweet,
                            comment_count: response.data.comment_length
                        }
                    };
                }
                return tweetItem;

            });
        // send a message to socket

        });
        const type='reply';
        const data = {
            tweetId: tweet.tweet._id, comment_count: response.data.comment_length}
        socket.emit('live_feed', {type, data});
    } catch(error) {
        console.log(error);
    }
  }

  return (
    <div className='quote-retweet-pop-up'>
    <div className='close-quote-retweet-pop-up' onClick={() => setCommentPopUp(!commentPopUp)}> X </div>
    <div>
      <div className='comment-user-profile-input'>

            <div className='quote-input'>
            <div className='comment-original-post'>
            {
                <>
                 <MiniUserDetail key={tweet.tweet.id} user={tweet.userDetails} tweet={tweet.tweet} createdAt={tweet.tweet.createdAt} />
              
                </>

               
            }
      
        
            </div>
            <div className='comment-input-btn'>
                <div className='userProfilePic'>
                    {userProfileObj.profile_pic ?  
                        <img src={userProfileObj.profile_pic} alt='profile' /> : 
                        <img src='https://cdn-icons-png.flaticon.com/128/5460/5460794.png' alt='default profile' /> 
                    }
                </div>
                <textarea onChange={(e)=> setComment(e.target.value)} className='quote-input-textarea' type="text" placeholder="Add a comment" />
                <div className='post-Retweet'>
                    <button className='tweetPostbtn' onClick={()=> addComment()} >Post</button>
                </div>
            </div>
            </div>
      </div>
    </div>
  </div>
  )
}
