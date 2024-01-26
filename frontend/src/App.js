import {BrowserRouter, Route, Routes} from 'react-router-dom';
import RegistrationPage from './views/RegistrationPage';

import PublicRoute from './routes/PublicRoute';

function App() {
  return (
      
        <Routes>
          <Route element={<PublicRoute/>}>
            <Route path="/register" element={<RegistrationPage/>}/>
          </Route>
        </Routes>
  );
}
export default App;
