import { useEffect, useState } from "react";
import axios from "axios";

function Quotes() {
  const [quote, setQuote] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await axios.get(
          "https://api.allorigins.win/get?url=" + encodeURIComponent("https://zenquotes.io/api/random")
        );

        // allorigins vraća sadržaj u response.data.contents kao string
        const data = JSON.parse(response.data.contents);

        // ZenQuotes vraća niz sa jednim objektom
        const q = data[0];
        setQuote({ text: q.q, author: q.a });
      } catch (err) {
        setError("Failed to fetch quote");
        console.error(err);
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