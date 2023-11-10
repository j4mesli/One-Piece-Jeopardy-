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
      const response = await fetch('https://-jeopardy-backend-d2ca7583addf.herokuapp.com/logout', {
        method: 'POST',
        headers: headers,
      });
      const result: LogoutResponse = await response.json();
      if (result.status === 201) {
        sessionStorage.removeItem('session');
        // throw flag to update session state of user information
        if (window.updateSessionState) {
          window.updateSessionState();
        }
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

  return (
    <div className="header">
        <a className="logoutLink" onClick={ handleLogout }>Logout</a>
    </div>
  );
}

export default Header;
