import { useState, useEffect, useContext } from "react";
import { Container } from "@mui/material";
import { fetchMajors, fetchCourses } from "../supabase/services";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { coursesContext } from "../context";

const Sidebar = () => {
  const [majors, setMajors] = useState([]);
  const { courses, setCourses } = useContext(coursesContext); // Destructure context values
  const [selectedMajor, setSelectedMajor] = useState("");

  const handleChange = async (event) => { 
    setSelectedMajor(event.target.value);

    try {
      const data = await fetchCourses(event.target.value);
      console.log("Fetched data:", data); // Log the fetched data
      setCourses(data);
      console.log("courses state updated:", data); // Log after setting state
    }
    catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchMajors();
        console.log("Fetched data:", data); // Log the fetched data
        setMajors(data);
        console.log("majors state updated:", data); // Log after setting state
      } catch (error) {
        console.error("Error fetching majors:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Container maxWidth="sm">
      <h1>Major Catalog</h1>
      {majors && majors.length > 0 ? (
        <Select
        fullWidth
          value={selectedMajor}
          label="Select a Major"
          onChange={handleChange}
        >
          {majors.map((Major) => (
            <MenuItem key={Major.major_code} value={Major.major_code}>
              {Major.major_name}
            </MenuItem>
          ))}
        </Select>
      ) : (
        <p>No majors available.</p>
      )}
    </Container>
  );
};

export default Sidebar;
