import React, { useState } from "react";
import { FaBarsStaggered, FaXmark } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import home from "../public/home.png";
import notteknektene from "../public/notteknektene.png";
import fallingSand from "../public/fallingSand.png";
import juleol from "../public/juleol.webp";
import "./styles.css";

export default function Index() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const navigate = useNavigate();

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const handleBackToMain = () => {
    navigate("/");
  };

  return (
    <div className="index-background">
      <div className="backButton" onClick={handleBackToMain}>
        <IoArrowBackCircleOutline />
      </div>
      <div data-nav={isNavOpen ? "true" : "false"}>
        <main className={isNavOpen ? "shifted" : ""}></main>

        <nav id="nav">
          <div id="nav-links">
            <Link className="nav-link" to="/">
              <h2 className="nav-link-label rubik-font">Home</h2>
              <img className="nav-link-image" src={home} alt="Home" />
            </Link>
            <Link className="nav-link" to="./auth/login">
              <h2 className="nav-link-label rubik-font">Nøtteknektene</h2>
              <img
                className="nav-link-image"
                src={notteknektene}
                alt="Nøtteknektene"
              />
            </Link>
            <Link className="nav-link" to="/fs">
              <h2 className="nav-link-label rubik-font">Falling Sand</h2>
              <img
                className="nav-link-image"
                src={fallingSand}
                alt="Falling Sand"
              />
            </Link>
            <Link className="nav-link" to="/jo">
              <h2 className="nav-link-label rubik-font">Juleøl</h2>
              <img className="nav-link-image" src={juleol} alt="Juleøl" />
            </Link>
          </div>
        </nav>

        <div className="buttonContainer">
          <button id="nav-toggle" type="button" onClick={toggleNav}></button>

          {isNavOpen && <FaXmark className="nav-icon close-icon" />}
          <FaBarsStaggered className="nav-icon open-icon" />
        </div>
      </div>
    </div>
  );
}
