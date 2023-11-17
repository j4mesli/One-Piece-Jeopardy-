import { User } from "../../types/User";
import UserSession from "../../types/UserSession";
import "./ChangeUsername.css";

interface ChangeUsernameProps {
  changeUsername: (flag: boolean) => void;
  setUser: (user: User) => void;
}

function ChangeUsername(props: ChangeUsernameProps) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const endpoint = 'http://localhost:3000/updateUser';
    const newUsername = e.currentTarget.newUsername.value as string;
    const session = JSON.parse(sessionStorage.getItem('session')!);
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('newUsername', newUsername);
    headers.append('sessionId', session.sessionId);
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: headers,
    });
    const data = await res.json();
    if (data.status !== 200) {
      alert(data.message);
    }
    else {
      props.setUser(data.user);
      const session: UserSession = JSON.parse(sessionStorage.getItem('session')!);
      session.username = data.user.username;
      sessionStorage.setItem('session', JSON.stringify(session));
      props.changeUsername(false);
    }
  };

  return (
    <div className="changeUsername">
      <form action="http://localhost:3000/updateUser" method="POST" onSubmit={ handleSubmit }>
        <label htmlFor="newUsername">New Username</label>
        <input required type="text" id="newUsername" name="newUsername" placeholder="New Username"></input>
        <button type="submit">Change Username</button>
        <button type="button" onClick={ () => props.changeUsername(false) }>Cancel</button>
      </form>
    </div>
  );
}

export default ChangeUsername;