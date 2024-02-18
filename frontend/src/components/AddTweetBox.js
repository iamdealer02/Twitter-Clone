import React, {useState, useEffect} from 'react'
import '../styles/addTweetBox.css'
import axios from 'axios';
import instance from '../constants/axios'  // axios instance
import {requests} from '../constants/requests'  // api endpoints





export default function AddTweetBox({setTweets, userProfileObj}) {
    const [imageURL, setImageURL] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [tweetObj, setTweetObj] = useState({
        tweet: '',
        image: '',
        gif: '',
        poll: {
            question: '',
            options: ['', ''],
        },
        emoji: null,
        schedule: null,
    })



    const handleTweetSubmit = async (e) => {
        e.preventDefault();
    
        // Construct FormData object
        const formData = new FormData();
        // Append JSON data
  
        formData.append('tweet', tweetObj.tweet);
        console.log(tweetObj.tweet)
        formData.append('gif', tweetObj.gif);
        formData.append('poll', JSON.stringify(tweetObj.poll));
        formData.append('emoji', tweetObj.emoji);
        formData.append('schedule', tweetObj.schedule);
        // Append image file
        formData.append('image', tweetObj.image);


        try {
            // Access the token from local storage
            const token = JSON.parse(localStorage.getItem('user')).token;
            // Set the token in the header
            instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            // Send the request to the backend
            const response = await instance.post(requests.addTweet, formData, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
            });
            // Handle response
            setTweets((prevTweets) => {
                return [{ tweet: response.data.tweet, userDetails: userProfileObj }, ...prevTweets];
            });
            // Reset tweetObj state
            setTweetObj({
                tweet: '',
                image: '',
                gif: '',
                poll: {
                    question: '',
                    options: ['', ''],
                },
                emoji: null,
                schedule: null,
            });
        } catch (error) {
            console.error('Error submitting tweet:', error);
        }
    };
    
         
   const [isPollValid, setIsPollValid] = useState(false);
    useEffect(() => {
        const { question, options } = tweetObj.poll;
       // check options array and if array has empty string remove it from teh array
        options.forEach((option, index) => {
              if (option.trim() === '') {
                    options.splice(index, 1);
                }
            });
     
        setIsPollValid(question && options.length >= 2);
     
      
    }, [tweetObj.poll]);



    const [gifs, setGifs] = useState(null);
    const [openPoll, setOpenPoll] = useState(false);
    
    const searchGifs = async () => {
        try {
            const apiKey ='UgmwxIMrBeWlHyvQmTJDKFkdOJ2Gt2eT';
            const url = `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=25&offset=0&rating=g&bundle=messaging_non_clips`;
            const response = await axios.get(url); 
            setGifs(response.data.data);
        } catch (error) {
            console.error('Error fetching GIFs:', error);
        }
    };
    const handleMediaChange = (e) => {
        const file = e.target.files[0]; // Get the selected media file
        setTweetObj({ ...tweetObj, image: file }); // Assuming tweetObj has a media property to store the selected media file
        console.log(tweetObj.media);
    
        const reader = new FileReader();
    
        reader.onload = () => {
            if (file.type.startsWith('image')) {
                // Handle image file
                setImageURL(reader.result);
            } else if (file.type.startsWith('video')) {
                // Handle video file
                setVideoUrl(reader.result);
            }
        };
    
        reader.readAsDataURL(file); // Start reading the media file as a data URL
    };
    


    // const searchEmojis = async () => {
    //     try {
    //         const apiKey = 'UgmwxIMrBeWlHyvQmTJDKFkdOJ2Gt2eT';
    //         const url =`https://api.giphy.com/v2/emoji?api_key=${apiKey}&limit=50&offset=0`
    //         const response = await axios.get(url);
    //         console.log(response.data.data);
    //     }catch (error) {
    //         console.error('Error fetching GIFs:', error);
    //     }

    // }


  return (
  <>
    <div className='addTweetBox'>
       <div className='addTweetForm'>
              <img className='tweetProfilePic' src={userProfileObj.profile_picture ? userProfileObj.profile_picture : 'https://cdn-icons-png.flaticon.com/128/5460/5460794.png'} alt='profile pic'/>
              {openPoll ? 
              (<div className='tweetPollForm'>
                <input type='text'  placeholder='Ask a question' value={tweetObj.poll.question} onChange={(e) => {
                        setTweetObj({
                            ...tweetObj, 
                            poll: {
                                ...tweetObj.poll,
                                question: e.target.value
                            }
                        });
                    }}
                />
                    <div className='tweetPollOptions'>
                    <input 
                        type='text'  
                        placeholder='Option 1' 
                        value={tweetObj.poll.options[0]}
                        onChange={(e) => {
                            setTweetObj({
                                ...tweetObj, 
                                poll: {
                                    ...tweetObj.poll,
                                    options: [e.target.value, ...tweetObj.poll.options.slice(1)]
                                } 
                            });
                        }}
                    />
                        <div className='extraOption'>
                            <input 
                                type='text'  
                                value={tweetObj.poll.options[1]}
                                placeholder='Option 2' 
                                onChange={(e) =>{
                                    setTweetObj({
                                        ...tweetObj, 
                                        value: tweetObj.poll.options[1],
                                        poll: {
                                            ...tweetObj.poll,
                                            options: [tweetObj.poll.options[0], e.target.value]
                                        }
                                    });
                                }}
                            />


                            <button className='addOptionBtn '>+</button>
                        </div>
                    </div>
                    <div className='tweetPollFooter'>
                        <button onClick={() => {setOpenPoll(!openPoll)}} >Remove Poll</button>
                    </div>
                    

              </div>
                ): 
              (<div className='tweetInputForm'> 
              <input type='text' value={tweetObj.tweet}  onChange={(e) => {setTweetObj({...tweetObj, tweet:e.target.value})}}  placeholder="What's happening?!"/>
          </div>) }

        </div>

        <div className='currentSelection'>

    {
        // read the image and display it
        tweetObj.image && imageURL ? <img src={imageURL} alt='tweetImage' /> : null
        
    }
    {
        tweetObj.image && videoUrl ? <video src={videoUrl} alt='tweetVideo' controls /> : null
    }

        {tweetObj.gif && (
            <img src={tweetObj.gif}  alt='tweetGif' />
        )}
            {tweetObj.image || tweetObj.gif ? (<div className='closeCurrentSelection' onClick={() => {setTweetObj({...tweetObj, image: '', gif: ''})}}>X</div>) : null}
        </div>


        <div className='tweetToolsContainer'>
            <div className='tweetTools'>
            <label htmlFor="inputImage" className='tweetImage tweetbtn'>
                <svg className='iconsvg' fill='#1D9BF0 ' viewBox="0 0 24 24"  aria-hidden="true">
                    <g>
                    <path d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v9.086l3-3 3 3 5-5 3 3V5.5c0-.276-.224-.5-.5-.5h-13zM19 15.414l-3-3-5 5-3-3-3 3V18.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-3.086zM9.75 7C8.784 7 8 7.784 8 8.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75S10.716 7 9.75 7z"></path>
                    </g>
                </svg>
                <input
                    id="inputImage"
                    className='inputImageDiv'
                    type="file"
                    // accept both image and video files
                    accept="image/*,video/*"
                    name="myImage"
                    onChange={handleMediaChange}
                  
                    />
                </label>
                {/* sends a request to an api  */}
                    <button className='tweetGif tweetbtn' onClick={searchGifs}>
                        <svg className='iconsvg' viewBox="0 0 24 24" fill='#1D9BF0 ' aria-hidden="true" ><g><path d="M3 5.5C3 4.119 4.12 3 5.5 3h13C19.88 3 21 4.119 21 5.5v13c0 1.381-1.12 2.5-2.5 2.5h-13C4.12 21 3 19.881 3 18.5v-13zM5.5 5c-.28 0-.5.224-.5.5v13c0 .276.22.5.5.5h13c.28 0 .5-.224.5-.5v-13c0-.276-.22-.5-.5-.5h-13zM18 10.711V9.25h-3.74v5.5h1.44v-1.719h1.7V11.57h-1.7v-.859H18zM11.79 9.25h1.44v5.5h-1.44v-5.5zm-3.07 1.375c.34 0 .77.172 1.02.43l1.03-.86c-.51-.601-1.28-.945-2.05-.945C7.19 9.25 6 10.453 6 12s1.19 2.75 2.72 2.75c.85 0 1.54-.344 2.05-.945v-2.149H8.38v1.032H9.4v.515c-.17.086-.42.172-.68.172-.76 0-1.36-.602-1.36-1.375 0-.688.6-1.375 1.36-1.375z"></path></g></svg>
                    </button>
                    { gifs ? (<div className='gifPopup'>
                    <div className='gifHeader' onClick={()=> {setGifs(null)}}> X </div>
                        <div className='gifContainer'>
                            {gifs.map((gif, index) => (
                                    <img key={index} src={gif.images.fixed_height.url} className={ tweetObj.gif === gif.images.fixed_height.url ? 'selectedGIF' : null  } alt='gif' onClick={() => {setTweetObj({...tweetObj, gif: gif.images.fixed_height.url, image: '', poll: {
                                    question: '',
                                    options: ['',''] 
                                }});
                                setGifs(!gifs);
                            } } />
                                ))}
                        </div>
                    </div>) : (null ) }
                    <button className='tweetPoll tweetbtn' onClick={() => {setOpenPoll(!openPoll); setTweetObj({...tweetObj, image: '', gif: ''});}}>
                        <svg className='iconsvg' viewBox="0 0 24 24" fill='#1D9BF0 ' aria-hidden="true" ><g><path d="M6 5c-1.1 0-2 .895-2 2s.9 2 2 2 2-.895 2-2-.9-2-2-2zM2 7c0-2.209 1.79-4 4-4s4 1.791 4 4-1.79 4-4 4-4-1.791-4-4zm20 1H12V6h10v2zM6 15c-1.1 0-2 .895-2 2s.9 2 2 2 2-.895 2-2-.9-2-2-2zm-4 2c0-2.209 1.79-4 4-4s4 1.791 4 4-1.79 4-4 4-4-1.791-4-4zm20 1H12v-2h10v2zM7 7c0 .552-.45 1-1 1s-1-.448-1-1 .45-1 1-1 1 .448 1 1z"></path></g></svg>
                    </button>
                    <button className='tweetEmoji tweetbtn' >
                        <svg className='iconsvg' viewBox="0 0 24 24" fill='#1D9BF0 ' aria-hidden="true" ><g><path d="M8 9.5C8 8.119 8.672 7 9.5 7S11 8.119 11 9.5 10.328 12 9.5 12 8 10.881 8 9.5zm6.5 2.5c.828 0 1.5-1.119 1.5-2.5S15.328 7 14.5 7 13 8.119 13 9.5s.672 2.5 1.5 2.5zM12 16c-2.224 0-3.021-2.227-3.051-2.316l-1.897.633c.05.15 1.271 3.684 4.949 3.684s4.898-3.533 4.949-3.684l-1.896-.638c-.033.095-.83 2.322-3.053 2.322zm10.25-4.001c0 5.652-4.598 10.25-10.25 10.25S1.75 17.652 1.75 12 6.348 1.75 12 1.75 22.25 6.348 22.25 12zm-2 0c0-4.549-3.701-8.25-8.25-8.25S3.75 7.451 3.75 12s3.701 8.25 8.25 8.25 8.25-3.701 8.25-8.25z"></path></g></svg>
                    </button>
                    <button className='tweetSchedule tweetbtn'>
                        <svg className='iconsvg' viewBox="0 0 24 24" fill='#1D9BF0 ' aria-hidden="true"><g><path d="M6 3V2h2v1h6V2h2v1h1.5C18.88 3 20 4.119 20 5.5v2h-2v-2c0-.276-.22-.5-.5-.5H16v1h-2V5H8v1H6V5H4.5c-.28 0-.5.224-.5.5v12c0 .276.22.5.5.5h3v2h-3C3.12 20 2 18.881 2 17.5v-12C2 4.119 3.12 3 4.5 3H6zm9.5 8c-2.49 0-4.5 2.015-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.015 4.5-4.5-2.01-4.5-4.5-4.5zM9 15.5C9 11.91 11.91 9 15.5 9s6.5 2.91 6.5 6.5-2.91 6.5-6.5 6.5S9 19.09 9 15.5zm5.5-2.5h2v2.086l1.71 1.707-1.42 1.414-2.29-2.293V13z"></path></g></svg>
                    </button>
            </div>
            {tweetObj.tweet || tweetObj.image || tweetObj.gif || isPollValid ?  ( <div className='postBtnContainer'>
                <button className='tweetPostbtn' onClick={handleTweetSubmit}>Post</button>
            </div>)  : (<div className='postBtnContainer'>
                <button className='cannotPostBtn'>Post</button>
            </div>)  }

        </div>
    </div>
    </>
  )
}
