import React,{useState, useEffect} from 'react'
import TaskBar from '../components/TaskBar';
import SearchBar from '../components/SearchBar';
import Recommendation from '../components/Recommendation';
import TrendingHashtags from '../components/TrendingHashtags';
import '../styles/homePage.css';
import instance from '../constants/axios';
import { requests } from '../constants/requests';
import { useParams } from 'react-router-dom';
import MiniUserDetail from '../components/MiniUserDetail';
import InteractionButtons from '../components/interactionButtons';

function TweetPage() {
    const [tweets, setTweets] = useState([]);
    const {tweet_id} = useParams();
    const getTweetDetail = async () => {
        
        console.log(tweet_id);
        try {
          const token = JSON.parse(localStorage.getItem('user')).token; // Get user token from localStorage 
          instance.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Set Authorization header with token
          const response = await instance.get(`${requests.getTweetById}${tweet_id}`); // Make GET request to fetch tweets
          setTweets(response.data); 
         
        } catch (error) { 
          console.error('Error fetching tweets:', error);
        }
      };
 

      useEffect(() => { 

        if(tweet_id ){
            console.log(tweet_id);
            getTweetDetail();
        }
     
      }, []);
      console.log(tweets)

  return (
    <div>
        <div className='homeContainer'>
            <div className='homeTaskbar'>
                <TaskBar/>
            </div>
        
            <div className='homeFeed'>
    {/* tweet has : tweet,comments,userProfileObj */}
    {/* {
        tweets ?
        <MiniUserDetail tweet={tweets.tweet.tweet} user={tweets.tweet.userDetails} createdAt={tweets.tweet.tweet.createdAt} setTweets={setTweets}/>:
        null
} */}
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

export default TweetPage;