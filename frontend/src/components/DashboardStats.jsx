import { useEffect, useState } from "react";
import api from "../axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
function DashboardStats() {
  const [stats, setStats] = useState({
    notesCount: 0,
    todosCount: 0,
    done: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // pozivamo oba controllera
        const notesResponse = await api.get("/notes/stats");
        const todosResponse = await api.get("/todolists/stats");

        setStats({
          notesCount: notesResponse.data.notesCount,
          todosCount: todosResponse.data.todosCount,
          done: todosResponse.data.done,
          pending: todosResponse.data.pending,
        });
      } catch (err) {
        console.error("Greška pri učitavanju statistika:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []); // samo na mount-u

  if (loading) return <p>Loading stats...</p>;

  const data = {
    labels: ["Notes", "To-Do Lists", "Pending Tasks", "Done Tasks"],
    datasets: [
      {
        label: "Count",
        data: [stats.notesCount, stats.todosCount, stats.pending, stats.done],
        backgroundColor: ["#4e79a7", "#f28e2b", "#e15759", "#76b7b2"],
      },
    ],
  };
  const options = {
    responsive: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Dashboard Statistics" },
    },
    scales: {
      y: { beginAtZero: true, precision: 0 },
    },
  };
  return (
    <section style={{ margin: "1em 0", padding: "1em",  borderRadius: "5px" ,
        backgroundImage: "url('/images/ikonica.jpg')",
        backgroundPosition: "right",
        backgroundRepeat: "no-repeat",
        backgroundSize: "500px",
        backgroundColor: "white"
      }}
    >
      <h3>Dashboard Stats</h3>
      <section style={{ margin: "1em 0", padding: "1em", border: "1px solid #ccc", borderRadius: "5px" , width:400, height:400}}>
      <Bar data={data} options={options} width={380} height={380}/>
    </section>
      <div style={{ display: "flex", gap: "2em" }}>
        <div>
          <strong>Total Notes:</strong> {stats.notesCount}
        </div>
        <div>
          <strong>Total To-Do Lists:</strong> {stats.todosCount}
        </div>
        <div>
          <strong>Pending Tasks:</strong> {stats.pending}
        </div>
        <div>
          <strong>Done Tasks:</strong> {stats.done}
        </div>
      </div>
    </section>
  );
}

export default DashboardStats;


