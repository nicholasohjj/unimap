import { createLazyFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { initialTabs as tabs } from "../../ingredients";

export const Route = createLazyFileRoute("/map/$major")({
  component: Major,

});

function Major() {
  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  const {major} = Route.useParams();

  console.log(major);

  useEffect(() => {

  }, []);
  return (
    <div className="window">
      <nav>
        <ul>
          {tabs.map((item) => (
            <li
              key={item.label}
              className={item === selectedTab ? "selected" : ""}
              onClick={() => setSelectedTab(item)}
            >
              {`${item.icon} ${item.label}`}
              {item === selectedTab ? (
                <motion.div className="underline" layoutId="underline" />
              ) : null}
            </li>
          ))}
        </ul>
      </nav>
      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTab ? selectedTab.label : "empty"}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {selectedTab ? selectedTab.icon : "CS1101S 😋"}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
