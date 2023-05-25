import React, { useState, useEffect } from "react";
import "./CreateDate.css";
import { getInvite, addSelectedRestaurant } from "./firebase";
import { useParams } from "react-router-dom";
import Modal from "react-modal";
import "./SingleSession.css";

export default function SingleSession() {
  const { sessionID } = useParams();
  const [userName, setUserName] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [desirabilities1, setDesirabilities1] = useState({});
  const [desirabilities2, setDesirabilities2] = useState({});
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gradientPosition, setGradientPosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const fetchInviteData = async () => {
      const inviteData = await getInvite(sessionID);
      if (inviteData) {
        setUserName(inviteData.userName);
        setRestaurants(inviteData.restaurants);
        setDesirabilities1(inviteData.desirabilities);
      }
    };
    fetchInviteData();
  }, [sessionID]);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const xPos = ((clientX / window.innerWidth) * 100).toFixed(2);
    const yPos = ((clientY / window.innerHeight) * 100).toFixed(2);
    setGradientPosition({ x: xPos, y: yPos });
  };

  const handleDesirability2 = (id, desirability) => {
    setDesirabilities2({ ...desirabilities2, [id]: desirability });
    console.log(desirabilities2);
  };

  // const handleConfirmChoice = async () => {
  //   addSelectedRestaurant(userName, selectedRestaurant)
  //     .then(() => {
  //       alert("Selected restaurant has been added to"+userName+"'s list successfully!");
  //     })
  //     .catch((error) => {
  //       console.log("Error adding selected restaurant:", error);
  //     });
  //     setShowPopup(false);
  // };

  const handleConfirmChoice = async () => {
    try {
      const timestamp = new Date();
      await addSelectedRestaurant(userName, selectedRestaurant, timestamp);
      setShowPopup(false);
      setIsModalOpen(true);
    } catch (error) {
      console.log("Error adding selected restaurant:", error);
    }
  };
  

  const findMealMatch = () => {
    const bestRestaurant = restaurants.reduce(
      (best, restaurant) => {
        const score =
          (desirabilities1[restaurant.id] || 0) +
          (desirabilities2[restaurant.id] || 0);
        if (score > best.score) {
          return { restaurant, score };
        } else if (score === best.score) {
          return { restaurant: null, score };
        } else {
          return best;
        }
      },
      { restaurant: null, score: 0 }
    );
    setShowPopup(true);
    setSelectedRestaurant(bestRestaurant);
  };

  return (
    <div onMouseMove={handleMouseMove}>
      <div
        className="background"
        style={{
          background: `linear-gradient(90deg, rgba(24, 136, 255, 0.1) 0%, rgba(24, 136, 255, 0.1) 50%, rgba(0, 0, 0, 0.5) 50%, rgba(0, 0, 0, 0.5) 100%), radial-gradient(circle at ${gradientPosition.x}% ${gradientPosition.y}%, #1888ff, #000)`,
        }}
      ></div>
      {restaurants.length > 0 && (
        <div className="restaurants-container">
          <h2>Rate the below Restaurants</h2>
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
                            index + 1 <= desirabilities2[restaurant.id]
                              ? "active"
                              : ""
                          }`}
                          onClick={() =>
                            handleDesirability2(restaurant.id, index + 1)
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
            {/* {showButton && <div className="create-btn-container">
              <button className="create-btn" onClick={() => handleShare()}>
                Share
              </button>
            </div>} */}
          </ul>
        </div>
      )}
      <div className="create-btn-container">
        <button className="create-btn" onClick={findMealMatch}>
          Find MealMatch
        </button>
      </div>
      <div>Here: {sessionID}</div>
      {selectedRestaurant && showPopup && (
        <div className="popup">
          {selectedRestaurant.restaurant ? (
            <div>
              <h2>Most Matched Restaurant:</h2>
              <div className="restaurant-details">
                <a
                  href={selectedRestaurant.restaurant.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="restaurant-image">
                    <img
                      src={selectedRestaurant.restaurant.image_url}
                      alt={selectedRestaurant.restaurant.name}
                    />
                  </div>
                </a>

                <div className="restaurant-info">
                  <h3>{selectedRestaurant.restaurant.name}</h3>
                  <div className="restaurant-ratings">
                    <span className="rating">
                      Rating: {selectedRestaurant.restaurant.rating}
                    </span>
                    <span className="review-count">
                      ({selectedRestaurant.restaurant.review_count} reviews)
                    </span>
                  </div>
                  <div className="restaurant-links">
                    <a onClick={handleConfirmChoice}>Confirm Choice</a>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${selectedRestaurant.restaurant.coordinates.latitude},${selectedRestaurant.restaurant.coordinates.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Get Directions
                    </a>
                  </div>
                </div>
              </div>
              {/* <p>Score: {selectedRestaurant.score}</p> */}
            </div>
          ) : (
            <div>
              <h2>Most Matched Restaurants(Tie):</h2>
              {restaurants
                .filter((restaurant) => {
                  const score =
                    (desirabilities1[restaurant.id] || 0) +
                    (desirabilities2[restaurant.id] || 0);
                  return score === selectedRestaurant.score;
                })
                .map((restaurant) => (
                  <div key={restaurant.id}>
                    <div className="restaurant-details">
                      <a href={restaurant.url} target="_blank" rel="noreferrer">
                        <div className="restaurant-image">
                          <img
                            src={restaurant.image_url}
                            alt={restaurant.name}
                          />
                        </div>
                      </a>
                      <div className="restaurant-info">
                        <h3>{restaurant.name}</h3>

                        <div className="restaurant-ratings">
                          <span className="rating">
                            Rating: {restaurant.rating}
                          </span>
                          <span className="review-count">
                            ({restaurant.review_count} reviews)
                          </span>
                        </div>
                        <div className="restaurant-links">
                          <a onClick={handleConfirmChoice}>Confirm Choice</a>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${restaurant.coordinates.latitude},${restaurant.coordinates.longitude}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Get Directions
                          </a>
                        </div>
                      </div>
                    </div>
                    {/* <p>Score: {selectedRestaurant.score}</p> */}
                  </div>
                ))}
            </div>
          )}
          <button onClick={() => setSelectedRestaurant(null)}>Close</button>
        </div>
      )}
      <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)}>
        <div className="modal-content">
          <h2>Success!</h2>
          <p>{`Selected restaurant has been added to ${userName}'s list successfully!`}</p>
          <button onClick={() => setIsModalOpen(false)}>OK</button>
        </div>
      </Modal>
    </div>
  );
}
