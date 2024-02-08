import React, {useState, useEffect} from 'react'
import '../styles/SearchBar.css'
import instance from '../constants/axios';
import { requests } from '../constants/requests';


export default function SearchBar() {
    const [searchText, setSearchText] = useState('');
    const [searchList, setSearchList] = useState([]);
    const [onFocus, setOnFocus] = useState(false);
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
                    if (result.length === 0){
                        setSearchList([]);
                        
                    }
                    setSearchList(result);
                    console.log(searchList)
                    
                    
                }

                
            } catch (error) {
                console.log(error);
            }
        }
        search();

    }, [searchText])

  return (
    <div className='searchArea'>
        <div>
        <textarea type='text' onFocus={()=> {setOnFocus(!onFocus)}} onBlur={() => {setOnFocus(!onFocus)}} onChange={(e) => {setSearchText(e.target.value)}} value={searchText}  placeholder='Search' />
        </div>
        <div>
        {(searchList.length > 0) && (onFocus) ? (
            <div className='searchResult'>
            {searchList.map((user, index) => (
                <div className='userDetails' key={index}>
                    {/* check if image exists */}
                    <div className='profilePic'>
                    {
                    user.profile_pic ? 
                   
                    <img src={user.profile_pic} alt='profile' /> : 
                    <img src='https://cdn-icons-png.flaticon.com/128/64/64572.png'/> 
                }
                    </div>
                <div className='userCredential'>
                    { user.name ? <div className='fullname'>{user.name}</div> : null }
                    <div className='userName'> @ {user.username}</div>
                </div>

                
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
