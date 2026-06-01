import React, { useRef, useEffect, useState } from 'react';
import './Canvas.css';

const FILTER_NORMAL = `
  drop-shadow(0 0 4px white)
  drop-shadow(0 0 8px white)
  drop-shadow(0 0 12px white)
  drop-shadow(3px 6px 10px rgba(0,0,0,0.45))
`.trim();

const FILTER_GRABBED = `
  drop-shadow(0 0 4px white)
  drop-shadow(0 0 10px white)
  drop-shadow(0 0 18px white)
  drop-shadow(8px 22px 28px rgba(0,0,0,0.7))
`.trim();

function rectsOverlap(a, b) {
  return !(a.right < b.left || b.right < a.left || a.bottom < b.top || b.bottom < a.top);
}

function Canvas({ magnets, notes, onDrop, onMagnetMove, onDeleteMagnet, onNoteExpired }) {
  const canvasRef = useRef(null);
  const draggingId = useRef(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const lastMouseX = useRef(null);
  const [activeDragId, setActiveDragId] = useState(null);
  const [dragRotation, setDragRotation] = useState(0);

  const noteRefsMap = useRef(new Map());
  const magnetRefsMap = useRef(new Map());
  // noteId → Set<magnetId>: which magnets are currently holding each note
  const pinnedByRef = useRef(new Map());

  const applyPinState = (noteId) => {
    const noteEl = noteRefsMap.current.get(noteId);
    if (!noteEl) return;
    const pinners = pinnedByRef.current.get(noteId);
    noteEl.style.animationPlayState = (pinners && pinners.size > 0) ? 'paused' : 'running';
  };

  const releaseAllByMagnet = (magnetId) => {
    for (const [noteId, set] of pinnedByRef.current) {
      if (set.has(magnetId)) {
        set.delete(magnetId);
        applyPinState(noteId);
        if (set.size === 0) pinnedByRef.current.delete(noteId);
      }
    }
  };

  const dropMagnetOnNotes = (magnetId) => {
    const magnetEl = magnetRefsMap.current.get(magnetId);
    if (!magnetEl) return;
    const magnetRect = magnetEl.getBoundingClientRect();
    for (const [noteId, noteEl] of noteRefsMap.current) {
      if (rectsOverlap(magnetRect, noteEl.getBoundingClientRect())) {
        if (!pinnedByRef.current.has(noteId)) pinnedByRef.current.set(noteId, new Set());
        pinnedByRef.current.get(noteId).add(magnetId);
        applyPinState(noteId);
      }
    }
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (draggingId.current === null) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - dragOffset.current.x;
      const y = e.clientY - rect.top - dragOffset.current.y;
      onMagnetMove(draggingId.current, x, y);

      const dx = lastMouseX.current !== null ? e.clientX - lastMouseX.current : 0;
      lastMouseX.current = e.clientX;
      const target = Math.max(-18, Math.min(18, dx * 1.5));
      setDragRotation((prev) => prev + (target - prev) * 0.3);
    };

    const handleMouseUp = () => {
      const id = draggingId.current;
      draggingId.current = null;
      lastMouseX.current = null;
      setActiveDragId(null);
      setDragRotation(0);
      if (id !== null) {
        // Wait one frame for React to flush the final magnet position to DOM
        requestAnimationFrame(() => dropMagnetOnNotes(id));
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [onMagnetMove]);

  const handleMagnetMouseDown = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = canvasRef.current.getBoundingClientRect();
    const magnet = magnets.find((m) => m.id === id);
    dragOffset.current = {
      x: e.clientX - rect.left - magnet.x,
      y: e.clientY - rect.top - magnet.y,
    };
    draggingId.current = id;
    lastMouseX.current = e.clientX;
    releaseAllByMagnet(id);
    setActiveDragId(id);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e) => {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      const rect = canvasRef.current.getBoundingClientRect();
      onDrop(data.src, e.clientX - rect.left, e.clientY - rect.top);
    } catch (_) {}
  };

  return (
    <div
      ref={canvasRef}
      className="canvas"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {magnets.length === 0 && notes.length === 0 && (
        <div className="canvas-hint">
          Drag a magnet from the sidebar and drop it here
        </div>
      )}

      {notes.map((note) => (
        <div
          key={note.id}
          className="falling-note"
          ref={(el) => {
            if (el) noteRefsMap.current.set(note.id, el);
            else noteRefsMap.current.delete(note.id);
          }}
          style={{
            left: `${note.x * 100}%`,
            '--tilt': `${note.tilt}deg`,
          }}
          onAnimationEnd={() => {
            pinnedByRef.current.delete(note.id);
            onNoteExpired(note.id);
          }}
        >
          {note.text}
        </div>
      ))}

      {magnets.map((magnet) => {
        const grabbed = activeDragId === magnet.id;
        return (
          <div
            key={magnet.id}
            className="magnet-wrapper"
            ref={(el) => {
              if (el) magnetRefsMap.current.set(magnet.id, el);
              else magnetRefsMap.current.delete(magnet.id);
            }}
            style={{
              left: magnet.x,
              top: magnet.y,
              transform: 'translate(-50%, -50%)',
              rotate: grabbed ? `${dragRotation}deg` : '0deg',
              scale: grabbed ? '1.12' : '1',
              zIndex: grabbed ? 100 : 10,
              transition: grabbed
                ? 'scale 0.15s ease'
                : 'scale 0.3s ease, rotate 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            <img
              src={magnet.src}
              alt="Magnet"
              className="magnet"
              draggable="false"
              onMouseDown={(e) => handleMagnetMouseDown(e, magnet.id)}
              style={{
                filter: grabbed ? FILTER_GRABBED : FILTER_NORMAL,
                cursor: grabbed ? 'grabbing' : 'grab',
                userSelect: 'none',
                transition: grabbed ? 'filter 0.2s ease' : 'filter 0.3s ease',
                display: 'block',
              }}
            />
            {!grabbed && (
              <button
                className="magnet-delete"
                onClick={() => {
                  releaseAllByMagnet(magnet.id);
                  onDeleteMagnet(magnet.id);
                }}
                onMouseDown={(e) => e.stopPropagation()}
              >
                ✕
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Canvas;
