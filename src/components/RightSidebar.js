import React, { useState } from 'react';
import './RightSidebar.css';

function RightSidebar({ onAddNote }) {
  const [text, setText] = useState('');

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onAddNote(trimmed);
    setText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="right-sidebar">
      <span className="right-sidebar-title">Notes</span>
      <p className="right-sidebar-desc">
        Notes fall off and vanish on their own.
      </p>
      <textarea
        className="note-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={'Write a note...\n\nEnter to post,\nShift+Enter for newline.'}
        rows={5}
      />
      <button
        className="note-submit"
        onClick={submit}
        disabled={!text.trim()}
      >
        Drop it
      </button>
    </div>
  );
}

export default RightSidebar;
