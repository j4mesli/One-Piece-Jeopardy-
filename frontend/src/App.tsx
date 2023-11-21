import { useCallback, useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Header from './views/Header/Header';
import Login from './views/Login/Login';
import Register from './views/Register/Register';
import Game from './views/Game/Game';
import Profile from './views/Profile/Profile';
import LoggedInRoute from './components/Auth/LoggedInRoute';
import LoggedOutRoute from './components/Auth/LoggedOutRoute';
import UserSession from './types/UserSession';
import Leaderboard from './views/Leaderboard/Leaderboard';
// import Player from './components/Music/Player';

// make our project aware of the custom property we add to Window
declare global {
  interface Window {
    updateSessionState: () => void;
  }
}

function App() {
  const [hasSession, setHasSession] = useState<boolean>(sessionStorage.getItem('session') !== null);
  // const [showPlayer, setShowPlayer] = useState(false);

  const updateSessionState = useCallback(() => {
    setHasSession(sessionStorage.getItem('session') !== null);
  }, []);

  useEffect(() => {
    window.updateSessionState = updateSessionState;
  }, [updateSessionState]);

  useEffect(() => {
    const verifySession = async () => {
      const sessionData = sessionStorage.getItem('session');
      if (!sessionData) {
        console.log('No session data available.');
        setHasSession(false);
        return;
      }

      const session: UserSession = JSON.parse(sessionData);
      
      try {
        const response = await fetch('https://one-piece-jeopardy-backend-d2ca7583addf.herokuapp.com/verifySession', {
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
          setHasSession(false);
          window.location.href = '/login';
        }
        else {
          console.log("Session verified!");
          setHasSession(true);
        }
      }
      catch (error) {
        console.log('Error verifying session');
        sessionStorage.removeItem('session');
        setHasSession(false);
        window.location.href = '/login';
      }
      window.updateSessionState = updateSessionState;
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'session') {
        setHasSession(!!e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    verifySession();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [hasSession, updateSessionState]);

  return (
    <div className="App container">
      <BrowserRouter>
        {hasSession && <Header />}
        <h1 className="App-title one-piece">ONE P<span style={{ color: '#D70000' }}>I</span>ECE JEOPARDY!</h1>
        <Routes>
          <Route element={<LoggedOutRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          <Route element={<LoggedInRoute />}>
            <Route path="/game" element={<Game />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
      {/* <Player showMenu={showPlayer} togglePlayer={setShowPlayer} /> */}
    </div>
  );
}

export default App;
