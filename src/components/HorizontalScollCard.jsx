import React, { useRef } from "react";
import Card from "./Card";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";

// Accept loading and error as props
const HorizontalScollCard = ({
  data,
  heading,
  trending,
  media_type,
  loading,
  error,
}) => {
  const contaierRef = useRef();

  const handleNext = () => {
    if (contaierRef.current) {
      // Add null check for ref
      contaierRef.current.scrollLeft += 300;
    }
  };
  const handlePrevious = () => {
    if (contaierRef.current) {
      // Add null check for ref
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

  // Ensure data is an array and not empty before mapping
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
            // Changed 'data' in map callback to 'item' to avoid naming conflict
            return (
              <Card
                key={item.id + "heading" + index} // Use item.id for key
                data={item}
                index={index + 1}
                trending={trending}
                media_type={media_type || item.media_type} // Use prop or item's media_type
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
