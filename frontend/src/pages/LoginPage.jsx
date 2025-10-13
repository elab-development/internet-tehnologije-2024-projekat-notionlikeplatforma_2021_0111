import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import Button from "../components/Button";
import api from "../axios";

function LoginPage() {
  const [email, setEmail] = useState("");       // username ti ne treba za backend login
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (email.trim() === "" || password.trim() === "") {
      alert("Please fill in all fields!");
      return;
    }

    try {
      // šaljemo POST zahtev na backend
      const response = await api.post("login", { email, password });

      // čuvamo token i user podatke
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.data)); // user info

      // navigacija na dashboard ili glavni ekran
      navigate("/dashboard");
    } catch (error) {
      // backend može vratiti 401 ili Validation error
      const message = error.response?.data?.message || "Login failed!";
      alert(message);
    }
  };

  return (
    <div className="login-page">
      <h1>Welcome to MiniNotion</h1>
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
