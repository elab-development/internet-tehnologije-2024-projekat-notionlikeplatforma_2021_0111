import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import Button from "../components/Button";
import api from "../axios";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      alert("Please fill in all fields!");
      return;
    }

    try {
      const response = await api.post("/register", { name, email, password });
      
      // Nakon uspešne registracije možemo direktno logovati korisnika
      const response2 = await api.post("/login", { email, password });
      localStorage.setItem("token", response2.data.token);
      localStorage.setItem("user", JSON.stringify(response2.data.data));

      navigate("/dashboard");
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed!";
      alert(message);
    }
  };

  return (
    <div className="register-page">
      <h1>Create your account</h1>
      <InputField
        label="Name"
        value={name}
        onChange={setName}
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
      <Button label="Register" onClick={handleRegister} />
    </div>
  );
}

export default RegisterPage;
