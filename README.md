# Minesweeper Game

A classic implementation of the Minesweeper puzzle game built with HTML, CSS, and JavaScript.

## Features

- **Three Difficulty Levels:**
  - Beginner: 9x9 grid with 10 mines
  - Intermediate: 16x16 grid with 40 mines
  - Expert: 30x16 grid with 99 mines

- **Game Mechanics:**
  - Left-click to reveal cells
  - Right-click to flag/unflag suspected mines
  - Auto-reveal empty areas when clicking on cells with no adjacent mines
  - Timer to track game duration
  - Mine counter showing remaining unflagged mines

- **Visual Features:**
  - Modern, responsive design
  - Color-coded numbers for adjacent mine counts
  - Smooth animations and hover effects
  - Game over overlay with win/lose messages
  - Emoji-based reset button that changes based on game state

## How to Play

1. **Objective:** Reveal all cells that don't contain mines without triggering any mines.

2. **Basic Controls:**
   - **Left Click:** Reveal a cell
   - **Right Click:** Flag/unflag a cell as a suspected mine

3. **Game Rules:**
   - Numbers indicate how many mines are adjacent to that cell
   - If you click on a mine, you lose the game
   - If you reveal all non-mine cells, you win
   - The first click is always safe (mines are placed after the first click)

4. **Strategy Tips:**
   - Use the numbers to deduce where mines are located
   - Flag cells you're certain contain mines
   - Start with cells that have fewer adjacent mines
   - Look for patterns and use logical deduction

## Files Structure

```
minesweeper/
├── index.html      # Main HTML structure
├── style.css       # Styling and animations
├── script.js       # Game logic and functionality
└── README.md       # This documentation
```

## Getting Started

1. Clone or download the project files
2. Open `index.html` in a web browser
3. Select your preferred difficulty level
4. Click "New Game" to start playing

## Technical Implementation

- **Object-Oriented Design:** The game is implemented using a `Minesweeper` class
- **Event-Driven:** Uses event listeners for user interactions
- **Responsive Design:** Works on desktop and mobile devices
- **Modern CSS:** Uses Flexbox, Grid, and CSS animations
- **Vanilla JavaScript:** No external dependencies required

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

Potential features that could be added:
- High score tracking
- Custom difficulty settings
- Sound effects
- Multiplayer mode
- Themes and customization options
- Hint system

Enjoy playing Minesweeper!
