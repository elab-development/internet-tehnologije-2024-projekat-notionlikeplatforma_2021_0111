import { Link, useLocation, useParams } from "react-router-dom";

function Breadcrumbs({ notes }) {
  const location = useLocation();
  const params = useParams();

  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <nav style={{ margin: "1em 0" }}>
      <span>
        <Link to="/">Home</Link>
      </span>
      {pathnames.map((name, index) => {
        if (index === pathnames.length - 1 && !isNaN(Number(name))) return null;
        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        let displayName = name;

        if (name === "note" && params.id && notes) {
          const note = notes.find((n) => n.id === parseInt(params.id));
          if (note) displayName = note.title;
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