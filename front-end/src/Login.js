import React from "react";
import { FaUser, FaLock } from "react-icons/fa";
import logo from "./assets/Logo.PNG"; // Ensure the path to your logo is correct

function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative">
      <img src={logo} alt="Logo" className="absolute top-5 left-9 w-16 h-16" />
      <div className="flex flex-col md:flex-row items-center w-full md:w-4/5 lg:w-3/4 xl:w-2/3 mt-16">
        <div className="hidden md:block md:w-1/2"></div>
        <div className="w-full md:w-1/2 bg-yellow-600 p-12 rounded-lg">
          <h2 className="text-4xl font-bold text-white text-center mb-8">
            Login
          </h2>
          <form>
            <div className="mb-6">
              <label
                className="block text-white font-bold mb-2"
                htmlFor="username"
              >
                Username
              </label>
              <div className="relative">
                <input
                  className="appearance-none border-none rounded-lg w-full py-3 px-4 text-black leading-tight focus:outline-none bg-yellow-300 peer"
                  id="username"
                  type="text"
                />
                <FaUser className="text-white mx-3 absolute right-0 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>
            <div className="mb-6">
              <label
                className="block text-white font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <input
                  className="appearance-none border-none rounded-lg w-full py-3 px-4 text-black leading-tight focus:outline-none bg-yellow-300"
                  id="password"
                  type="password"
                />
                <FaLock className="text-white mx-3 absolute right-0 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>
            <div className="flex items-center justify-between mb-4">
              <a
                className="inline-block align-baseline font-bold text-sm text-white hover:text-yellow-800 w-full text-right"
                href="#"
              >
                Forgot password?
              </a>
            </div>
            <div className="flex items-center justify-center">
              <button
                className="bg-white hover:text-yellow-700 text-lg text-yellow-400 font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full"
                type="button"
              >
                Login
              </button>
            </div>
            <div className="mt-4 text-center">
              <a
                className="text-l text-yellow-200 hover:text-yellow-300"
                href="#"
              >
                Create Account
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
