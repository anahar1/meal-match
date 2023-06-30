import React, { useState } from "react";
import "./CreateDate.css";
import Share from "./Share";
import { addUser } from "./firebase";

export default function CreateDate(props) {
  const { userName } = props;
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState(null);
  const [desirabilities, setDesirabilities] = useState({});
  const [showButton, setShowButton] = useState(false);
  const [gradientPosition, setGradientPosition] = useState({ x: 50, y: 50 });
  const [showShare, setShowShare] = useState(false);
  const [sessionID, setSessionID] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const get = Storage.prototype.getObj = function(key) {
      return JSON.parse(localStorage.getItem(key))
  }
  if(restaurants.length < 1 && get("restaurants")){
    setRestaurants(get("restaurants"));
    setShowButton(true);
  }
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const xPos = ((clientX / window.innerWidth) * 100).toFixed(2);
    const yPos = ((clientY / window.innerHeight) * 100).toFixed(2);
    setGradientPosition({ x: xPos, y: yPos });
  };
  const handleShare = async () => {
    const newID = await addUser(userName, restaurants, desirabilities);
    setSessionID(newID);
    setShowShare(true);
  };

  const handleShowRestaurants = async () => {
    setIsLoading(true);
    setRestaurants([]);
    desirabilities.length = 0;
    const cuisine1 = document.getElementById("cuisine1").value.toLowerCase();
    const location1 = document.getElementById("location1").value.toLowerCase();
    const cuisine2 = document.getElementById("cuisine2").value.toLowerCase();
    const location2 = document.getElementById("location2").value.toLowerCase();
    setShowButton(false);
    try {
      const apiKey = process.env.REACT_APP_API;
      const proxyUrl = "https://corsproxy.io/?";
      const url1 = "https://api.yelp.com/v3/businesses/search?categories="+cuisine1+"&location="+location1;
      const url2 = "https://api.yelp.com/v3/businesses/search?categories="+cuisine2+"&location="+location2;

      const response1 = await fetch(proxyUrl + url1, {
        headers: {
          Authorization: `Bearer ${apiKey}`
        },
      });
      let data1 = await response1.json();
      data1 = data1.businesses.sort((a, b) => b.rating - a.rating);
      data1 = data1.slice(0, 3);
      
      const response2 = await fetch(proxyUrl + url2, {
        headers: {
          Authorization: `Bearer ${apiKey}`
        }
      });
      let cuisine1and2 = [];
      let data2 = await response2.json();
      data2 = data2.businesses.sort((a, b) => b.rating - a.rating);
      //loop removes duplicates between 
      let i = 0;
      let j = 0;
      while(i < 3){
        console.log(data1[i].id);
        if(data1[i].id === data2[j].id){
          data2.splice(j, 1);
          j = 0;
          i++;
        } else {
          j++;
        }
      }
      data2 = data2.slice(0, 3);
      cuisine1and2 = data1.concat(data2);
      cuisine1and2 = cuisine1and2.sort((a, b) => b.rating - a.rating);
      setRestaurants([...cuisine1and2]);
      localStorage.clear();
      localStorage.setItem("name", userName);
      localStorage.setItem("restaurants", JSON.stringify(cuisine1and2));
      setShowButton(true);
      setError("");
      setIsLoading(false);
    } catch (err) {
      alert(err);
    }
  };

  const handleDesirability = (id, desirability) => {
    setDesirabilities({ ...desirabilities, [id]: desirability });
    console.log(desirabilities);
  };

  return (
    <div onMouseMove={handleMouseMove}>
      <div
        className="background"
        style={{
          background: `linear-gradient(90deg, rgba(24, 136, 255, 0.1) 0%, rgba(24, 136, 255, 0.1) 50%, rgba(0, 0, 0, 0.5) 50%, rgba(0, 0, 0, 0.5) 100%), radial-gradient(circle at ${gradientPosition.x}% ${gradientPosition.y}%, #1888ff, #000)`,
        }}
      ></div>
      <div className="create-date">
        <div className="create-date-container">
          <div className="create-date-container-title">Enter your choices</div>
          <div className="create-date-container-inputs">
            <div className="create-date-input-container">
              <label htmlFor="cuisine1">Cuisine</label>
              <input
                type="text"
                id="cuisine1"
                name="cuisine1"
                required
                placeholder="Enter cuisine"
              />
            </div>
            <div className="create-date-input-container">
              <label htmlFor="location1">Location</label>
              <input
                type="text"
                id = "location1"
                name = "location1"
                required
                placeholder="Seattle"
              />
            </div>
          </div>
        </div>
        <div className="create-date-container">
          <div className="create-date-container-title">
            Enter your partner's choices
          </div>
          <div className="create-date-container-inputs">
            <div className="create-date-input-container">
              <label htmlFor="cuisine2">Cuisine</label>
              <input
                type="text"
                id="cuisine2"
                name="cuisine2"
                required
                placeholder="Enter cuisine"
              />
            </div>
            <div className="create-date-input-container">
              <label htmlFor="location2">Location</label>
              <input
                type="text"
                id = "location2"
                name = "location2"
                required
                placeholder="New York City"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="create-btn-container">
        <button className="create-btn" onClick={handleShowRestaurants}>
          Show Restaurants
        </button>
      </div>
      {error && <p>{error}</p>}
      {isLoading ? (
        <div className="loading-spinner-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading...</div>
        </div>
      ) : (
        <div></div>
      )}

      { restaurants.length > 0 && (
        <div className="restaurants-container">
          <h2>Top Restaurants</h2>
          <ul className="all-restaurants">
            {restaurants.map((restaurant) => (
              <li key={restaurant.id} className="restaurant-container">
                <a
                  href={"https://www.yelp.com/biz/" + restaurant.alias}
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="image-container">
                    <img src={restaurant.image_url} alt={restaurant.name} />
                  </div>
                </a>

                <div className="restaurant-details">
                  <h3>{restaurant.name}</h3>
                  <p>
                    <strong>Cuisine:</strong>{" "}
                    {restaurant.categories
                      .map((category) => category.title)
                      .join(", ")}
                  </p>
                  <p>
                    <strong>Location:</strong> {restaurant.location.address1},{" "}
                    {restaurant.location.city}, {restaurant.location.state},{" "}
                    {restaurant.location.zip_code}
                  </p>
                  <p>
                    <strong>Rating:</strong> {restaurant.rating}
                  </p>
                  <p>
                    <strong>Reviews:</strong> {restaurant.review_count}
                  </p>
                  {/* <p>
                    <strong>Website:</strong>{" "}
                    <div className="generated-link">
                      <a
                        href={"https://www.yelp.com/biz/" + restaurant.alias}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {"https://www.yelp.com/biz/" + restaurant.alias}
                      </a>
                    </div>
                  </p> */}

                  <div className="desirability-container">
                    <p>How badly do you want to eat here?</p>
                    <div className="desirability-buttons">
                      {[...Array(10)].map((_, index) => (
                        <button
                          key={index}
                          className={`desirability-level ${
                            index + 1 <= desirabilities[restaurant.id]
                              ? "active"
                              : ""
                          }`}
                          onClick={() =>
                            handleDesirability(restaurant.id, index + 1)
                          }
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </li>
            ))}
            {showButton && (
              <div className="create-btn-container">
                <button className="create-btn" onClick={() => handleShare()}>
                  Share With Partner
                </button>
              </div>
            )}
          </ul>
        </div>
      )}
      {showShare && (
        <Share setShowShare={setShowShare} linkID={parseInt(sessionID) + 1} />
      )}
    </div>
  );
}
