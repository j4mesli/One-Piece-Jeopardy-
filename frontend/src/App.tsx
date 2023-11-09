import { useEffect } from 'react';
import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Header from './views/Header/Header';
import Login from './views/Login/Login';
import Register from './views/Register/Register';
import Game from './views/Game/Game';
import Profile from './views/Profile/Profile';
import LoggedInRoute from './components/LoggedInRoute';
import LoggedOutRoute from './components/LoggedOutRoute';
import UserSession from './types/UserSession';

function App() {
  useEffect(() => {
    const session: UserSession = JSON.parse(sessionStorage.getItem('session')!);
    const verifySession = async () => {
      try {
        const response = await fetch('http://localhost:3000/verifySession', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            username: session.username,
            sessionId: session.sessionId,
          },
        });

        const data = await response.json();
        if (data.status !== 201) {
          sessionStorage.removeItem('session');
          console.log("Improper session, logging out");
          // can't use useNavigate() here because we're not in a route
          window.location.href = '/login';
        }
        else {
          console.log("Session verified!");
        }
      } catch (error) {
        console.log('not logged in');
      }
    };

    verifySession();
  });

  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route element={<LoggedOutRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          <Route element={<LoggedInRoute />}>
            <Route path="/game" element={<Game />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
