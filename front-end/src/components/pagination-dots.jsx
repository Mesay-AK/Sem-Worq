import React from "react";

function Dots({ total, activeIndex, onDotClick }) {
  return (
    <div className="flex justify-center mt-5">
      {Array.from({ length: total }).map((_, index) => (
        <div
          key={index}
          onClick={() => onDotClick(index)} 
          className={`h-3 w-3 mx-1 rounded-full cursor-pointer ${
            activeIndex === index ? "bg-yellow-600" : "bg-gray-400"
          }`}
        ></div>
      ))}
    </div>
  );
}

export default Dots;

