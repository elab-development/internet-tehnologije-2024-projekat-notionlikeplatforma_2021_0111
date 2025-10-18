/*import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/about">About</Link>
      <Link to="/">Logout</Link>
    </nav>
  );
}

export default Navbar;*/
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")); // preuzimamo user objekat


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="navbar">
      {token ? (
        <>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/about">About</Link>
          {user?.role === "admin" && <Link to="/users">Users</Link>}
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/">Login</Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;
