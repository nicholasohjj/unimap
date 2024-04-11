import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { fetchMajors } from "../../services/service";
import { useState, useEffect } from "react";

export const Route = createLazyFileRoute("/map/")({
  component: Index,
});

function Index() {
  const [majors, setMajors] = useState([]);
  const [count, setCount] = useState(0);

  const navigate = useNavigate();

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

  const goToMap = (major_id) => {
    console.log("goToMap", major_id);
    navigate({ to: `/map/${major_id}` });
  };
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
                <li
                  key={major.major_id}
                  onClick={() => goToMap(major.major_id)}
                >
                  {major.major_name}
                </li>
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
