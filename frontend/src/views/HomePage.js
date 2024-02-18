import React, {useState, useEffect} from 'react'
import '../styles/homePage.css'
import TaskBar from '../components/TaskBar'
import AddTweetBox from '../components/AddTweetBox'
import TweetBody from '../components/TweetList'
import instance from '../constants/axios';
import { requests } from '../constants/requests'  // api endpoints
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SearchBar from '../components/SearchBar'
import Recommendation from '../components/Recommendation'
import useSocket from '../hooks/useSocket' 
import TrendingHashtags from '../components/TrendingHashtags'

function HomePage() {
    const notify = (message) => toast.error(message); 
    const [tweets, setTweets] = useState([]); 
    const {state} = useSocket();
    const socket = state.socket;

    useEffect(() => { 
        const fetchTweets = async () => {
          try {
            const token = JSON.parse(localStorage.getItem('user')).token; // Get user token from localStorage 
            instance.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Set Authorization header with token
            const response = await instance.get(requests.getTweet); // Make GET request to fetch tweets
            setTweets(response.data.tweetsData); // Set fetched tweets to state
           
          } catch (error) { 
            console.error('Error fetching tweets:', error);
          }
        };
    
        fetchTweets(); 
  
      }, []); 
      


      useEffect(() => {
        // Function to handle receiving tweet
        const handleReceiveTweet = (data) => {
          setTweets((prevTweets) => [data, ...prevTweets]);
        };
      
        // Function to handle receiving like
        const handleReceiveLike = (data) => {
          setTweets((prevTweets) => {
            return prevTweets.map((tweetItem) => {
              if (tweetItem.tweet._id === data.tweetId) {
                return {
                  ...tweetItem,
                  tweet: {
                    ...tweetItem.tweet,
                    like: data.like
                  }
                };
              }
              return tweetItem;
            });
          });
        };
      
        // Function to handle receiving reply
        const handleReceiveReply = (data) => {
          setTweets((prevTweets) => {
            return prevTweets.map((tweetItem) => {
              if (tweetItem.tweet._id === data.tweetId) {
                return {
                  ...tweetItem,
                  tweet: {
                    ...tweetItem.tweet,
                    comment_count: data.comment_count
                  }
                };
              }
              return tweetItem;
            });
          });
        };
      
        const handleReceiveRetweet = (data) => {
          setTweets((prevTweets) => {
            return prevTweets.map((tweetItem) => {
              if (tweetItem.tweet._id === data.tweetId) {
                return {
                  ...tweetItem,
                  tweet: {
                    ...tweetItem.tweet,
                    retweet_count: data.retweet_count
                  }
                };
              }
              return tweetItem;
            });
          });
        }




        // Attach event listeners
        socket.on('receive_tweet', handleReceiveTweet);
        socket.on('receive_like', handleReceiveLike);
        socket.on('receive_reply', handleReceiveReply);
        socket.on('receive_retweet', handleReceiveRetweet);
      
        // Cleanup function
        return () => {
          // Remove event listeners
          socket.off('receive_tweet', handleReceiveTweet);
          socket.off('receive_like', handleReceiveLike);
          socket.off('receive_reply', handleReceiveReply);
          socket.off('receive_retweet', handleReceiveRetweet);
        };
      }, []);
      



          // set the entire tweet obj
    // send an axios call to backend for posting the tweet
    // username, profile_pic, name for user obj
    const [userProfileObj, setUserProfileObj] = useState({
        id: '',
        username: '',
        profile_pic: '',
        name: ''
    })
    // getting user data from the backend
    useEffect(() => {
        const fetchData = async () => {
          try {
    
            // access token from local storage
            const token = JSON.parse(localStorage.getItem('user')).token;
            // access username from local storage
            const username = JSON.parse(localStorage.getItem('user')).username;       
            instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
            // send request to backend to retrieve data and store it as response
            const response = await instance.get(`/profile/${username}`);
            // extract user_detaisl from the response    
            const userArray = response.data.user_details;
            if (userArray && userArray.length > 0) {
              //assigning the user details of the user
              const userData = userArray[0];
          
              //update the components state with extracted data from backend 

              setUserProfileObj({
                id: userData._id,
                name: userData.name,
                username: userData.username,
                profile_picture: userData.profile_picture
              });

            } else {
              
              notify('usr details not found');
            }
          
          } catch (error) {
            notify('error fetching details');
            console.error('error :', error);
          }
        };
    
        fetchData(); 
      }, []); 



  return (
    <div>
                <ToastContainer 
    position='top-center'
    hideProgressBar={true}
    newestOnTop={false}
    closeOnClick
    theme='dark'
    />
        <div className='homeContainer'>
            <div className='homeTaskbar'>
                <TaskBar/>
            </div>
        
            <div className='homeFeed'>
                {/* add a following and a for you section before */}
                {/* addTweetBox */}
                <AddTweetBox setTweets={setTweets} userProfileObj={userProfileObj}/>
            <div className='homeNewsFeed' ></div>
                <TweetBody tweets={tweets} setTweets={setTweets} userProfileObj={userProfileObj}/>
                
            </div>
            <div className='homeWidgets'>
                <SearchBar/>
                <Recommendation/>
                <TrendingHashtags/>
               
            </div>
        </div>
    </div>
  )
}

export default HomePage