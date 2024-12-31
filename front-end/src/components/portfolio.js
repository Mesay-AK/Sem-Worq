import React, { useState } from "react";
import Dots from "./pagination-dots"; 
import img1 from "../assets/img1.jpg";
import img2 from "../assets/img2.jpg";
import img3 from "../assets/img3.jpg";

const Portfolio = () => {

  const images = [img1, img2, img3];
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
      
      <div className="text-center mt-1 text-3xl font-bold" style={{ color: "#DD9735" }}>
        Portfolio 
      </div>

      <div className="slider relative w-full h-80 overflow-hidden mt-8">
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10 text-white text-xl font-semibold">
          lorem impsum
          cduaoudcbcoucnoecoe
          cejc je e ciwc  cwiirbgwircfwb rwbcrriwrice ceubu euqbqb
        </div>
       
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Slide ${index + 1}`}
            className={`slider-image w-full object-cover absolute transition-transform duration-500`}
            style={{
              height: "200%",
              transform: `translateX(${(index - currentIndex) * 100}%)`,
            }}
          />
        ))}

        
<button
  className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gradient-to-r from-[#9d832edf] to-[#efa133] text-black p-1 rounded-full z-10 text-3xl shadow-lg hover:scale-110 transition-transform duration-300"
  onClick={handlePrev}
>
  &#8592; 
</button>

<button
  className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gradient-to-r from-[#9d832edf] to-[#efa133] text-black p-1 rounded-full z-10 text-3xl shadow-lg hover:scale-110 transition-transform duration-300"
  onClick={handleNext}
>
  &#8594; 
</button>


       
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          
        </div>
      </div>
      <Dots
            total={images.length}
            activeIndex={currentIndex}
            onDotClick={(index) => setCurrentIndex(index)} // Pass setCurrentIndex to update the active index when a dot is clicked
          />
    </div>
  );
};

export default Portfolio;
