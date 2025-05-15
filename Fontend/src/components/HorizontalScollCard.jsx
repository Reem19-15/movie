import { useRef, useEffect, useCallback } from "react";
import Card from "./Card";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";
import { useSelector, useDispatch } from "react-redux";
import { getUsersLikedMovies } from "../store/movieoSlice";

const HorizontalScollCard = ({
  data,
  heading,
  trending,
  media_type,
  loading,
  error,
}) => {
  const contaierRef = useRef();
  const dispatch = useDispatch();
  const likedMovies = useSelector((state) => state.movieoData.movies); // Get liked movies from Redux state
  const firebaseUser = useSelector((state) => state.user.firebaseUser); // Get the current authenticated user

  // Effect to fetch liked movies when the component mounts or user state changes
  useEffect(() => {
    if (firebaseUser) {
      dispatch(getUsersLikedMovies());
    }
  }, [firebaseUser, dispatch]);

  // Function to check if a movie/show is liked by the current user
  const isItemLiked = useCallback(
    (itemId, itemMediaType) => {
      return likedMovies.some(
        (likedMovie) =>
          likedMovie.movieId === itemId &&
          likedMovie.mediaType === itemMediaType
      );
    },
    [likedMovies]
  );

  const handleNext = () => {
    if (contaierRef.current) {
      contaierRef.current.scrollLeft += 300;
    }
  };
  const handlePrevious = () => {
    if (contaierRef.current) {
      contaierRef.current.scrollLeft -= 300;
    }
  };

  // --- Conditional Rendering Logic ---
  if (loading) {
    return (
      <div className="container mx-auto px-3 my-10">
        <h2 className="text-xl lg:text-2xl font-bold mb-3 text-white capitalize">
          {heading}
        </h2>
        <p className="text-white text-center">Loading {heading}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-3 my-10">
        <h2 className="text-xl lg:text-2xl font-bold mb-3 text-white capitalize">
          {heading}
        </h2>
        <p className="text-red-500 text-center">
          Error loading {heading}: {error.message || "Unknown error"}
        </p>
      </div>
    );
  }

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="container mx-auto px-3 my-10">
        <h2 className="text-xl lg:text-2xl font-bold mb-3 text-white capitalize">
          {heading}
        </h2>
        <p className="text-white text-center">
          No {heading} content available.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 my-10">
      <h2 className="text-xl lg:text-2xl font-bold mb-3 text-white capitalize">
        {heading}
      </h2>

      <div className="relative">
        <div
          ref={contaierRef}
          className="grid grid-cols-[repeat(auto-fit,230px)] grid-flow-col gap-6 overflow-hidden overflow-x-scroll relative z-10 scroll-smooth transition-all scrolbar-none"
        >
          {data.map((item, index) => {
            const currentMediaType = item.media_type || media_type;

            // Skip rendering if media_type is 'person' as they can't be liked
            if (currentMediaType === "person") return null;

            return (
              <Card
                key={item.id + "-" + currentMediaType + "-card-" + index}
                data={item}
                index={index + 1}
                trending={trending}
                media_type={currentMediaType}
                isLiked={isItemLiked(item.id, currentMediaType)}
              />
            );
          })}
        </div>

        <div className="absolute top-0 hidden lg:flex justify-between w-full h-full items-center">
          <button
            onClick={handlePrevious}
            className="bg-white p-1 text-black rounded-full -ml-2 z-10"
          >
            <FaAngleLeft />
          </button>
          <button
            onClick={handleNext}
            className="bg-white p-1 text-black rounded-full -mr-2 z-10"
          >
            <FaAngleRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HorizontalScollCard;
