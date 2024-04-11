import "../styles.css";
import { motion, AnimatePresence } from "framer-motion";
const CourseNode = ({ course }) => {

console.log("course", course)
  const tabs = ["🏠", "description"]

  console.log("tabs", tabs)
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
          style={{
            position: "absolute",
            left: `${Math.random() * (window.innerWidth - 200)}px`,
            top: `${Math.random() * (window.innerHeight - 100)}px`,
          }}
      >
        <div className="window">

          
          <main>
            <AnimatePresence mode="wait">
              <motion.div
                key={course["course_code"]}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {course["course_code"]}

              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </motion.div>
    </div>
  );
};

export default CourseNode;
