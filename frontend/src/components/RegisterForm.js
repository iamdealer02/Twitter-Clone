import React, {useState} from 'react'
import '../styles/registerForm.css'
import instance from '../constants/axios'  // axios instance
import { requests } from '../constants/requests'  // api endpoints
import useAppStateContext from '../hooks/useAppStateContext'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RegisterForm() {
    const {dispatch} = useAppStateContext();
    const navigate = useNavigate();
    
    const notify = (message) => toast.error(message); 
  

    const [user, setUser] = useState({
        email: '',
        username: '',
        password: ''
    })
    const [loader, setLoader] = useState(false)
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        
        if (
            !user.email ||
            !user.username ||
            !user.password
        ) {
            notify('All fields are required')
            return;
            
        }else{
            setLoader(true)
            instance.post(requests.register, user)
            .then((response) => {
                console.log(response);
                console.log(response.data.message)
                dispatch({
                    type: 'Login',
                    payload:{
                        token: response.data.message,
                        email: user.email,
                        username: user.username,
                    },
                });
                navigate('/home')
            }) 
            .catch((error) => {
                setLoader(false)
            
                notify(error.response.data.message);
            });
        }
    }; 


  return (
    <>
    {loader && <div className='loader'></div>  }
    <ToastContainer 
    position='top-center'
    hideProgressBar={true}
    newestOnTop={false}
    closeOnClick
    theme='dark'
    />
        <div className='formLogo'>
    <div className='logo'>
    <svg className='logoDisplay' fill="#ffffff" viewBox='0 0 24 24'>
    <g >
        <path  d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z">
        </path>
    </g>
</svg>
    </div>
    <div className='formTitle'>
        <span className='heading'>
            Happenning now
        </span>
        {/* new line */}
        <br/>
        <span className='subHeading'>
            Join Twitter today.
        </span>
        <form method='GET' className='registrationForm' onSubmit={handleFormSubmit} >
        
            <div className="form-group">
            <label htmlFor="email" className="h5 mb-2">
                What is your email?
            </label>
            <input 
                className="form-control bg-light"
                type="text"
                id="email"
                placeholder="Enter your email"
                onChange={(e) => {setUser({...user, email: e.target.value})}}
                
            />
            </div>
            <div className="form-group">
            <label htmlFor="username" >
                Choose a username
            </label>
            <input 
                className="form-control bg-light"
                type="text"
                id="username"
                placeholder="Enter your preferred username"
                onChange={(e) => {setUser({...user, username: e.target.value})}}
                
            />
            </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            className="form-control bg-light"
            id="password"
            placeholder="Enter your password"
            type="password"
            onChange={(e) => {setUser({...user, password: e.target.value})}}
           
          />
        </div>
        <div className="form-group">
          <button type="submit" className="btn btn-info btn-block">
            Register
          </button>
        </div>
      </form>
                <div className="loginDiv">
                <hr className = "LoginPagehr"/>
                      <span className="or-text ">or</span>
                    <hr className = "LoginPagehr"/>
                </div>
                
                <div className="loginMethod">
                    <button className="btn btn-light mb-2 btn-block"><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="40" height="20" viewBox="0 0 48 48">
                        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                        </svg>  Continue with Google </button>
                    <button className="btn btn-light mb-2 btn-block"><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="40" height="20" viewBox="0 0 30 30">
                        <path d="M25.565,9.785c-0.123,0.077-3.051,1.702-3.051,5.305c0.138,4.109,3.695,5.55,3.756,5.55 c-0.061,0.077-0.537,1.963-1.947,3.94C23.204,26.283,21.962,28,20.076,28c-1.794,0-2.438-1.135-4.508-1.135 c-2.223,0-2.852,1.135-4.554,1.135c-1.886,0-3.22-1.809-4.4-3.496c-1.533-2.208-2.836-5.673-2.882-9 c-0.031-1.763,0.307-3.496,1.165-4.968c1.211-2.055,3.373-3.45,5.734-3.496c1.809-0.061,3.419,1.242,4.523,1.242 c1.058,0,3.036-1.242,5.274-1.242C21.394,7.041,23.97,7.332,25.565,9.785z M15.001,6.688c-0.322-1.61,0.567-3.22,1.395-4.247 c1.058-1.242,2.729-2.085,4.17-2.085c0.092,1.61-0.491,3.189-1.533,4.339C18.098,5.937,16.488,6.872,15.001,6.688z"></path>
                    </svg> Continue with Apple </button>
                    
                </div>
                <div className="loginDiv">
                    <hr className = "LoginPagehr"  />
                        <span className="or-text">or</span>
                    <hr className = "LoginPagehr"  />
                </div>
                
                <div className="pageFooter">Already have an account? </div>
                <button className="btn btn-info btn-block " onClick={()=> navigate('/login')}>Login</button>
    </div>


            
    </div>
    </>

    
  )
}
