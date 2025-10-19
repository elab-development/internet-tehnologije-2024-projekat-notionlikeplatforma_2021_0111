import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../axios";
import Button from "../components/Button";
import Breadcrumbs from "../components/Breadcrumbs";

function User() {
  const [users, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const response = await api.get("/user"); 
        const currentUser = response.data.data;
        if (currentUser.role === "admin") {
          setIsAdmin(true);
          fetchUsers();
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUsers = async () => {
      try {
        const res = await api.get("/users");
        setUsers(res.data.data);
      } catch (err) {
        console.error("Error while loading users:", err);
      }
    };

    fetchMe();
  }, []);

  const deleteUser = async (id) => {
    if (!window.confirm("Do you want to delete this user?")) return;

    try {
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((user) => user.id !== id));
      alert("User successfully deleted.");
    } catch (error) {
      console.error("Error while deleting.", error);
      alert("Error.");
    }
  };
 if (loading) return <p>Loading...</p>;

  if (!isAdmin) return <Navigate to="/dashboard" />;
 
  return (
    <div className="user-page">
      <Breadcrumbs />
      <h2 style={{ textAlign: "center" }}>Users:</h2>
      {users.length === 0 ? (
        <p>...</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li
              key={user.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <div>
                <strong>{user.name}</strong> ({user.email})
              </div>
              <Button
                label="Delete"
                onClick={() => deleteUser(user.id)}
                disabled={user.is_admin} 
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
export default User;
