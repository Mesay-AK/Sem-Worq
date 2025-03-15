import React from "react";
import "./layout-white.css"; // Ensure your CSS is correctly linked
import image from "./../assets/image.jpg";
import Navbar from "./../Navbar-white";


const Layout_White = () => {
  const hexagons = [
    { id: 1, top: "-23%", left: "40%", rotation: "90deg" },
    { id: 2, top: "40%", left: "55%", rotation: "90deg" },
    { id: 3, top: "70%", left: "90%", rotation: "90deg" },
    { id: 4, top: "80%", left: "50%", rotation: "90deg" },
  ];

  return (
    <div className="layout relative w-full h-screen overflow-hidden bg-#f8f7ed">
      <div>
        <Navbar />
      </div>
      {hexagons.map((hex) => (
        <div
          key={hex.id}
          className="hexagon"
          style={{
            position: "fixed",
            top: hex.top || "auto", // Use 'top' only if provided
            bottom: hex.bottom || "auto", // Use 'bottom' only if provided
            left: hex.left,
            transform: `rotate(${hex.rotation})`,
            zIndex: 1,
            opacity: 0.2, // Adjust opacity directly
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

export default Layout_White;
