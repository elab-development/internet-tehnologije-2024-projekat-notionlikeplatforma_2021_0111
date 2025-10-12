import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import Button from "../components/Button";

function LoginPage() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username.trim() !== "") {
      localStorage.setItem("user", username);
      navigate("/dashboard");
    } else {
      alert("Please enter your name!");
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
      <Button label="Login" onClick={handleLogin} />
    </div>
  );
}

export default LoginPage;
