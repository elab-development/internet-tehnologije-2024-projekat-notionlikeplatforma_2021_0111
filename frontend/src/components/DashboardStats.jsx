import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
function DashboardStats({ notes, todos }) {
  // Broj beleški
  const notesCount = notes.length;

  // Broj to-do lista
  const todosCount = todos.length;

  // Broj taskova po statusu (done/pending)
  const taskStats = useMemo(() => {
    let done = 0;
    let pending = 0;
    todos.forEach((todo) => {
      todo.tasks.forEach((task) => {
        if (task.status === "done") done++;
        else pending++;
      });
    });
    return { done, pending };
  }, [todos]);
const data = {
    labels: ["Notes", "To-Do Lists", "Pending Tasks", "Done Tasks"],
    datasets: [
      {
        label: "Count",
        data: [notesCount, todosCount, taskStats.pending, taskStats.done],
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
          <strong>Total Notes:</strong> {notesCount}
        </div>
        <div>
          <strong>Total To-Do Lists:</strong> {todosCount}
        </div>
        <div>
          <strong>Pending Tasks:</strong> {taskStats.pending}
        </div>
        <div>
          <strong>Done Tasks:</strong> {taskStats.done}
        </div>
      </div>
    </section>
  );
}

export default DashboardStats;
