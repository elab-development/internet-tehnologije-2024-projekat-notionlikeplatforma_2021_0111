import { useState } from "react";
import Button from "../components/Button";
import InputField from "../components/InputField";
import api from "../axios";

function ChangePasswordModal({ show, onClose }) {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  if (!show) return null; // ne prikazuje modal ako show = false

  const handleChangePassword = async () => {
    if (!email.trim() || !newPassword.trim()) {
      alert("Please enter email and new password!");
      return;
    }

    try {
      await api.put("/user/reset-password", { email, password: newPassword });
      alert("Password changed successfully!");
      setEmail("");
      setNewPassword("");
      onClose(); // zatvori modal
    } catch (error) {
      const message = error.response?.data?.message || "Password change failed!";
      alert(message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Change Password</h3>
        <InputField
          label="Email"
          value={email}
          onChange={setEmail}
          placeholder="Enter your email"
        />
        <InputField
          label="New Password"
          value={newPassword}
          onChange={setNewPassword}
          placeholder="Enter new password"
          type="password"
        />
        <Button label="Change" onClick={handleChangePassword} />
        <Button label="Cancel" onClick={onClose} />
      </div>
    </div>
  );
}

export default ChangePasswordModal;

