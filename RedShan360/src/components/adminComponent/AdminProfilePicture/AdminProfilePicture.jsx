import React, { useRef } from "react";
import defaultProfileAvatar from "../../../assets/default-profile.png";
import "./AdminProfilePicture.css";

function AdminProfilePicture({ currentPicture, onPictureUpload, onPictureDelete }) {
  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate type (JPG, PNG, GIF)
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      alert("Unsupported format. Please select a JPG, PNG, or GIF image.");
      return;
    }

    // Validate size (Max 2MB)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("File size exceeds 2 MB limit.");
      return;
    }

    // Convert file to Base64 data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      onPictureUpload(event.target.result);
    };
    reader.onerror = () => {
      alert("Failed to read image file.");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="profile-picture-container">
      {/* Avatar Circle Container */}
      <div className="avatar-circle-wrapper" onClick={handleUploadClick}>
        <img
          src={currentPicture || defaultProfileAvatar}
          alt="Avatar Preview"
          className="avatar-image-large"
        />
        {/* Overlay camera badge */}
        <div className="avatar-camera-overlay">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
            <circle cx="12" cy="13" r="4"></circle>
          </svg>
        </div>
      </div>

      {/* Picture Controls Block */}
      <div className="picture-info-controls">
        <div className="picture-text-meta">
          <h4>Profile Picture</h4>
          <p>JPG, GIF or PNG. Max size of 2MB.</p>
        </div>

        <div className="picture-action-buttons">
          <button
            type="button"
            className="btn-upload-new"
            onClick={handleUploadClick}
          >
            Upload New
          </button>

          {currentPicture && (
            <button
              type="button"
              className="btn-delete-pic"
              onClick={onPictureDelete}
            >
              Delete
            </button>
          )}

          {/* Hidden input trigger */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".jpg,.jpeg,.png,.gif"
            style={{ display: "none" }}
          />
        </div>
      </div>
    </div>
  );
}

export default AdminProfilePicture;
