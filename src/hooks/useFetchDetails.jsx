import axios from "axios";
import { useEffect, useState } from "react";

const BASE_URL = "https://api.themoviedb.org/3"; // Define BASE_URL here
const ACCESS_TOKEN = import.meta.env.VITE_REACT_APP_ACCESS_TOKEN; // Define ACCESS_TOKEN here

const useFetchDetails = (endpoint) => {
  const [data, setData] = useState(null); // Initialize with null for consistency
  const [loading, setLoading] = useState(true); // Set initial loading to true
  const [error, setError] = useState(null); // Add error state

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null); // Clear any previous errors

      // Validate endpoint to prevent "undefined" in URL
      if (!endpoint || endpoint.includes("undefined")) {
        console.error(
          "useFetchDetails: Invalid endpoint provided. Endpoint:",
          endpoint
        );
        setError(new Error("Invalid API endpoint."));
        setLoading(false);
        return;
      }

      const response = await axios.get(`${BASE_URL}${endpoint}`, {
        // Crucial: Prepend BASE_URL
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      });
      setData(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error in useFetchDetails:", err); // Log the full error
      setError(err); // Set the error state
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpoint]); // Re-run when endpoint changes

  return { data, loading, error }; // Return error state
};

export default useFetchDetails;
