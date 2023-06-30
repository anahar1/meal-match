import React, { useState, useEffect } from "react";
import { userMatchedList } from "./firebase";
import "./CreateDate.css";
import "./History.css";

export default function History(props) {
  const { userName } = props;
  const [gradientPosition, setGradientPosition] = useState({ x: 50, y: 50 });
  const [restaurant, setRestaurant] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [showRestaurant, setShowRestaurant] = useState(false);
  const [itemTimestamp, setItemTimestamp] = useState("");
  const [showRestaurants, setShowRestaurants] = useState(false);
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const xPos = ((clientX / window.innerWidth) * 100).toFixed(2);
    const yPos = ((clientY / window.innerHeight) * 100).toFixed(2);
    setGradientPosition({ x: xPos, y: yPos });
  };

  useEffect(() => {
    const fetchUserMatchedList = async () => {
      const { selectedRestaurant, timestamp, history } = await userMatchedList(userName);
      if (selectedRestaurant) {
        setRestaurant(selectedRestaurant);
        setShowRestaurant(true);
        let time = "" + new Date(timestamp.seconds)
        setItemTimestamp(time);
      } else {
        setRestaurant(null);
        setShowRestaurant(false);
      }
      if(history){
        history.pop();
        setRestaurants([...history]);
        setShowRestaurants(true);
      } else {
        setRestaurants([]);
        setShowRestaurants(false);
      }
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
      {showRestaurant && (
        <div className="restaurants-container">
          <h2>Recently Matched Restaurant</h2>
          <li key={restaurant.restaurant.id} className="restaurant-container">
            <a
              href={"https://www.yelp.com/biz/" + restaurant.restaurant.alias}
              target="_blank"
              rel="noreferrer"
            >
              <div className="image-container">
                <img className = "shadow"
                  src={restaurant.restaurant.image_url}
                  alt={restaurant.restaurant.name}
                />
              </div>
            </a>

            <div className="restaurant-details">
              <h3>{restaurant.restaurant.name}</h3>
              <p>
                <strong>Cuisine:</strong>{" "}
                {restaurant.restaurant.categories
                  .map((category) => category.title)
                  .join(", ")}
              </p>
              <p>
                <strong>Location:</strong>{" "}
                {restaurant.restaurant.location.address1},{" "}
                {restaurant.restaurant.location.city},{" "}
                {restaurant.restaurant.location.state},{" "}
                {restaurant.restaurant.location.zip_code}
              </p>
              <p>
                <strong>Rating:</strong> {restaurant.restaurant.rating}
              </p>
              <p>
                <strong>Reviews:</strong> {restaurant.restaurant.review_count}
              </p>
              <p>
                <strong>Date Chosen: </strong> { itemTimestamp }
              </p>
              <div className="restaurant-links-dir">
                <a className = "shadow"
                  href={`https://www.google.com/maps/search/?api=1&query=${restaurant.restaurant.coordinates.latitude},${restaurant.restaurant.coordinates.longitude}`}
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
      {showRestaurants && (
        <div className="restaurants-container">
          <h2>Previous Matches</h2>
          {restaurants.map((restaur) => (
              <li key={restaur.selectedRestaurant.restaurant.id} className="restaurant-container">
                <a
                  href={"https://www.yelp.com/biz/" + restaur.selectedRestaurant.restaurant.alias}
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="image-container">
                    <img src={restaur.selectedRestaurant.restaurant.image_url} alt={restaur.selectedRestaurant.restaurant.name} />
                  </div>
                </a>

                <div className="restaurant-details">
                  <h3>{restaur.selectedRestaurant.restaurant.name}</h3>
                  <p>
                    <strong>Cuisine:</strong>{" "} 
                    {restaur.selectedRestaurant.restaurant.categories.map((category) => category.title).join(", ")}
                  </p>
                  <p>
                    <strong>Location:</strong> {restaur.selectedRestaurant.restaurant.location.address1},{" "}
                    {restaur.selectedRestaurant.restaurant.location.city}, {restaur.selectedRestaurant.restaurant.location.state},{" "}
                    {restaur.selectedRestaurant.restaurant.location.zip_code}
                  </p>
                  <p>
                    <strong>Rating:</strong> {restaur.selectedRestaurant.restaurant.rating}
                  </p>
                  <p>
                    <strong>Reviews:</strong> {restaur.selectedRestaurant.restaurant.review_count}
                  </p>
                  <div className="restaurant-links-dir">
                    <a className = "shadow"
                      href={`https://www.google.com/maps/search/?api=1&query=${restaur.selectedRestaurant.restaurant.coordinates.latitude},${restaur.selectedRestaurant.restaurant.coordinates.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Get Directions
                    </a>
                  </div>
                </div>
              </li>
            ))}
        </div>
      )}
    </div>
  );
}
