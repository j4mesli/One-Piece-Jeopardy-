import { useNavigate } from "react-router-dom";
import LogoutResponse from "../../types/LogoutResponse";
import UserSession from "../../types/UserSession";
import "./Header.css";

function Header() {
  const navigate = useNavigate();
  const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    const session: UserSession = JSON.parse(sessionStorage.getItem('session')!);
    
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('username', session.username);
    headers.append('sessionId', session.sessionId);
    try {
      const response = await fetch('https://one-piece-jeopardy-backend-d2ca7583addf.herokuapp.com//logout', {
        method: 'POST',
        headers: headers,
      });
      const result: LogoutResponse = await response.json();
      if (result.status === 201) {
        sessionStorage.removeItem('session');
        if (sessionStorage.getItem('recentGame')) {
          sessionStorage.removeItem('recentGame');
        }
        // throw flag to update session state of user information
        window.updateSessionState();
        navigate('/');
      }
      else {
        alert(result.message);
      }
    }
    catch (error) {
      console.error('Error during form submission:', error);
    }
  };
  const handleProfile = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    navigate('/profile');
  };
  const handleGame = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    navigate('/');
  };
  const handleLeaderboard = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    navigate('/leaderboard');
  };

  return (
    <div className="header">
      <a title="Game" className="link" onClick={ handleGame }>
        <span className="material-symbols-outlined">
          sports_esports
        </span>
      </a>
      <a title="Leaderboard" className="link" onClick={ handleLeaderboard }>
        <span className="material-symbols-outlined">
          social_leaderboard
        </span>
      </a>
      <a title="Profile" className="link" onClick={ handleProfile }>
        <span className="material-symbols-outlined">
          account_circle
        </span>
      </a>
      <a title="Logout" className="link" onClick={ handleLogout }>
        <span className="material-symbols-outlined">
          logout
        </span>
      </a>
    </div>
  );
}

export default Header;
