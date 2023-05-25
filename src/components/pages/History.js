import React, { useState, useEffect } from "react";
import { userMatchedList } from "./firebase";
import "./CreateDate.css";
import "./History.css";

export default function History(props) {
  const { userName } = props;
  const [gradientPosition, setGradientPosition] = useState({ x: 50, y: 50 });
  const [restaurants, setRestaurants] = useState([]);
  const [showRestaurants, setShowRestaurants] = useState(false);
  const [itemTimestamp, setItemTimestamp] = useState();

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const xPos = ((clientX / window.innerWidth) * 100).toFixed(2);
    const yPos = ((clientY / window.innerHeight) * 100).toFixed(2);
    setGradientPosition({ x: xPos, y: yPos });
  };

  useEffect(() => {
    const fetchUserMatchedList = async () => {
      const { selectedRestaurant, timestamp } = await userMatchedList(userName);
      if (selectedRestaurant) {
        setRestaurants(selectedRestaurant);
        setShowRestaurants(true);
        console.log("timestamp: ", timestamp);
        if (timestamp) {
          setItemTimestamp(timestamp);
        }
      } else {
        setRestaurants(null);
        setShowRestaurants(false);
      }
      console.log("res: ", selectedRestaurant);
      console.log("resto: ", itemTimestamp);
    };
    fetchUserMatchedList();
  }, []);

  return (
    <div clasName="history-container" onMouseMove={handleMouseMove}>
      <p className="info-text history">Track your MealMatches here:</p>
      <div
        className="background"
        style={{
          background: `linear-gradient(90deg, rgba(24, 136, 255, 0.1) 0%, rgba(24, 136, 255, 0.1) 50%, rgba(0, 0, 0, 0.5) 50%, rgba(0, 0, 0, 0.5) 100%), radial-gradient(circle at ${gradientPosition.x}% ${gradientPosition.y}%, #1888ff, #000)`,
        }}
      ></div>
      {showRestaurants && (
        <div className="restaurants-container">
          <h2>Matched Restaurants</h2>
          <li key={restaurants.restaurant.id} className="restaurant-container">
            <a
              href={"https://www.yelp.com/biz/" + restaurants.restaurant.alias}
              target="_blank"
              rel="noreferrer"
            >
              <div className="image-container">
                <img
                  src={restaurants.restaurant.image_url}
                  alt={restaurants.restaurant.name}
                />
              </div>
            </a>

            <div className="restaurant-details">
              <h3>{restaurants.restaurant.name}</h3>
              <p>
                <strong>Cuisine:</strong>{" "}
                {restaurants.restaurant.categories
                  .map((category) => category.title)
                  .join(", ")}
              </p>
              <p>
                <strong>Location:</strong>{" "}
                {restaurants.restaurant.location.address1},{" "}
                {restaurants.restaurant.location.city},{" "}
                {restaurants.restaurant.location.state},{" "}
                {restaurants.restaurant.location.zip_code}
              </p>
              <p>
                <strong>Rating:</strong> {restaurants.restaurant.rating}
              </p>
              <p>
                <strong>Reviews:</strong> {restaurants.restaurant.review_count}
              </p>
              <div className="restaurant-links-dir">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${restaurants.restaurant.coordinates.latitude},${restaurants.restaurant.coordinates.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Get Directions
                </a>
              </div>
            </div>
          </li>
        </div>
      )}
    </div>
  );
}
