import "./Login.css";
import LoginResponse from "../../types/LoginResponse";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const username: string = event.currentTarget.username.value;
    const password: string = event.currentTarget.password.value;
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('username', username);
    headers.append('password', password);

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: headers,
      });
      const result: LoginResponse = await response.json();
      if (result.status === 201) {
        sessionStorage.setItem('session', JSON.stringify(result.session));
        // throw flag to update session state of user information
        window.updateSessionState();
        navigate('/game');
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
    <div className="login">
        <form action="http://localhost:3000" method="GET" className="loginForm" onSubmit={ handleSubmit }>
            <h1>Login</h1>
            <div className="loginFormInput">
                <label htmlFor="username">Username</label>
                <input type="text" name="username" id="username" placeholder="Enter your username" />
            </div>
            <div className="loginFormInput">
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" placeholder="Enter your password" />
            </div>
            <button type="submit">Login</button>
        </form>
    </div>
  );
}

export default Login;
