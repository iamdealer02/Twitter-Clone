import { Route, Routes} from 'react-router-dom';
import RegistrationPage from './views/RegistrationPage';
import LoginPage from './views/LoginPage';
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';
import HomePage from './views/HomePage';

import ProfilePage from './views/ProfilePage';
import MessagePage from './views/MessagePage';
import EditProfilePage from './views/EditProfilePage';

function App() {
  return (
      
        <Routes>
          <Route element={<PublicRoute/>}>
            <Route path="/register" element={<RegistrationPage/>}/>
          </Route>
          <Route element={<PublicRoute/>}>
            <Route path="/login" element={<LoginPage/>}/>
          </Route>
          <Route element={<PrivateRoute/>}>
            <Route path="/home" element={<HomePage/>}/>
          </Route>

          <Route element={<PrivateRoute />}>
           <Route path={`/profile/:username`} element={<ProfilePage />} />
          </Route>
          <Route element={<PrivateRoute/>}>
            <Route path="/messages" element={<MessagePage/>}/>
          </Route>

          <Route element={<PrivateRoute />}>
           <Route path={`/profile/edit/:username`} element={<EditProfilePage />} />
          </Route>
        </Routes>
  );
}
export default App;
