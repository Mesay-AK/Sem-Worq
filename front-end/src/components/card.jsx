import React from "react";
import "tailwindcss";
function Card() {
    return (
      <>
        <div style={{color:'green', backgroundColor:"brown"}} className="bg-blue-500">
        <h3>This is a being of reusable card component!</h3>
      </div>
      </>
    );
  }

export default Card;
// "p-4 rounded-lg bg-gradient-to-r from-yellow-600 via-orange-350 to-yellow-700 w- 1/2 h-1/2 ml-[540px] mt-[150px] text-white z-40 opacity-100"