import React from "react";
import image from "../assets/Logo.PNG";

const Navbar = () => {
  return (
    <header className="w-full h-40 bg-[#f8f8f2] flex items-center justify-between px-8">
      
      <div className="flex items-center">
        <img
          src={image}
          alt="Logo"
          className="w-24" 
        />
      </div>

      
      <nav>
        <ul className="flex space-x-8">
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
