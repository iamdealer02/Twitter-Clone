import { Route, Routes} from 'react-router-dom';
import RegistrationPage from './views/RegistrationPage';
import LoginPage from './views/LoginPage';
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';
import HomePage from './views/HomePage';
import MessagePage from './views/MessagePage';
import io from "socket.io-client";
const socket = io.connect("http://localhost:8080");

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
          <Route element={<PrivateRoute/>}>
            <Route path="/messages" element={<MessagePage/>}/>
          </Route>
        </Routes>
  );
}
export default App;
