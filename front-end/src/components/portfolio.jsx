import React, { useState } from "react";
import Dots from "./pagination-dots";
import img11 from "../assets/img11.jpg";
import img12 from "../assets/img12.jpg";
import img13 from "../assets/img13.jpg";

const Portfolio = () => {
  const images = [img11, img12, img13];
  const descriptions = [
    "Text for Image 1: Lorem Ipsum",
    "Text for Image 2: Lorem Ipsum",
    "Text for Image 3: Lorem Ipsum",
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="portfolio">
    
      <div
        className="text-center -m-2 text-3xl font-bold"
        style={{ color: "#DD9735" }}
      >
        Portfolio
      </div>


      <div
        className="text-center mt-4 text-xl font-semibold"
        style={{ color: "#DD9735" }}
      >
        {descriptions[currentIndex]}
      </div>

      {/* Slider Container */}
      <div className="slider relative w-full h-80 overflow-hidden mt-6">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Slide ${index + 1}`}
            className={`slider-image w-full object-cover absolute transition-transform duration-500`}
            style={{
              height: "100%",
              transform: `translateX(${(index - currentIndex) * 100}%)`,
            }}
          />
        ))}

       
        <button
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gradient-to-r from-[#9d832edf] to-[#efa133] text-black p-2 rounded-full z-10 text-4xl shadow-lg hover:scale-110 transition-transform duration-300"
          onClick={handlePrev}
        >
          &#9664; 
        </button>

        <button
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gradient-to-r from-[#9d832edf] to-[#efa133] text-black p-2 rounded-full z-10 text-4xl shadow-lg hover:scale-110 transition-transform duration-300"
          onClick={handleNext}
        >
          &#9654; 
        </button>
      </div>

      
      <Dots
        total={images.length}
        activeIndex={currentIndex}
        onDotClick={(index) => setCurrentIndex(index)}
      />
    </div>
  );
};

export default Portfolio;
