import React, { useState, useRef } from 'react';
import axios from 'axios';
import './MagnetComponent.css'; // Import the CSS

const MagnetComponent = ({ imageURL }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const imgRef = useRef(null);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);

    const img = imgRef.current;
    if (img) {
      const imgRect = img.getBoundingClientRect();
      setOffset({
        x: e.clientX - imgRect.left,
        y: e.clientY - imgRect.top,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const img = imgRef.current;
      if (img) {
        img.style.left = e.clientX - offset.x + 'px';
        img.style.top = e.clientY - offset.y + 'px';
      }
    }
  };

  return (
    <img
      ref={imgRef}
      src={imageURL}
      alt="Magnet"
      className="magnet"
      draggable="false"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      style={{
        cursor: isDragging ? 'grabbing' : 'grab',
        position: 'absolute',
        left: 0,
        top: 0,
      }}
    />
  );
};

export default MagnetComponent;
