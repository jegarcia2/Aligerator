# Aligerator 🧲

An interactive, playful note-taking application where you can organize your thoughts by dragging "magnets" around a canvas to pin falling notes in place.

## Overview

Aligerator is a React-based web application that explores creative interaction patterns. Instead of traditional note organization, it uses a physics-inspired metaphor where:
- **Magnets** are draggable image elements that users upload
- **Notes** are text snippets that fall down the canvas and disappear on their own
- When magnets and notes overlap, the notes become "pinned" and stop falling

This project demonstrates state management, event handling, and DOM manipulation in React, along with CSS animations and drag-and-drop interactions.

## Features

✨ **Core Functionality**
- Upload images to create draggable magnets
- Type notes and drop them onto the canvas
- Drag magnets around the canvas to reposition them
- Notes automatically fall off the screen (with animation)
- Magnets pin overlapping notes in place, pausing their animation
- Delete magnets with an X button
- Real-time magnet position updates and smooth animations

🎨 **User Experience**
- Responsive three-panel layout (left sidebar, main canvas, right sidebar)
- Visual feedback when grabbing magnets (scale up, enhanced shadow)
- Smooth drag rotation based on mouse velocity
- Falling notes with random tilt for organic appearance
- Intuitive keyboard shortcuts (Enter to submit notes, Shift+Enter for newlines)

## Getting Started

### Prerequisites
- Node.js 14.0 or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd aligerator

# Install dependencies
npm install

# Start the development server
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000) and automatically reload as you make changes.

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Project Structure

```
src/
├── App.js                 # Root component - manages application state
├── App.css                # Application-level styles
├── index.js               # React entry point
├── index.css              # Global styles
│
└── components/
    ├── Canvas.js          # Main interaction canvas (magnets + falling notes)
    ├── Canvas.css         # Canvas-specific styling
    ├── Sidebar.js         # Left sidebar for uploading magnets
    ├── Sidebar.css        # Sidebar styling
    ├── RightSidebar.js    # Right sidebar for creating notes
    └── RightSidebar.css   # Right sidebar styling
```

## Technical Highlights

### State Management
The app uses React hooks (`useState`, `useCallback`) to manage:
- **images**: Uploaded images that become magnets
- **magnets**: Active magnet elements with position (x, y)
- **notes**: Falling notes with text, position, and tilt

### Complex Interaction: Note Pinning System
One of the most interesting features is the pinning mechanism:

```javascript
// Each note tracks which magnets are holding it
pinnedByRef.current: Map<noteId, Set<magnetId>>
```

When a magnet is dragged and released:
1. Check collision between magnet bounds and all note bounds
2. Add magnet ID to the note's pinning set
3. Pause the note's falling animation if any magnet is pinning it
4. Resume animation when all pinning magnets are removed

This system allows multiple magnets to pin a single note, and notes to be released when magnets move away.

### Drag-and-Drop
- **Images to Canvas**: Uses HTML5 dataTransfer API to serialize image data
- **Magnets on Canvas**: Custom mouse event handling with position tracking and smooth transforms
- **Drag Rotation**: Real-time velocity calculation creates natural rotation feedback

### Animation Techniques
- CSS `@keyframes` for falling notes (custom `--tilt` CSS variable for per-instance rotation)
- Smooth easing functions for magnet transforms
- `requestAnimationFrame` for collision detection timing

## Key Implementation Details

### Why Refs?
The app uses refs (`useRef`) to manage:
- Canvas and magnet DOM elements (for position/collision detection)
- Drag state and offset tracking (for smooth drag interaction)
- Pinning relationships (for efficient state updates across renders)

This avoids re-rendering the entire canvas on every mouse move, keeping interactions performant.

### Canvas Coordinate System
All positions are stored in absolute pixel coordinates relative to the canvas:
- Notes use percentage-based horizontal positioning (`left: ${note.x * 100}%`)
- Magnets use absolute coordinates with CSS `transform: translate(-50%, -50%)` for centering

### Animation Cleanup
When a note's falling animation ends, the component:
1. Clears its entry from the pinning map
2. Triggers `onNoteExpired` callback
3. React removes the element from the DOM

## Development Workflow

### Available Scripts

- `npm start`: Run development server with hot reload
- `npm build`: Create production-optimized build
- `npm test`: Run the test suite (if configured)

### Making Changes

1. Edit component files in `src/`
2. Styles are co-located with components (`.css` files next to `.js` files)
3. Changes automatically reload in the browser
4. Console shows any lint or runtime errors

### Code Style
The project follows standard React conventions:
- Functional components with hooks
- Props passed down from parent to child
- Callbacks for child-to-parent communication
- CSS modules co-located with components for organization

## Learning Outcomes

This project demonstrates:
- **React fundamentals**: Hooks (useState, useCallback, useRef, useEffect), component composition
- **Advanced interaction**: Drag-and-drop, collision detection, animation state management
- **DOM manipulation**: getBoundingClientRect, ref tracking, programmatic style updates
- **Performance optimization**: Avoiding unnecessary re-renders with refs and callbacks
- **CSS animation**: @keyframes, custom properties (CSS variables), transforms, transitions

## Possible Extensions

Ideas for future enhancements:
- Save and load canvas state to localStorage or a backend
- Magnet customization (colors, sizes, custom images)
- Note categories with different falling speeds
- Multi-user collaboration with WebSockets
- Mobile touch support for tablet use
- Undo/redo functionality
- Sound effects for interactions

## Dependencies

- **react** (18.2.0): UI library
- **react-dom** (18.2.0): React rendering for web
- **react-scripts** (5.0.1): Build and development server tools

## License

This project is open source and available for educational and portfolio purposes.

---

**Questions or feedback?** Feel free to explore the code—it's written to be readable and well-structured for learning!
