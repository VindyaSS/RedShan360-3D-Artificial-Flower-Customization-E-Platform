import React from "react";
import { X } from "lucide-react";
import "../../css/employee.css";

// ---------------- NORMAL ITEM DETAILS CARD ----------------
const ENormalItemCard = (props) => {
  return (
    <div className="blog-card">
      <button className="item-modal-close" onClick={props.onClose} aria-label="Close">
        <X size={18} />
      </button>

      <figure className="blog-image-container">
        <img
          src={props.image || "https://picsum.photos/id/114/800/600"}
          alt={`Item ${props.ItemID}`}
          className="blog-image"
        />
      </figure>

      <div className="blog-content">
        <header className="blog-header">
          <div>
            <h3 className="blog-title">Item Details</h3>
            <div className="blog-author-details">
              <div className="blog-author-row">
                <span className="blog-author-label">Item Id:</span>
                <span className="blog-author-val">{props.ItemID}</span>
              </div>
              <div className="blog-author-row">
                <span className="blog-author-label">Number Of Flowers:</span>
                <span className="blog-author-val">{props.numberOfFlower || "N/A"}</span>
              </div>
              <div className="blog-author-row">
                <span className="blog-author-label">Wrapping Paper:</span>
                <span className="blog-author-val">{props.wrappinPaper || "N/A"}</span>
              </div>
              <div className="blog-author-row">
                <span className="blog-author-label">Ribbon Type:</span>
                <span className="blog-author-val">{props.ribbonType || "N/A"}</span>
              </div>
              <div className="blog-author-row">
                <span className="blog-author-label">Extra Add On:</span>
                <span className="blog-author-val">{props.extraAddOn || "N/A"}</span>
              </div>
            </div>
          </div>
        </header>
      </div>
    </div>
  );
};

export default ENormalItemCard;