import React, { useState } from "react";
import "./Share.css";

function Share({ setShowShare, linkID }) {
  const [link, setLink] = useState("");
  const [showCopy, setShowCopy] = useState(false);

  const generateLink = () => {
    const newLink = `http://anahar1.github.io/meal-match/#/singlesession/${linkID}`;
    setLink(newLink);
    navigator.clipboard.writeText(newLink);
    setShowCopy(true);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span
          className="close"
          onClick={() => {
            setShowShare(false);
            setShowCopy(false);
          }}
        >
          &times;
        </span>
        <div className="share-header">
          <h2>Share the below link with you partner to get their choices</h2>
        </div>
        <div className="link-container">
          {link && (
            <div className="generated-link-container">
              <label>Share Link:</label>
              <div className="generated-link">
                <a href={link} target="_blank" rel="noreferrer">
                  {link}
                </a>
              </div>
              <br></br>
              <label>Click on the "Matched It" Tab After Your Partner Chooses</label>
            </div>
          )}
          <br /> {/* New line added here */}
        </div>
        <button className="generate-link-btn" onClick={generateLink}>
          {showCopy ? "Copy to Clipboard" : "Generate Link"}
        </button>
      </div>
    </div>
  );
}

export default Share;
