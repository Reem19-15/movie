import axios from "axios"; // Keep this import
import { useEffect, useState } from "react";

const useFetch = (endpoint) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define BASE_URL and ACCESS_TOKEN directly in this file
  const BASE_URL = "https://api.themoviedb.org/3";
  const ACCESS_TOKEN = import.meta.env.VITE_REACT_APP_ACCESS_TOKEN;

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null); // Clear previous errors
      const response = await axios.get(`${BASE_URL}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      });
      setData(response.data.results || response.data);
    } catch (error) {
      console.error("Error in useFetch:", error); // Use console.error for errors
      setError(error); // Set the error state
      setData(null); // Clear data on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (endpoint) {
      fetchData();
    }
  }, [endpoint]);

  return { data, loading, error };
};

export default useFetch;
