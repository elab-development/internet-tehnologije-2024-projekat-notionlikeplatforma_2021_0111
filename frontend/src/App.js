import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import NoteEditor from "./pages/NoteEditor";
import ToDoPage from "./pages/ToDoPage";
import About from "./pages/About";
import User from "./pages/User";
import RegisterPage from "./pages/RegisterPage";
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>*/
        {/* Javna ruta */}
        //<Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Zaštićene rute */}
        /*<Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/note/:id"
          element={
            <PrivateRoute>
              <NoteEditor />
            </PrivateRoute>
          }
        />
        <Route
          path="/todo/:id"
          element={
            <PrivateRoute>
              <ToDoPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute requireAdmin={true}>
              <User />
            </PrivateRoute>
          }
        />

        {/* Javna ruta */}
        /*<Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;