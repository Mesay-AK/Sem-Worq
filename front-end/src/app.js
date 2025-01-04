// src/App.jsx
import React from "react";
import Footer from "./Component/Footer/Footer";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Dots from "./Component/Footer/paggingDot";
import BlogPage from "./Component/Footer/Blog";
import BlogComponent from "./Component/Footer/Blog";
import Layout from "./Component/layout";
import LoginPage from "./Login";
// import ContactUs from "./ContactUs";

// import "./App.css";
const App = () => {
  return (
    <div className="App">
      {/* Other components */}
      {/* <Layout /> */}
      <BlogPage/>
      
      {/* <LoginPage/> */}
      {/* <Footer /> */}
    </div>
  );
};

export default App;
