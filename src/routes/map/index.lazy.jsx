import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { fetchMajors } from "../../services/service";
import { useState, useEffect } from "react";
import Node from "../../components/node";
import { motion } from "framer-motion";
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
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
      }}
    >
      {majors.length > 0 ? (
        majors.map((major) => (
          <motion.div
          key={major.major_id}
          drag
          dragConstraints={{
            left: 0,
            right: window.innerWidth,
            top: 0,
            bottom: window.innerHeight,
          }}
          style={{
            position: "absolute",
            left: `${Math.random() * (window.innerWidth - 200)}px`,
            top: `${Math.random() * (window.innerHeight - 100)}px`,
          }}
        >
          <Node
            key={major.major_id}
            node={[
              {
                label: major.major_name,
              },
            ]}
          />
                    </motion.div>

        ))
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
