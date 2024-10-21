import React from "react";
import { Link } from "react-router-dom";
import "./Card.css";

function Card(props) {
  const fullname = `${props.firstname} ${props.lastname}`;

  // Function to handle hover events
  function handleHover(event, targetId) {
    const popup = document.getElementById(`popup-${targetId}`);
    popup.classList.add("show");
    setTimeout(() => {
      popup.classList.remove("show");
    }, 2000); // 2000 milliseconds (2 seconds) delay
  }

  return (
    <>
      <Link to={`/${props.id}`}>
        <div className="card">
          {props.imageURL && (
            <img
              className="cardpropic"
              src={`http://localhost:3001/${props.imageURL}`}
              alt="profile pic"
            />
          )}

          <div className="popup" onMouseEnter={(e) => handleHover(e, `bio-${props.id}`)}>
            <h4>{props.bio}</h4>
            <span className="popuptext" id={`popup-bio-${props.id}`}>
              Bio
            </span>
          </div>

          <div className="popup" onMouseEnter={(e) => handleHover(e, props.username)}>
            <h4>{props.username}</h4>
            <span className="popuptext" id={`popup-${props.username}`}>
              Username
            </span>
          </div>

          <div className="popup" onMouseEnter={(e) => handleHover(e, fullname)}>
            <h4>{fullname}</h4>
            <span className="popuptext" id={`popup-${fullname}`}>
              Name
            </span>
          </div>

          <div className="popup" onMouseEnter={(e) => handleHover(e, `email-${props.id}`)}>
            <h4>{props.email}</h4>
            <span className="popuptext" id={`popup-email-${props.id}`}>
              Email
            </span>
          </div>

          <div className="popup" onMouseEnter={(e) => handleHover(e, `job-${props.id}`)}>
            <h4>{props.currentJob}</h4>
            <span className="popuptext" id={`popup-job-${props.id}`}>
              Current Job
            </span>
          </div>

          <div className="popup" onMouseEnter={(e) => handleHover(e, `number-${props.id}`)}>
            <h4>{props.number}</h4>
            <span className="popuptext" id={`popup-number-${props.id}`}>
              Phone Number
            </span>
          </div>

          <div className="popup">
            <h4>Tags: {props.tags.join(", ")}</h4> {/* Display tags */}
          </div>
        </div>
      </Link>
    </>
  );
}

export default Card;
