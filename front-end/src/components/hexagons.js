import React from "react";
import "./hexagons.css"
import img1 from "../assets/img1.jpg";
import img2 from '../assets/img2.jpg';
import img3 from '../assets/img3.jpg';
import img4 from "../assets/img4.jpg";
import img5 from '../assets/img5.jpg';
import img6 from '../assets/img6.jpg';
import img7 from "../assets/img7.jpg";
import img8 from '../assets/img8.jpg';
import img9 from '../assets/img9.jpg';


const Hexagons = () => {
    const hexagons = [
      { id: 1, top: "30%", left: "0%", rotation: "90deg", image: img1},
      { id: 2, top: "50%", left: "0%", rotation: "90deg", image: img2},
      { id: 3, top: "70%", left: "0%", rotation: "90deg", image: img3},
      { id: 4, top: "40%", left: "8%", rotation: "90deg", image: img4 },
      { id: 5, top: "60%", left: "8%", rotation: "90deg", image: img5 },
      { id: 6, top: "80%", left: "8%", rotation: "90deg", image: img6 },
      { id: 7, top: "70%", left: "16%", rotation: "90deg",image: img7 },
      { id: 8, top: "50%", left: "16%", rotation: "90deg",image: img8 },
      { id: 9, top: "80%", left: "24%", rotation: "90deg",image: img9 }
    ];
  
    return (
      <div className="layout relative w-full h-screen overflow-hidden">
        {hexagons.map((hex, index) => (
          <div
            key={hex.id}
            className="hexagon animate-fly-in"
            style={{
              position: "fixed",
              top: hex.top || "auto", // Use 'top' only if provided
              bottom: hex.bottom || "auto", // Use 'bottom' only if provided
              left: hex.left,
              transform: `rotate(${hex.rotation})`,
              zIndex: 1,
              opacity: 0.2, // Adjust opacity directly
              animationDelay: `${index * 0.2}s`, // Delay for sequential animation
            }}
          >
            <img
              src={hex.image} // Use the unique image for each hexagon
              alt={`Hexagon ${hex.id}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    );
  };
  
  export default Hexagons;
