import "../styles.css";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const Node = ({ node }) => {
  const [selectedTab, setSelectedTab] = useState(node[0]);

  return (
    <div>
      <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      >
        <div className="window">
          <nav>
            <ul>
              {node.map((item) => (
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
      </motion.div>
    </div>
  );
};

export default Node;
