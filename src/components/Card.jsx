import React from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import { Link } from "react-router-dom";

const Card = ({ data, trending, index, media_type: propMediaType }) => {
  const imageURL = useSelector((state) => state.movieoData.imageURL);

  let type = data.media_type || propMediaType;

  if (type === "person") {
    return null;
  }

  if (!type) {
    console.warn(
      "Card component received data without a valid media_type:",
      data
    );
    return null;
  }

  const displayDate = data.release_date || data.first_air_date;

  return (
    <Link
      to={`/${type}/${data.id}`}
      className="w-full min-w-[230px] max-w-[230px] h-80 overflow-hidden block rounded relative hover:scale-105 transition-all"
    >
      {data?.poster_path ? (
        <img
          src={imageURL + data?.poster_path}
          alt={data?.title || data?.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="bg-neutral-800 h-full w-full flex justify-center items-center text-neutral-400 text-sm">
          No image found
        </div>
      )}

      {trending && (
        <div className="absolute top-4 left-0 py-1 px-4 backdrop-blur-3xl rounded-r-full bg-black/60 overflow-hidden">
          #{index} Trending
        </div>
      )}

      <div className="absolute bottom-0 h-16 backdrop-blur-3xl w-full bg-black/60 p-2">
        <h2 className="text-ellipsis line-clamp-1 text-lg font-semibold">
          {data?.title || data?.name}
        </h2>
        <div className="text-sm text-neutral-400 flex justify-between items-center">
          {displayDate && <p>{moment(displayDate).format("MMMM Do, YYYY")}</p>}
          <p className="bg-black px-1 rounded-full text-xs text-white">
            Rating :{Number(data.vote_average).toFixed(1)}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default Card;
