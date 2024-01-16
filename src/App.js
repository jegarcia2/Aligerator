import React from 'react';
import './App.css';
import MagnetComponent from './components/Magnet';
import logoImage from './magnets/logo.png'; // Import the image

function App() {
  return (
    <div style={{ backgroundColor: "lightblue", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <MagnetComponent imageURL={logoImage} />
    </div>
  );
}

export default App;
