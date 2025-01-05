import React from "react";
import image from "../assets/Logo.PNG";

const Navbar = () => {
  return (
    <header className="w-full h-30 bg-[#000000] flex items-center justify-between px-8 pt-3 ">
      
      <div className="flex items-center" pr-10 pt-10>
        <img
          src={image} 
          alt="Logo"
          className="w-24" 
        />
      </div>

    
      <nav>
        <ul className="flex space-x-10 pl-65 pr-8">
          {["Home", "Service", "Blog", "Portfolio", "Contact"].map((item) => (
            <li key={item} className="relative">
              <a
                href="#"
                className="text-[#DD9735] text-lg font-itim no-underline relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[3px] after:w-0 after:bg-[#DD9735] after:transition-all after:duration-400 hover:after:w-full"
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
