import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../axios";
import Button from "../components/Button";

function User() {
  const [users, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1️⃣ Proveri da li je ulogovani korisnik admin
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const response = await api.get("/user"); // /user rutu već imaš u backendu
        const currentUser = response.data.data;
        if (currentUser.role === "admin") {
          setIsAdmin(true);
          fetchUsers();
        }
      } catch (error) {
        console.error("Nije moguće proveriti korisnika:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUsers = async () => {
      try {
        const res = await api.get("/users");
        setUsers(res.data.data);
      } catch (err) {
        console.error("Greška pri učitavanju korisnika:", err);
      }
    };

    fetchMe();
  }, []);

  // 2️⃣ Brisanje korisnika
  const deleteUser = async (id) => {
    if (!window.confirm("Da li si siguran da želiš da obrišeš ovog korisnika?")) return;

    try {
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((user) => user.id !== id));
      alert("Korisnik uspešno obrisan!");
    } catch (error) {
      console.error("Greška pri brisanju korisnika:", error);
      alert("Došlo je do greške.");
    }
  };
// 3️⃣ Loading stanje
  if (loading) return <p>Učitavanje...</p>;

  // 🔐 4️⃣ Ako korisnik nije admin — preusmeri ga
  if (!isAdmin) return <Navigate to="/dashboard" />;
  
  // 4️⃣ Ako jeste admin
  return (
    <div className="user-page">
      <h2>Lista korisnika</h2>
      {users.length === 0 ? (
        <p>Nema registrovanih korisnika.</p>
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
                label="Obriši"
                onClick={() => deleteUser(user.id)}
                disabled={user.is_admin} // opciono: spreči brisanje drugih admina
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
export default User;
