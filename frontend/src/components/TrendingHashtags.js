import React, {useEffect, useState} from 'react'
import instance from '../constants/axios'
import { requests } from '../constants/requests'
import '../styles/trendingHashtags.css'

export default function TrendingHashtags() {
    const [hashtags, setHashtags] = useState([]);
    // sending backend request to get trending hashtags
    // and displaying them in the trending-hashtags-list
    const fetchHashtags = async () => {
        try {
            const response = await instance.get(requests.getHashtags);
            // Extract hashtags from the response data
            console.log(response);
            const extractedHashtags = response.data.hashtags;
            
            // Set the state with the extracted hashtags
            setHashtags(extractedHashtags);
        } catch(error) {
            console.error("Error fetching hashtags:", error);
        }
    }
    
    useEffect(() => {
        fetchHashtags();
    }, []);

  return (
    <div>
        <div className="trending-hashtags">
            <div className="trending-hashtags-title">
                Trends
            </div>
            <div className="trending-hashtags-list">
                {
                   hashtags? hashtags.map((hashtag, index) => {
                        return (
                            <div key={index} className="trending-hashtags-item">
                                <div className='hashtag-trending'> Trending </div>
                                <div className='hashtag-keyword'> {hashtag._id} </div>
                                <div className='hashtag-count'> {hashtag.count} posts </div>

                            </div>
                        )
                    }) : <div className='no-trending'> No trending hashtags </div>
                }
            </div>
        </div>
    </div>
  )
}