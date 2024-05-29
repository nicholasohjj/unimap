import { useCallback, useEffect } from "react";
import Map from "./components/map";
import "reactflow/dist/style.css";
import "./index.css";
import Sidebar from "./components/sidebar";

const App = () => {

  return (
    <div style={{ display: "flex", flexDirection: "row", height: "100vh" }}>
      <Sidebar/>
      <Map />
    </div>
  );
}


export default App