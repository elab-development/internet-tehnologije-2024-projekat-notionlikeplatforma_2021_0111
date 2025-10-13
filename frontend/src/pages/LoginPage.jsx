import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import Button from "../components/Button";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username.trim() !== "" || email.trim() === "" || password.trim() === "") {
      localStorage.setItem("user", username);
      navigate("/dashboard");
    } else {
      alert("Please fill in all fields!");
    }
  };

  return (
    <div className="login-page">
      <h1>Welcome to MiniNotion</h1>
      <InputField
        label="Username"
        value={username}
        onChange={setUsername}
        placeholder="Enter your name"
      />
      <InputField
        label="Email"
        value={email}
        onChange={setEmail}
        placeholder="Enter your email"
      />
      <InputField
        label="Password"
        value={password}
        onChange={setPassword}
        placeholder="Enter your password"
        type="password"
      />
      <Button label="Login" onClick={handleLogin} />
    </div>
  );
}

export default LoginPage;
