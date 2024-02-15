import React, {useState, useEffect,useRef} from 'react'
import '../styles/SearchBar.css'
import instance from '../constants/axios';
import { requests } from '../constants/requests';
import { useNavigate } from 'react-router-dom';
import UserProfile from './UserProfile';

export default function SearchBar({messaging=false}) {
    const [searchText, setSearchText] = useState('');
    const [searchList, setSearchList] = useState([]);
    const [onFocus, setOnFocus] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        // sending a backend search request
        const search = async () => {
            try {
                if (searchText ==='' || searchText === null || searchText === undefined){
                    setSearchList([]);
                }

                if ((searchText.trim()).length > 0){
                    // trim search text
                    const token = JSON.parse(localStorage.getItem('user')).token;
                    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    const response = await instance.get(`${requests.searchUser}/?keyword=${searchText}`);
                    var result = response.data.result;
                    if (result.length === 0 && searchText.length > 0){
                        setSearchList([]);
                        
                    }
                    setSearchList(result);
                 
                }

                
            } catch (error) {
                console.log(error);
            }
        }
        search();

    }, [searchText])

    const resultBoxRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
          if (resultBoxRef.current && !resultBoxRef.current.contains(event.target)) {
            setOnFocus(false); // Trigger onBlur only when clicking outside the result box
          }
        };
    
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []);
      const [receiver, setReceiver] = useState('');

      // get username from local storage user object
      const sender = JSON.parse(localStorage.getItem('user')).username;
      //  for messaging:
      const createChatRoom= (username) => {
        setReceiver(username);
      // create a new chat room
      if (sender !== '' && receiver !== '') {
          // send token in the header
                  window.location.href = `/messages/${receiver}`;

            
          }
  }
  
  


  return (
    <div className='searchArea'>
<div className="textarea-container">
  <input
    className="textarea"
    rows={2}
    onFocus={() => setOnFocus(true)}
  
    onChange={(e) => setSearchText(e.target.value)}
    value={searchText}
    placeholder="search users..."
  ></input>
 
</div>
        <div ref={resultBoxRef}>
        {(searchList.length > 0) && (onFocus) ? (
            <div className='searchResult'>
        {searchList.map((user, index) => (
            // navigate to different places if the search is from messaging or not
        <div key={index} onClick={() => {messaging ? createChatRoom(user.username) : navigate(`/profile/${user.username}`)}}>
            <UserProfile userProfileObj={{ username: user.username, name: user.name, profile_picture: user.profile_picture }} searchbox={true} />
        </div>
        ))}
            </div>
        ) : 
        (searchList.length === 0 && onFocus) ?
        <div className='noResult searchResult '> No result found</div>  : null
        }
        </div>




  </div>
  )
}
