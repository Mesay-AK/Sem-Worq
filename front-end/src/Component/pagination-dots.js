import React, { useState } from 'react';

function Dots() {
  // Manage slides and currentIndex internally
  const slides = ["Slide 1", "Slide 2", "Slide 3"]; // Define the slides array here
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="flex justify-center mt-5">
      {slides.map((_, index) => (
        <div
          key={index}
          onClick={() => setCurrentIndex(index)} // Update the active index
          className={`h-3 w-3 mx-1 rounded-full cursor-pointer ${
            currentIndex === index ? "bg-yellow-600" : "bg-gray-400"
          }`}
        ></div>
      ))}
    </div>
  );
}

export default Dots;
