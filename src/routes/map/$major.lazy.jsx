import { createLazyFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { initialTabs as tabs } from "../../ingredients";
import Node from "../../components/node";
export const Route = createLazyFileRoute("/map/$major")({
  component: Major,

});

function Major() {

  const {major} = Route.useParams();

  console.log(major);

  useEffect(() => {

  }, []);
  return (
    <div>
      <Node node={tabs}/>
    </div>
  );
}
