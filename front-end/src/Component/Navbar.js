import React from "react";
import image from "../assets/Logo.PNG";

const Navbar = () => {
  return (
    <header className="w-full h-20 bg-[#000000] flex items-center justify-between px-8 ">
      {/* Logo - Positioned on the left */}
      <div className="flex items-center">
        <img
          src={image} // Update this path based on your logo location
          alt="Logo"
          className="w-16" // Adjust the width of the logo as needed
        />
      </div>

      {/* Navigation Links - Positioned on the right */}
      <nav>
        <ul className="flex space-x-8 mt-0">
          {["Home", "Service", "Blog", "Portfolio", "Contact"].map((item) => (
            <li key={item} className="relative">
              <a
                href="#"
                className="text-[#e7b308] text-lg font-itim no-underline relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[3px] after:w-0 after:bg-[#e7be04] after:transition-all after:duration-400 hover:after:w-full"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
