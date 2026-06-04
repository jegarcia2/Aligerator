import React, { useState, useCallback } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import RightSidebar from './components/RightSidebar';

let nextId = 0;

function App() {
  // images: Uploaded image sources for magnet thumbnails
  // magnets: Active magnets on canvas with position (x, y) and image source
  // notes: Falling notes with text, position, and tilt angle
  const [images, setImages] = useState([]);
  const [magnets, setMagnets] = useState([]);
  const [notes, setNotes] = useState([]);

  const handleUpload = useCallback((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImages((prev) => [...prev, { id: nextId++, src: e.target.result }]);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((src, x, y) => {
    setMagnets((prev) => [...prev, { id: nextId++, src, x, y }]);
  }, []);

  const handleMagnetMove = useCallback((id, x, y) => {
    setMagnets((prev) => prev.map((m) => (m.id === id ? { ...m, x, y } : m)));
  }, []);

  const handleDeleteMagnet = useCallback((id) => {
    setMagnets((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const handleAddNote = useCallback((text) => {
    setNotes((prev) => [
      ...prev,
      {
        id: nextId++,
        text,
        x: 0.1 + Math.random() * 0.8,
        tilt: Math.random() * 10 - 5,
      },
    ]);
  }, []);

  const handleNoteExpired = useCallback((id) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <div className="app">
      <Sidebar images={images} onUpload={handleUpload} />
      <Canvas
        magnets={magnets}
        notes={notes}
        onDrop={handleDrop}
        onMagnetMove={handleMagnetMove}
        onDeleteMagnet={handleDeleteMagnet}
        onNoteExpired={handleNoteExpired}
      />
      <RightSidebar onAddNote={handleAddNote} />
    </div>
  );
}

export default App;
