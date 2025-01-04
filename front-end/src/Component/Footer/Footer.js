import React from "react";

function Footer() {
  return (
    <footer
      className=" fixed bottom-0 w-full"
      style={{ backgroundColor: "#1F1301", padding: "3px 0" }}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-center mb-2">
          <h3 className="text-lg font-bold text-yellow-300">SEM ENA WORQ</h3>
        </div>

        <div className="flex items-center justify-between mb-2">
          <div className="flex-1"></div>

          <div className="flex justify-center">
            <div className="flex space-x-8">
              <a
                href="https://www.linkedin.com"
                target="_blank"
                className="text-yellow-200 hover:text-yellow-500 text-2xl"
              >
                <i className="fab fa-linkedin"></i>
              </a>
              <a
                href="https://www.facebook.com"
                target="_blank"
                className="text-yellow-200 hover:text-yellow-500 text-2xl"
              >
                <i className="fab fa-facebook"></i>
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                className="text-yellow-200 hover:text-yellow-500 text-2xl"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="https://www.twitter.com"
                target="_blank"
                className="text-yellow-200 hover:text-yellow-500 text-2xl"
              >
                <i className="fab fa-twitter"></i>
              </a>
            </div>
          </div>

          <div className="flex items-center flex-1 justify-end text-sm">
            <i
              className="fas fa-phone-volume text-yellow-250  text-l"
              style={{
                color: "#FDE047",
                marginRight: "1rem",
                fontSize: "1rem",
                verticalAlign: "middle",
              }}
            ></i>
            <span className="text-yellow-200 mr-6 text-lg">+251 969139025</span>
          </div>
        </div>

        <div className="flex justify-end items-center">
          <div className="flex items-center text-yellow-200 text-sm">
            <i
              className="fas fa-envelope text-yellow-250 mr-2 text-lg"
              style={{
                color: "#FDE047",
                marginRight: "0.25rem",
                fontSize: "1rem",
                verticalAlign: "middle",
              }}
            ></i>
            <p className="text-lg">info@erpethiopia.net</p>
          </div>
        </div>

        <p className="text-center mt-2 text-yellow-200 text-sm">
          &copy; 2024 SEM ENA WORQ . All Rights Reserved
        </p>
      </div>
    </footer>
  );
}

export default Footer;
