import React, { useEffect, useState } from "react";
import BannerHome from "../components/BannerHome";
import { useSelector } from "react-redux";
import Card from "../components/Card"; // Unused, can be removed if not used elsewhere in Home.jsx
import HorizontalScollCard from "../components/HorizontalScollCard";
// import axios from "axios"; // axios is no longer directly imported here if you're using tmdbAxios
import useFetch from "../hooks/useFetch";

const Home = () => {
  const trendingData = useSelector((state) => state.movieoData.bannerData); // This will be an array, possibly empty initially.

  const {
    data: nowPlayingData,
    loading: nowPlayingLoading,
    error: nowPlayingError,
  } = useFetch("/movie/now_playing");
  const {
    data: topRatedData,
    loading: topRatedLoading,
    error: topRatedError,
  } = useFetch("/movie/top_rated");
  const {
    data: popularTvShowData,
    loading: popularTvShowLoading,
    error: popularTvShowError,
  } = useFetch("/tv/popular");
  const {
    data: onTheAirShowData,
    loading: onTheAirShowLoading,
    error: onTheAirShowError,
  } = useFetch("/tv/on_the_air");

  return (
    <div>
      <BannerHome />

      {trendingData && trendingData.length > 0 && (
        <HorizontalScollCard
          data={trendingData}
          heading={"Trending"}
          trending={true}
          media_type={"all"}
        />
      )}

      {/* For data from useFetch, pass loading and error */}
      <HorizontalScollCard
        data={nowPlayingData}
        heading={"Now Playing"}
        media_type={"movie"}
        loading={nowPlayingLoading}
        error={nowPlayingError}
      />
      <HorizontalScollCard
        data={topRatedData}
        heading={"Top Rated Movies"}
        media_type={"movie"}
        loading={topRatedLoading}
        error={topRatedError}
      />
      <HorizontalScollCard
        data={popularTvShowData}
        heading={"Popular TV Show"}
        media_type={"tv"}
        loading={popularTvShowLoading}
        error={popularTvShowError}
      />
      <HorizontalScollCard
        data={onTheAirShowData}
        heading={"On The Air"}
        media_type={"tv"}
        loading={onTheAirShowLoading}
        error={onTheAirShowError}
      />
    </div>
  );
};

export default Home;
