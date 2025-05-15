import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import Card from "../components/Card";
import { useSelector } from "react-redux";

const ExplorePage = () => {
  const params = useParams();
  const [pageNo, setPageNo] = useState(1);
  const [data, setData] = useState([]);
  const [totalPageNo, setTotalPageNo] = useState(0);
  const likedMovies = useSelector((state) => state.movieoData.movies); // Get liked movies from Redux

  const BASE_URL = "https://api.themoviedb.org/3";
  const ACCESS_TOKEN = import.meta.env.VITE_REACT_APP_ACCESS_TOKEN;

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/discover/${params.mediaType}`,
        {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
          params: {
            page: pageNo,
          },
        }
      );
      setData((prev) => [...prev, ...response.data.results]);
      setTotalPageNo(response.data.total_pages);
    } catch (error) {
      console.error("Error fetching data for ExplorePage:", error);
    }
  };

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight &&
      pageNo < totalPageNo
    ) {
      setPageNo((prev) => prev + 1);
    }
  }, [pageNo, totalPageNo]);

  useEffect(() => {
    // This useEffect is called when pageNo or mediaType changes.
    // If pageNo changes, it fetches the next page and appends.
    // If mediaType changes, pageNo is reset to 1 in the next useEffect,
    // which will then trigger this one to fetch the first page for the new mediaType.
    fetchData();
  }, [pageNo, params.mediaType]);

  useEffect(() => {
    // This useEffect ensures that when mediaType changes, we reset the page and data
    setPageNo(1);
    setData([]);
  }, [params.mediaType]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Function to check if a movie is liked
  const isMovieLiked = (movieId, mediaType) => {
    return likedMovies.some(
      (likedMovie) =>
        likedMovie.movieId === movieId && likedMovie.mediaType === mediaType
    );
  };

  return (
    <div className="py-16">
      <div className="container mx-auto">
        <h3 className="capitalize text-lg lg:text-xl font-semibold my-3">
          Popular {params.mediaType} show
        </h3>

        <div className="grid grid-cols-[repeat(auto-fit,230px)] gap-6 justify-center lg:justify-start">
          {data.map(
            (
              exploreData,
              index // <-- Add index to map callback
            ) => (
              <Card
                data={exploreData}
                key={exploreData.id + "-" + params.mediaType + "-" + index}
                media_type={params.mediaType}
                isLiked={isMovieLiked(exploreData.id, params.mediaType)}
              />
            )
          )}
        </div>
        {pageNo < totalPageNo && (
          <div className="text-center my-4">
            <p>Loading more...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
