import { Route, Routes} from 'react-router-dom';
import RegistrationPage from './views/RegistrationPage';
import LoginPage from './views/LoginPage';
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';
import HomePage from './views/HomePage';

import ProfilePage from './views/ProfilePage';
import MessagePage from './views/MessagePage';
import EditProfilePage from './views/EditProfilePage';
import FollowersPage from './views/FollowersPage';
import FollowingPage from './views/FollowingPage';
import SettingsPage from './views/SettingsPage';
import WelcomePage from './views/WelcomePage';
import BookmarkPage from './views/BookmarkPage';


import TweetPage from './views/TweetPage';


function App() {


  return ( 
        <Routes>
          <Route element={<PublicRoute/>}>
          <Route path="/" element={<WelcomePage/>}/>
          </Route>
          <Route element={<PublicRoute/>}>
            <Route path="/register" element={<RegistrationPage/>}/>
          </Route>
          <Route element={<PublicRoute/>}>
            <Route path="/login" element={<LoginPage/>}/>
          </Route>
          <Route element={<PrivateRoute/>}>
            <Route path="/home" element={<HomePage/>}/>
          </Route>
          <Route element={<PrivateRoute/>}>
            <Route path="/bookmarkview/:username" element={<BookmarkPage/>}/>
          </Route>

          <Route element={<PrivateRoute />}>
           <Route path={`/profile/:username`} element={<ProfilePage />} />
          </Route>


          {/* <Route element={<PrivateRoute />}>
           <Route path={`/profile/replies/:username`} element={<ProfileRepliesPage />} />
          </Route> */}


          <Route element={<PrivateRoute/>}>
            {/* pass socket */}
            <Route path="/messages" element={<MessagePage/>}/>
          </Route>
          <Route element={<PrivateRoute/>}>
            <Route path="/messages/:username" element={<MessagePage/>}/>
          </Route>

          

          <Route element={<PrivateRoute />}>
           <Route path={`/profile/edit/:username`} element={<EditProfilePage />} />
          </Route>

          <Route element={<PrivateRoute />}>
           <Route path={`/profile/:username/followers`} element={<FollowersPage />} />
          </Route>

          <Route element={<PrivateRoute />}>
           <Route path={`/profile/:username/following`} element={<FollowingPage />} />
          </Route>


          <Route element={<PrivateRoute/>}>
            <Route path="/settings/:username" element={<SettingsPage/>}/>
          </Route>
          <Route element={<PrivateRoute/>}>
            <Route path="/tweet/:tweet_id" element={<TweetPage/>}/>
          </Route>
        </Routes>
  );
}
export default App;
