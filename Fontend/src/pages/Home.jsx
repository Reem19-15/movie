import BannerHome from "../components/BannerHome";
import { useSelector } from "react-redux";

import HorizontalScollCard from "../components/HorizontalScollCard";

import useFetch from "../hooks/useFetch";

const Home = () => {
  const trendingData = useSelector((state) => state.movieoData.bannerData); // This will be an array, empty initially.

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
