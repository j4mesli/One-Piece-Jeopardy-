import "./Register.css";

function Register() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
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
  };

  return (
    <div className="register">
        <form action="https://one-piece-jeopardy-backend-d2ca7583addf.herokuapp.com" method="GET" className="registerForm" onSubmit={ handleSubmit }>
            <h1>Register</h1>
            <div className="registerFormInput">
                <label htmlFor="username">Username</label>
                <input type="username" name="username" id="username" placeholder="Enter your username" />
            </div>
            <div className="registerFormInput">
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" placeholder="Enter your password" />
            </div>
            <button type="submit">Register</button>
        </form>
    </div>
  );
}

export default Register;
