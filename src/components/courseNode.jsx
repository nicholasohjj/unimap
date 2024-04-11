import "../styles.css";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Node from "./node";
const CourseNode = ({ course }) => {

  const [selectedTab, setSelectedTab] = useState(course[0]);
  return (
    <div>
      <motion.div
        drag
        dragConstraints={{
            left: 0,
            right: window.innerWidth,
            top: 0,
            bottom: window.innerHeight,
          }}        
      >
        <div className="window">
          {node.length > 1 && (
            <nav>
              <ul>
                {node.map((item) => (
                  <li
                    key={item.label}
                    className={item === selectedTab ? "selected" : ""}
                    onClick={() => setSelectedTab(item)}
                  >
                    {`${item.label}`}
                    {item === selectedTab ? (
                      <motion.div className="underline" layoutId="underline" />
                    ) : null}
                  </li>
                ))}
              </ul>
            </nav>
          )}
          <main>
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedTab ? selectedTab.label : "empty"}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {selectedTab ? selectedTab.label : "CS1101S 😋"}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </motion.div>
    </div>
  );
};

export default Node;
