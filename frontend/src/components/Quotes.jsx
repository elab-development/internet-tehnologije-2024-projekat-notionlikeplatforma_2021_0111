import { useEffect, useState } from "react";
import api from "../axios";

function Quotes() {
  const [quote, setQuote] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await api.get(
          "https://api.allorigins.win/get?url=" + encodeURIComponent("https://zenquotes.io/api/random")
        );
        const data = JSON.parse(response.data.contents);

        const q = data[0];
        setQuote({ text: q.q, author: q.a });
      } catch (err) {
        setError("Failed to fetch quote");
        console.error("Error details:", err.response || err.message || err);
      }
    };
    fetchQuote();
  }, []);

  if (error) return <p>{error}</p>;
  if (!quote) return <p>Loading...</p>;

  return (
    <div className="quote">
      <p>"{quote.text}"</p>
      <p>- {quote.author || "Unknown"}</p>
    </div>
  );
}

export default Quotes;