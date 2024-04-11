import { createFileRoute, createLazyFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { initialTabs as tabs } from "../../ingredients";
import Node from "../../components/node";
import { fetchRequirements } from "../../services/service";

const Major = () => {
  const { major_id } = Route.useParams();
  const [requirements, setRequirements] = useState([]);

  useEffect(() => {
    fetchRequirements(major_id)
      .then((data) => {
        setRequirements(data);
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [major_id]);


  useEffect(() => {}, []);
  return (
    <div>
      <AnimatePresence>
        {requirements.map((requirement) => (
          <motion.div
            key={requirement.requirement_id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Node node={requirement} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export const Route = createFileRoute("/map/$major_id")({
  component: Major,
});
