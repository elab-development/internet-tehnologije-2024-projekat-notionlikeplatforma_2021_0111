import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import Button from "../components/Button";
import api from "../axios";
import Quotes from "../components/Quotes";
import ChangePasswordModal from "../components/ChangePasswordModal";
function LoginPage() {
  const [email, setEmail] = useState("");       
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [showForgottenPassword, setShowForgottenPassword] = useState(false);
  const [emailForgottenPass, setEmailForgottenPass] = useState("");
  const [newPassword, setNewPassword] = useState("");
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
      <section style={{
        backgroundImage: "url('/images/notion.jpg')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",       
        backgroundPosition: "bottom",
        color:"#ffffffff",
        border: "2px solid black",
        textAlign: "center",
        WebkitTextStroke: "1px black",
        height: "150px",
        width: "800px"
      }}>
        <h1>Welcome to MiniNotion</h1>
       <Quotes />
      </section>
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
      <div style={{ margin: "1em 0" }}>
        <p>Forgotten password?</p>
        <Button
          label="Change Password"
          onClick={() => setShowForgottenPassword(true)}
        />
       
      </div>
      <p>Not registered yet</p>
      <Button label="Register" onClick={() => navigate("/register")}
/>
<ChangePasswordModal
      show={showForgottenPassword}
      onClose={() => setShowForgottenPassword(false)}
    />
    </div>
  );
}

export default LoginPage;
