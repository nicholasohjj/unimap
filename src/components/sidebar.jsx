import { useState, useEffect } from "react";
import { Container } from "@mui/material";
import { fetchMajors } from "../supabase/services";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
const Sidebar = () => {
  const [majors, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");

  const handleChange = (event) => { 
    setSelectedCourse(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchMajors();
        console.log("Fetched data:", data); // Log the fetched data
        setCourses(data);
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
          value={selectedCourse}
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
