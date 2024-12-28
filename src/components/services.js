import React from "react";
import Card from "./card"; // Import the Card component
import Dots from "./pagination-dots"; // Import the PaginationDots component

function Services() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12">
      {/* Cards and Dots Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-1 mx-auto">
        {/* Cards */}
        <Card />
        <Card />
        <Card />

        {/* Pagination Dots */}
        <div className="col-span-1 md:col-start-2 flex justify-center">
          <Dots />
        </div>
      </div>
    </div>
  );
}

export default Services;
