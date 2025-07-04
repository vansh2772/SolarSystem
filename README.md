# 3D Solar System Simulation

A mobile-responsive, interactive 3D simulation of the solar system built with Three.js.

## Features
- Realistic 3D Sun and all 8 planets orbiting with accurate relative speeds
- Adjustable orbital speed for each planet via control panel
- Pause/Resume animation, reset, and dark/light theme toggle
- Hover for planet info, click to zoom on a planet
- Beautiful background stars and orbit lines
- Mobile-friendly UI
- Background music with mute/unmute button
- Color legend for planet identification

## Setup & Usage
1. **Clone or download this repository.**
2. **Install dependencies** (if using a local server):
   - `npm install` (if you want to use Vite or another dev server)
3. **Add music file:**
   - Download the music file from [Pixabay](https://pixabay.com/music/ambient-happy-me-134125/) or use your own.
   - Place it in the `assets/` folder as `happy-me-134125.mp3` (or update the `src` in `index.html` if you use a different name).
4. **Run locally:**
   - Open `index.html` directly in your browser **or**
   - Run `npx vite` or your preferred static server, then visit the local URL.

## How to Run on Your Desktop

### Option 1: Open Directly in Your Browser
1. Download or clone this repository to your computer.
2. Make sure the `assets/happy-me-134125.mp3` music file is present (see above).
3. Double-click `index.html` (or right-click and choose "Open with" your browser).
4. The simulation should load and run!

### Option 2: Use a Local Development Server (Recommended for Full Features)
Some browsers restrict certain features (like audio autoplay or module imports) when opening HTML files directly. Using a local server avoids these issues.

**If you have Node.js installed:**
1. Open a terminal in the project folder.
2. Run `npm install` (if you haven't already).
3. Run `npx vite` (or `npm run dev` if you have a script for it).
4. Open the local URL shown in the terminal (usually `http://localhost:5173/`).

**Or use a simple static server:**
- With Python 3: `python -m http.server`
- With VS Code: Use the "Live Server" extension and click "Go Live".

This will ensure all features (including music and module imports) work smoothly.

## Controls
- **Pause/Resume:** Spacebar or Pause button
- **Reset:** R key or Reset button
- **Theme:** T key or Theme button
- **Move Camera:** Arrow keys
- **Planet Info:** Hover over a planet
- **Zoom to Planet:** Click a planet
- **Toggle Control Panel:** ⚙️ button
- **Adjust Planet Speed:** Use sliders in the panel
- **Mute/Unmute Music:** Music button below controls

## Music Attribution
Music by [Keyframe Audio](https://pixabay.com/users/keyframe_audio-32058364/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=134125) from [Pixabay](https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=134125)

## License
This project is for educational/demo purposes. See music source for its specific license. 