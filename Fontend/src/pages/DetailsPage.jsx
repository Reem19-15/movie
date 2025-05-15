import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import useFetchDetails from "../hooks/useFetchDetails";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import Divider from "../components/Divider";
import HorizontalScollCard from "../components/HorizontalScollCard";
import VideoPlay from "../components/VideoPlay";
import { IoHeart, IoHeartOutline } from "react-icons/io5";
import { toggleLikedMovie } from "../store/movieoSlice";

const DetailsPage = () => {
  const { mediaType, id } = useParams();
  const imageURL = useSelector((state) => state.movieoData.imageURL);
  const likedMovies = useSelector((state) => state.movieoData.movies);
  const firebaseUser = useSelector((state) => state.user.firebaseUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data, loading, error } = useFetchDetails(`/${mediaType}/${id}`);
  const {
    data: castData,
    loading: castLoading,
    error: castError,
  } = useFetchDetails(`/${mediaType}/${id}/credits`);
  const {
    data: videoData,
    loading: videoLoading,
    error: videoError,
  } = useFetchDetails(`/${mediaType}/${id}/videos`);

  const {
    data: similarData,
    loading: similarLoading,
    error: similarError,
  } = useFetch(`/${mediaType}/${id}/similar`);

  const {
    data: recommendationData,
    loading: recommendationLoading,
    error: recommendationError,
  } = useFetch(`/${mediaType}/${id}/recommendations`);

  const [playVideo, setPlayVideo] = useState(false);
  const [playVideoId, setPlayVideoId] = useState("");

  const trailer = videoData?.results?.find(
    (vid) => vid.type === "Trailer" && vid.site === "YouTube"
  );

  const handlePlayVideo = () => {
    if (trailer) {
      setPlayVideoId(trailer.key);
      setPlayVideo(true);
    } else {
      console.warn(
        "No official trailer found, playing first available video or none."
      );
      if (videoData?.results?.length > 0) {
        setPlayVideoId(videoData.results[0].key);
        setPlayVideo(true);
      } else {
        alert("No videos available for this content.");
      }
    }
  };

  const isCurrentItemLiked = likedMovies.some(
    (likedMovie) =>
      likedMovie.movieId === parseInt(id) && likedMovie.mediaType === mediaType
  );

  const handleLikeToggle = () => {
    if (!firebaseUser) {
      alert("Please log in to add items to your list.");
      navigate("/login");
      return;
    }

    dispatch(
      toggleLikedMovie({
        movieId: data.id,
        mediaType: mediaType,
        isLiked: isCurrentItemLiked,
        title: data?.title || data?.name,
        poster_path: data?.poster_path,
        release_date: data?.release_date || data?.first_air_date,
      })
    );
  };

  if (
    loading ||
    castLoading ||
    videoLoading ||
    similarLoading ||
    recommendationLoading
  ) {
    return (
      <div className="container mx-auto px-3 py-16 text-center text-white">
        Loading details...
      </div>
    );
  }

  if (error || castError || videoError || similarError || recommendationError) {
    return (
      <div className="container mx-auto px-3 py-16 text-center text-red-500">
        Error loading details:{" "}
        {error?.message ||
          castError?.message ||
          videoError?.message ||
          "Unknown error"}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto px-3 py-16 text-center text-white">
        No details found for this content. Please check the URL.
      </div>
    );
  }

  const duration = data?.runtime
    ? (data.runtime / 60)?.toFixed(1)?.split(".")
    : null;
  const writer = castData?.crew
    ?.filter((el) => el?.job === "Writer")
    ?.map((el) => el?.name)
    ?.join(", ");

  return (
    <div>
      <div className="w-full h-[280px] relative hidden lg:block">
        <div className="w-full h-full">
          {data?.backdrop_path && (
            <img
              src={imageURL + data?.backdrop_path}
              alt={data?.title || data?.name}
              className="h-full w-full object-cover"
            />
          )}
        </div>
        <div className="absolute w-full h-full top-0 bg-gradient-to-t from-neutral-900/90 to-transparent"></div>
      </div>

      <div className="container mx-auto px-3 py-16 lg:py-0 flex flex-col lg:flex-row gap-5 lg:gap-10 ">
        <div className="relative mx-auto lg:-mt-28 lg:mx-0 w-fit min-w-60">
          {data?.poster_path && (
            <img
              src={imageURL + data?.poster_path}
              alt={data?.title || data?.name}
              className="h-80 w-60 object-cover rounded"
            />
          )}
          {trailer || videoData?.results?.length > 0 ? (
            <button
              onClick={handlePlayVideo}
              className="mt-3 w-full py-2 px-4 text-center bg-white text-black rounded font-bold text-lg hover:bg-gradient-to-l from-red-500 to-orange-500 hover:scale-105 transition-all"
            >
              Play Now
            </button>
          ) : (
            <p className="mt-3 w-full py-2 px-4 text-center bg-neutral-700 text-white rounded font-bold text-lg">
              No videos available
            </p>
          )}

          {/* Like/Unlike Button */}
          <button
            onClick={handleLikeToggle}
            className="mt-3 w-full py-2 px-4 text-center rounded font-bold text-lg flex items-center justify-center gap-2
              bg-neutral-800 text-white hover:bg-neutral-700 transition-all"
          >
            {isCurrentItemLiked ? (
              <IoHeart className="text-red-500" />
            ) : (
              <IoHeartOutline className="text-white" />
            )}
            {isCurrentItemLiked ? "Remove from List" : "Add to List"}
          </button>
        </div>

        <div>
          <h2 className="text-2xl lg:text-4xl font-bold text-white ">
            {data?.title || data?.name}
          </h2>
          <p className="text-neutral-400">{data?.tagline}</p>
          <Divider />
          <div className="flex items-center gap-3">
            <p>Rating : {Number(data?.vote_average).toFixed(1)}+</p>
            <span>|</span>
            <p>View : {Number(data?.vote_count).toLocaleString()}</p>
            <span>|</span>
            {data?.runtime && (
              <>
                <p>
                  Duration : {duration[0]}h {duration[1]}m
                </p>
                <span>|</span>
              </>
            )}
          </div>
          <Divider />
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Overview</h3>
            <p>{data?.overview}</p>

            <Divider />
            <div className="flex items-center gap-3 my-3 text-center">
              <p>Status : {data?.status}</p>
              <span>|</span>
              {data?.release_date && (
                <>
                  <p>
                    Release Date :{" "}
                    {moment(data?.release_date).format("MMMM Do, YYYY")}
                  </p>
                  <span>|</span>
                </>
              )}
              {data?.revenue && (
                <p>Revenue : ${Number(data?.revenue).toLocaleString()}</p>
              )}
            </div>

            <Divider />
          </div>
          <div>
            {castData?.crew?.find((el) => el?.job === "Director") && (
              <p>
                <span className="text-white">Director</span> :{" "}
                {castData?.crew
                  ?.filter((el) => el?.job === "Director")
                  .map((el) => el.name)
                  .join(", ")}
              </p>
            )}
            {castData?.crew?.find((el) => el?.job === "Director") && (
              <Divider />
            )}
            {writer && (
              <p>
                <span className="text-white">Writer</span> : {writer}
              </p>
            )}
          </div>
          {writer && <Divider />}
          <h2 className="font-bold text-lg">Cast :</h2>
          <div className="grid grid-cols-[repeat(auto-fit,96px)] gap-5 my-4">
            {castData?.cast &&
              Array.isArray(castData.cast) &&
              castData.cast
                ?.filter((el) => el?.profile_path)
                .slice(0, 10)
                .map((starCast) => {
                  return (
                    <div
                      key={starCast.id + "cast" + starCast.credit_id}
                      className="text-center"
                    >
                      <div>
                        {starCast?.profile_path ? (
                          <img
                            src={imageURL + starCast?.profile_path}
                            alt={starCast?.name}
                            className="w-24 h-24 object-cover rounded-full"
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-neutral-700 flex items-center justify-center text-neutral-400 text-sm">
                            No Image
                          </div>
                        )}
                      </div>
                      <p className="font-bold text-center text-sm text-neutral-400">
                        {starCast?.name}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {starCast?.character}
                      </p>
                    </div>
                  );
                })}
          </div>
        </div>
      </div>

      <div>
        <HorizontalScollCard
          data={similarData}
          heading={"Similar " + (mediaType === "movie" ? "Movies" : "TV Shows")}
          media_type={mediaType}
          loading={similarLoading}
          error={similarError}
        />
        <HorizontalScollCard
          data={recommendationData}
          heading={
            "Recommendation " + (mediaType === "movie" ? "Movies" : "TV Shows")
          }
          media_type={mediaType}
          loading={recommendationLoading}
          error={recommendationError}
        />
      </div>

      {playVideo && (
        <VideoPlay videoKey={playVideoId} close={() => setPlayVideo(false)} />
      )}
    </div>
  );
};

export default DetailsPage;
