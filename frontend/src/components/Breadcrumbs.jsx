import { Link, useLocation, useParams } from "react-router-dom";

function Breadcrumbs({ note = null, todo = null }) {
  const location = useLocation();
  const params = useParams();

  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <nav style={{ margin: "1em 0" }}>
      <span>
        <Link to="/dashboard">Dashboard</Link>
      </span>
      {pathnames.map((name, index) => {
        if (index === pathnames.length - 1 && !isNaN(Number(name))) return null;
        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        let displayName = name;

        if (name === "note" && note) {
           displayName = note.title;
        }

        if (name === "todo" && todo) {
          displayName = todo.title;
        }

        if (!["note", "todo"].includes(name)) {
          displayName = name.replace(/-/g, " ");
          displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
        }

        return (
          <span key={routeTo}>
            {" > "}
            {isLast ? (
              <span>{displayName}</span>
            ) : (
              <Link to={routeTo}>{displayName}</Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}

export default Breadcrumbs;