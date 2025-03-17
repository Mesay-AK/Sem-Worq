import React from "react";
import Card from "../components/card"; 
import Dots from "../components/Pagination-dots"; 
import "tailwindcss";
function Services() {
  return (
    <div className=" flex flex-col items-center justify-center py-12">
      {/* Cards and Dots Container */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-50"> */}

        {/* Cards */}
        <Card />
        {/* <Card /> */}
        {/* <Card /> */}
        {/* </div> */}

        {/* Pagination Dots */}
        {/* <div className="col-span-2 md:col-start-2 flex justify-center">
        
          <Dots />
        </div> */}
      
    </div>
  );
}

export default Services;
