import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { username, password } = event.currentTarget;

    if (username.value.length < 4 || username.value.length > 25) {
      alert('Username must be between 4 and 25 characters.');
      return;
    }
    if (password.value.length <= 7 || password.value.length > 255) {
      alert('Password must be between 8 and 255 characters.');
      return;
    }

    const uppercasePattern = /[A-Z]/;
    const lowercasePattern = /[a-z]/;
    const numberPattern = /[0-9]/;
    const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/;

    if (!uppercasePattern.test(password.value)) {
      alert('Password must contain at least one uppercase letter.');
      return;
    }
    if (!lowercasePattern.test(password.value)) {
      alert('Password must contain at least one lowercase letter.');
      return;
    }
    if (!numberPattern.test(password.value)) {
      alert('Password must contain at least one number.');
      return;
    }
    if (!specialCharPattern.test(password.value)) {
      alert('Password must contain at least one special character.');
      return;
    }

    const endpoint = 'http://localhost:3000/register';
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('username', username.value);
    headers.append('password', password.value);
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: headers,
    });
    const data = await res.json();
    if (data.status !== 200) {
      alert(data.message);
    }
    else {
      const session = data.user;
      sessionStorage.setItem('session', JSON.stringify(session));
      navigate('/game');
    }
  };

  return (
    <div className="register">
      <form action="http://localhost:3000/register" method="POST" className="registerForm" onSubmit={ handleSubmit }>
        <h1>Register</h1>
        <div className="registerFormInput">
            <label htmlFor="username">Username</label>
            <input type="text" name="username" id="username" placeholder="Enter your username" />
        </div>
        <div className="registerFormInput">
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" placeholder="Enter your password" />
        </div>
        <button type="submit">Register</button>
        <p>Already have an account? <a style={{ cursor: "pointer" }} onClick={ () => navigate('/login') }>Login here!</a></p>
      </form>
    </div>
  );
}

export default Register;
