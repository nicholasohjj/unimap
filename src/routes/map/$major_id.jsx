import { createFileRoute, createLazyFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { initialTabs as tabs } from "../../ingredients";
import Node from "../../components/node";
import { fetchRequirements } from "../../services/service";

const Major = () => {
  const { major_id } = Route.useParams();

  useEffect(() => {
    fetchRequirements(major_id)
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [major_id]);


  useEffect(() => {}, []);
  return (
    <div>
      <Node node={tabs} />
    </div>
  );
};

export const Route = createFileRoute("/map/$major_id")({
  component: Major,
});
