import React from "react";
import "./layout.css"; 
import image from "./../assets/image.jpg";
import Navbar from "./../Navbar";
import "tailwindcss";


const Layout = () => {
  const hexagons = [
    { id: 1, top: "-15%", left: "48%", rotation: "90deg"},
    { id: 2, top: "30%", left: "58%", rotation: "90deg" },
    { id: 3, top: "60%", left: "83%", rotation: "90deg" },
    { id: 4, top: "75%", left: "50%", rotation: "90deg" },
  ];

  return (
    <div className="layout relative w-full h-screen overflow-hidden">
      <div>
        <Navbar />
      </div>
      
      {hexagons.map((hex) => (
        <div
          key={hex.id}
          className="hexagon"
          style={{
            position: "fixed",
            top: hex.top || "auto", 
            bottom: hex.bottom || "auto", 
            left: hex.left,
            transform: `rotate(${hex.rotation})`,
            zIndex: 1,
            opacity: 0.2, 
          }}
        >
          <img
            src={image}
            alt={`Hexagon ${hex.id}`}
            className="w-full h-full object-cover"
          />
        </div>
        

      ))}
    </div>
  );
};

export default Layout;
