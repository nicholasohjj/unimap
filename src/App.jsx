import { useState } from "react";
import Map from "./components/map";
import "reactflow/dist/style.css";
import "./index.css";
import Sidebar from "./components/sidebar";
import { coursesContext } from "./context";

const App = () => {
  const [courses, setCourses] = useState([]);
  return (
    <div style={{ display: "flex", flexDirection: "row", height: "100vh" }}>
      <coursesContext.Provider value={{courses, setCourses}}>
      <Sidebar/>
      <Map />
      </coursesContext.Provider>
    </div>
  );
}


export default App