import React from "react";
import { X } from "lucide-react";
import "../../css/employee.css";

const ECustomizedItemCard = (props) => {
    return (
        <div className="blog-card">
            {/* Close button */}
            <button className="item-modal-close" onClick={props.onClose} aria-label="Close">
                <X size={18} />
            </button>

            {/* Image */}
            <figure className="blog-image-container">
                <img
                    src={props.image || "https://picsum.photos/id/114/800/600"}
                    alt={`Item ${props.ItemID}`}
                    className="blog-image"
                />
            </figure>

            {/* Body */}
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
                                <span className="blog-author-label">Flower Type:</span>
                                <span className="blog-author-val">{props.FlowerType || "N/A"}</span>
                            </div>
                            <div className="blog-author-row">
                                <span className="blog-author-label">Number Of Flowers:</span>
                                <span className="blog-author-val">{props.numberOfFlower || "N/A"}</span>
                            </div>
                            <div className="blog-author-row">
                                <span className="blog-author-label">Boquet Style:</span>
                                <span className="blog-author-val">{props.BoquetStyle || "N/A"}</span>
                            </div>
                            <div className="blog-author-row">
                                <span className="blog-author-label">Decorative Foliage:</span>
                                <span className="blog-author-val">{props.DecorativeFoliage || "N/A"}</span>
                            </div>
                            <div className="blog-author-row">
                                <span className="blog-author-label">Wrapping & Accents:</span>
                                <span className="blog-author-val">{props.WrappingAndAccents || "N/A"}</span>
                            </div>
                        </div>
                    </div>
                </header>
            </div>
        </div>
    );
};

export default ECustomizedItemCard;