import axios from "axios";
import { useEffect, useState } from "react";

const useFetch = (endpoint) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASE_URL = "https://api.themoviedb.org/3";
  const ACCESS_TOKEN = import.meta.env.VITE_REACT_APP_ACCESS_TOKEN;

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${BASE_URL}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      });
      setData(response.data.results || response.data);
    } catch (error) {
      console.error("Error in useFetch:", error);
      setError(error);
      setData(null);
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
