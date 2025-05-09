import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Card from "../components/Card";

const SearchPage = () => {
  const location = useLocation();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPageNo, setTotalPageNo] = useState(0); // Added totalPageNo
  const navigate = useNavigate();

  const query = location?.search?.slice(3);

  const BASE_URL = "https://api.themoviedb.org/3";
  const ACCESS_TOKEN = import.meta.env.VITE_REACT_APP_ACCESS_TOKEN;

  const fetchData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/search/multi`, {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        params: {
          query: query,
          page: page,
        },
      });
      setData((prev) => [...prev, ...response.data.results]);
      setTotalPageNo(response.data.total_pages); // Set total pages
    } catch (error) {
      console.error("Error fetching data for SearchPage:", error);
    }
  };

  useEffect(() => {
    if (query) {
      setPage(1);
      setData([]);
      fetchData();
    } else {
      setData([]); // Clear data if query is empty
    }
  }, [location?.search, query]); // Added query to dependency array

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight &&
      page < totalPageNo
    ) {
      setPage((prev) => prev + 1);
    }
  }, [page, totalPageNo]);

  useEffect(() => {
    if (query) {
      // Only fetch more data if there's a query
      fetchData();
    }
  }, [page, query]); // Added query to dependency array

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className="py-16">
      <div className="lg:hidden my-2 mx-1 sticky top-[70px] z-30">
        <input
          type="text"
          placeholder="Search here..."
          onChange={(e) => navigate(`/search?q=${e.target.value}`)}
          value={query?.split("%20")?.join(" ") || ""}
          className="px-4 py-1 text-lg w-full bg-white rounded-full text-neutral-900 "
        />
      </div>
      <div className="container mx-auto">
        <h3 className="capitalize text-lg lg:text-xl font-semibold my-3">
          Search Results
        </h3>

        <div className="grid grid-cols-[repeat(auto-fit,230px)] gap-6 justify-center lg:justify-start">
          {data.length > 0 ? (
            data.map((searchData) => (
              <Card
                data={searchData}
                key={searchData.id + "search"}
                media_type={searchData.media_type}
              />
            ))
          ) : (
            <p className="text-neutral-400">
              No results found for "{query?.split("%20")?.join(" ")}".
            </p>
          )}
        </div>
        {page < totalPageNo && (
          <div className="text-center my-4">
            <p>Loading more...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
