import axios from "axios";
import { useEffect, useState } from "react";

const BASE_URL = "https://api.themoviedb.org/3";
const ACCESS_TOKEN = import.meta.env.VITE_REACT_APP_ACCESS_TOKEN;

const useFetchDetails = (endpoint) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

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
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      });
      setData(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error in useFetchDetails:", err);
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpoint]);

  return { data, loading, error };
};

export default useFetchDetails;
