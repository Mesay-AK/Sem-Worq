import React from "react";
function Card() {
    return (
        <div className="border border-gray-300 p-4 rounded-lg bg-gradient-to-r from-yellow-600 via-orange-350 to-yellow-700 w-52 h-72 ml-[500px] mt-[150px] text-white text-opacity-75"
        style={{ boxShadow: '0px 4px 20px rgba(190, 120, 20, 0.5)' }}>
        <h3>This is a reusable card component!</h3>
      </div>
    );
  }

export default Card;
