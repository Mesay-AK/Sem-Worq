import React from "react";
import "./layout.css";


const Layout = () => {
  const hexagons = [
    { id: 1, bottom: "0%", left: "40%", rotation: "90deg" },
    { id: 2, top: "40%", left: "55%", rotation: "90deg" },
    { id: 3, top: "70%", left: "90%", rotation: "90deg" },
    { id: 4, top: "80%", left: "50%", rotation: "90deg" },
  ];

  return (
    <div className="layout">
    
      {hexagons.map((hex) => (
        <div
          key={hex.id}
          className="hexagon"
          style={{
            position: "absolute",
            top: hex.top,
            left: hex.left,
            transform: `rotate(${hex.rotation})`, // Static rotation for each hexagon
            zIndex: 1,
          }}
        ></div>
      ))}
    
    </div>
  );
};

export default Layout;
