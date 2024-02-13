import React, {useState, useEffect} from 'react'
import '../styles/editProfile.css'
import instance from '../constants/axios' 
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'


export default function EditProfile() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);



  const [editUserObj, setEditUserObj] = useState({
    name: '',
    bio:  '',
    location:  '',
    profile_picture: '',
    cover_picture: ''
  });



  const notify = (message) => toast.error(message);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = JSON.parse(localStorage.getItem('user')).token;
      const username = JSON.parse(localStorage.getItem('user')).username;
      instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const response = await instance.post(`/profile/edit/${username}`, { user_details: [editUserObj] });

      navigate(`/profile/${username}`)

      console.log(response.data.message);
      console.log(editUserObj)
      
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };


  const closeForm = async (e) => {
    const username = JSON.parse(localStorage.getItem('user')).username;
    navigate(`/profile/${username}`)
  }


  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
  
    if (type === 'file') {
      const file = e.target.files[0];
  
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setEditUserObj({ ...editUserObj, [name]: reader.result });
        };
        reader.readAsDataURL(file);
      } else {
        // Handle case when the user clears the file input
        setEditUserObj({ ...editUserObj, [name]: null });
      }
    } else {
      // Handle other input changes
      setEditUserObj({ ...editUserObj, [name]: value });
    }
  };
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const username = JSON.parse(localStorage.getItem('user')).username;
        const response = await instance.get(`/profile/${username}`);
        const userArray = response.data.user_details;

        if (userArray && userArray.length > 0) {
          const userData = userArray[0];


          setEditUserObj({
            name: userData.name,
            bio: userData.bio,
            location: userData.location,
          });

          setLoading(false);
        } else {
          notify('User details not found');
        }
      } catch (error) {
        notify('Error fetching details');
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []); 


  if (loading) {
    return <p>Loading...</p>;
  }





  return (
    <div>     

      
      <form className="edit-profile-form" onSubmit={handleEditSubmit}>
        <div className="profile-header">
          <h2>Edit Profile</h2>
          <button type="button" onClick={closeForm}>Close</button>
        </div>

        <div className="profile-form-fields">


        <label>cover_picture:</label>
          <input
            type="file"
            name="cover_picture"
            onChange={handleInputChange}           
          />

        <label>profile_picture:</label>
          <input
            type="file"
            name="profile_picture"
            onChange={handleInputChange}           
          />
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value = {editUserObj.name} onChange={handleInputChange} 

 
          
          />

          <label>Bio:</label>
          <input
            type="text"
            name="bio"
            value = {editUserObj.bio} onChange={handleInputChange}
     

           
          />

          <label>Location:</label>
          <input
            type="text"
            name="location"
            value = {editUserObj.location} onChange={handleInputChange}
            


         
          />
        </div>
        <div className='postBtnContainer'>
                <button className='tweetPostbtn' onClick={handleEditSubmit}>Post</button>
            </div>
      </form>



      
    </div>
 
  )

}



