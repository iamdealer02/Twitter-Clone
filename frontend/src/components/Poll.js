import React from 'react'
import {requests} from '../constants/requests'
import instance from '../constants/axios'



export default function Poll({tweet, tweet_id, setTweets}) {
    // tweet here is individual tweet object (without UserDetails)
    const {question, options} = tweet.poll;
    const calculatePercent = (option) => {
       
        if (option?.voters?.length === 0 || option.voters === undefined) {
            return 0
        }
        const totalVotes = options.reduce((acc, option) => acc + option.voters.length, 0)
        if (totalVotes === 0) {
            return 0
        }
        const percent = (option.voters.length / totalVotes) * 100
        return percent
    }
    const calculateFillWidth = (option) => {
        // Calculate percentage here based on your logic
        if (option?.voters?.length === 0 || option.voters === undefined) {
          return '0%';
        }
        const percentage = calculatePercent(option);
      
        // Example: Set width based on percentage value
        return `${percentage}%`;
      };
      
      const addVote = async (optionId) => {
        try {
            const token = JSON.parse(localStorage.getItem('user')).token;
            instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const response = await instance.post(`${requests.addVote}${tweet_id}/${optionId}`);
            const updatedPoll = response.data.poll;

            
            // Update options array of the tweet's poll object with the new data
            setTweets(prevTweets => {
                return prevTweets.map(tweetItem => {
                    if (tweetItem.tweet._id === tweet_id) {
                        return { ...tweetItem, tweet: { ...tweetItem.tweet, poll: updatedPoll.poll } };
                    }
                    if (tweetItem.tweet.is_repost && tweetItem.tweet.reposted_from.tweet._id === tweet_id) {
                       
                        return {
                            ...tweetItem,
                            tweet: {
                                ...tweetItem.tweet,
                                reposted_from: {
                                    ...tweetItem.tweet.reposted_from,
                                    tweet: { ...tweetItem.tweet.reposted_from.tweet, poll: updatedPoll.poll }
                                }
                            }
                        };
                    }
                    return tweetItem;
                });
            });
            
        } catch(error) {
            console.log(error);
        }
    }
    

  return (
    <div>
        <div className='tweet-content'>
            <div className='tweet-text'> {question}</div>
            <div className='pollOptions'>
            {options?.map(option => (
                <div key={option._id} className='pollOption' onClick={()=> {addVote(option._id)}}>
                    <div className='pollBar' style={{width: calculateFillWidth(option)}}></div>
                    <div className='option'>{option.option}</div>
                    <div className='pollVotes'>
                        {/* percent */}
                        <p>{calculatePercent(option)}%</p>
                    </div>
                </div>
    
                ))}
            </div>
        </div>
        </ div>

  )
}
