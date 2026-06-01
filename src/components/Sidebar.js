import React, { useRef } from 'react';
import './Sidebar.css';

function Sidebar({ images, onUpload }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) onUpload(file);
    e.target.value = '';
  };

  const handleDragStart = (e, image) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ src: image.src }));
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-title">Magnets</span>
        <button className="upload-btn" onClick={() => fileInputRef.current.click()}>
          + Upload
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>

      <div className="sidebar-images">
        {images.length === 0 && (
          <p className="sidebar-empty">Upload an image to create your first magnet.</p>
        )}
        {images.map((image) => (
          <div
            key={image.id}
            className="sidebar-magnet"
            draggable
            onDragStart={(e) => handleDragStart(e, image)}
          >
            <img src={image.src} alt="magnet thumbnail" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
