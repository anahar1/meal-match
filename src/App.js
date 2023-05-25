import React, { useState } from "react";
import Navbar from "./components/Navbar";
import "./App.css";
import { Link, Routes, Route, Navigate } from "react-router-dom";
import CreateDate from "./components/pages/CreateDate";
import History from "./components/pages/History";
import SingleSession from "./components/pages/SingleSession";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState("");

  const [gradientPosition, setGradientPosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const xPos = ((clientX / window.innerWidth) * 100).toFixed(2);
    const yPos = ((clientY / window.innerHeight) * 100).toFixed(2);
    setGradientPosition({ x: xPos, y: yPos });
  };

  const handleLogin = () => {
    if (name !== "") {
      setIsLoggedIn(true);
      localStorage.setItem("name", name);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <>
      {isLoggedIn ? (
        <>
          <Navbar onLogout={handleLogout} userName={name} />
          <Routes>
            <Route path="/" element={<Navigate to="/createdate" />} />
            <Route
              path="/createdate"
              element={<CreateDate userName={name} />}
            />
            <Route path="/history" element={<History userName={name} />} />
          </Routes>
        </>
      ) : (
        <>
          <nav className="navbar">
            <Link to="/" className="navbar-logo">
              MealMatch
              <i class="fab fa-firstdraft" />
            </Link>
            <div className="menu-icon">
              <i className={"fas fa-times"} />
            </div>
          </nav>
          <>
            {window.location.href.indexOf("singlesession") > -1 ? (
              <>
                <Routes>
                  <Route
                    path="/singlesession/:sessionID"
                    element={<SingleSession />}
                  />
                </Routes>
              </>
            ) : (
              <div className="login-screen" onMouseMove={handleMouseMove}>
                <p className="info-text">
                  Having trouble in choosing a restaurant to dine with your
                  partner?{" "}
                  <p className="inner-text">
                    Look no further, as MealMatch is here to solve this problem.
                    Say goodbye to the hassle of deciding where to go. Simply
                    choose the cuisine you and your partner desire, enter the
                    location, rate your preferences, and share the link with
                    your partner to receive their choices. With MealMatch, your
                    dining destination will be finalized effortlessly. Don't
                    hesitate any longer – begin by entering your name.
                  </p>
                </p>
                <div className="create-date-container app">
                  <div
                    className="background"
                    style={{
                      background: `linear-gradient(90deg, rgba(24, 136, 255, 0.1) 0%, rgba(24, 136, 255, 0.1) 50%, rgba(0, 0, 0, 0.5) 50%, rgba(0, 0, 0, 0.5) 100%), radial-gradient(circle at ${gradientPosition.x}% ${gradientPosition.y}%, #1888ff, #000)`,
                    }}
                  ></div>
                  <div className="create-date-container-title">
                    Login To Find Your Perfect MealMatch
                  </div>
                  <br /> {/* New line added here */}
                  <br /> {/* New line added here */}
                  <div className="create-date-container-inputs">
                    <div className="create-date-input-container">
                      <label htmlFor="cuisine1"> User Name :</label>
                      <input
                        type="text"
                        id="cuisine1"
                        name="cuisine1"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <br /> {/* New line added here */}
                    <Link to="/createdate">
                      <button onClick={handleLogin} className="login-button">
                        Log In
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </>
        </>
      )}
    </>
  );
};

export default App;
