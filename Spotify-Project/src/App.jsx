import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Components/Login/Login';
import Music from './Components/Music/Music';

function App() {
  const isAuthenticated = !!localStorage.getItem('access_token');

  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/callback' element={<Login />} />
        <Route path='/music' element={isAuthenticated ? <Music /> : <Navigate to="/login" />} />
        <Route path='/*' element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;