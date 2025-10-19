import Breadcrumbs from "../components/Breadcrumbs";
function About() {
  return (
    <div
      className="about-page"
      style={{
        backgroundImage: "url('/images/notion.jpg')", // slika iz public foldera
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
      }}
    >
       <section style={{
        backgroundColor: "white",
        color: "black",
        padding: "10px"
       }}>
        <Breadcrumbs />
        <h2>About MiniNotion</h2>
        <p>Mini Notion is your digital space for organizing thoughts, plans, and ideas.</p>
        <p>Here, you can keep notes, create to-do lists, and set reminders all in one simple and intuitive place.</p>
      </section>
    </div>
  );
}

export default About;