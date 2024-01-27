import {BrowserRouter, Route, Routes} from 'react-router-dom';
import RegistrationPage from './views/RegistrationPage';
import LoginPage from './views/LoginPage';

import PublicRoute from './routes/PublicRoute';

function App() {
  return (
      
        <Routes>
          <Route element={<PublicRoute/>}>
            <Route path="/register" element={<RegistrationPage/>}/>
          </Route>
          <Route element={<PublicRoute/>}>
            <Route path="/login" element={<LoginPage/>}/>
          </Route>
        </Routes>
  );
}
export default App;
