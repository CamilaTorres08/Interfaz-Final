import './App.css';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Register from './components/Register/index'
import Login from './components/Login/index'
import UserRouter from './components/User/index';
import Tasks from './components/Tasks/Tasks';
import Insight from './components/Insights'
import ProtectedRoute from './components/ProtectedRoutes/ProtectedRoute'
function App() {
  
  return (
    <BrowserRouter>
        <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/Register" element={<Register />} />
              <Route path="/user" element={<UserRouter />}>
              <Route index element={<Tasks />} />
              <Route path="insights" element={<ProtectedRoute><Insight /></ProtectedRoute>} />
            </Route>
        </Routes>
  </BrowserRouter>
  
  );
};

export default App;