import { createLazyFileRoute } from "@tanstack/react-router";
import { fetchMajors } from "../services/service";
import { useState, useEffect } from "react";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  const [majors, setMajors] = useState([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetchMajors()
      .then((data) => {
        console.log(data);
        setMajors(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  return (
    <>
      {majors.length > 0 ? (
        <div className="App">
          <header className="App-header">
            <p>
              Edit <code>App.jsx</code> and save to reload.
            </p>

            <button onClick={() => setCount(count + 1)}>
              count is: {count}
            </button>
            <ul>
              {majors.map((major) => (
                <li key={major.major_id}>{major.major_name}</li>
              ))}
            </ul>
          </header>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}
