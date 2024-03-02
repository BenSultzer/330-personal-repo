// Overview: Practice Exercise 07
// Author: Ben Sultzer <bms3902@rit.edu>

/*
    main.js is primarily responsible for hooking up the UI to the rest of the application 
    and setting up the main event loop
*/

// We will write the functions in this file in the traditional ES5 way
// In this instance, we feel the code is more readable if written this way
// If you want to re-write these as ES6 arrow functions, to be consistent with the other files, go ahead!

// Import the drawing capabilities
import * as canvas from './canvas.js';

// Import the audio context, analyzer node, and audio interface functions
import * as audio from './audio.js';

// Import helper functions
import * as utils from './utils.js';

// Drawing options object
const drawParams = { 
    showGradient : true,
    showBars     : true,
    showCircles  : true,
    showNoise    : false,
    showInvert   : false,
    showEmboss   : false
};

// here we are faking an enumeration
const DEFAULTS = Object.freeze({
    sound1: "media/New Adventure Theme.mp3"
});

// Sets up the audio visualizer
// Parameters: None
// Returns: Nothing
function init() {
    // Starts creation of the audio graph with DEFAULTS.sound1 as the source
    audio.setUpWebAudio(DEFAULTS.sound1);
    console.log("init called");
    console.log(`Testing utils.getRandomColor() import: ${utils.getRandomColor()}`);
    let canvasElement = document.querySelector("canvas"); // hookup <canvas> element

    // Initialize the various UI elements of the audio visualizer
    setupUI(canvasElement);

    // Get the canvas ready for drawing
    canvas.setupCanvas(canvasElement, audio.analyserNode);

    // Set the checkboxes to be checked on load
    document.querySelector("#gradient-cb").checked = true;
    document.querySelector("#bars-cb").checked = true;
    document.querySelector("#circles-cb").checked = true;
    document.querySelector("#noise-cb").checked = false;
    document.querySelector("#invert-cb").checked = false;
    document.querySelector("#emboss-cb").checked = false;

    // Call the loop function for a constant stream of audio data from the analyser node
    loop();
}

// Hooks up the various UI elements of the audio visualizer
// "canvasElement" parameter: A reference to the canvas containing the audio visualizer
// Returns: Nothing
function setupUI(canvasElement) {
    // A - hookup fullscreen button
    const fsButton = document.querySelector("#fs-button");

    // add .onclick event to button
    fsButton.onclick = e => {
        console.log("goFullscreen() called");
        utils.goFullscreen(canvasElement);
    };

    // B - hookup play button
    const playButton = document.querySelector("#play-button");

    // add .onclick event to button
    playButton.onclick = e => {
        console.log(`audioCtx.state before = ${audio.audioCtx.state}`);

        // check if context is in suspended state (autoplay policy)
        if (audio.audioCtx.state == "suspended") {
            audio.audioCtx.resume();
        }
        console.log(`audioCtx.state after = ${audio.audioCtx.state}`);

        // Toggle playing/pausing
        if (e.target.dataset.playing == "no") {
            // if track is currently paused, play it
            audio.playCurrentSound();
            e.target.dataset.playing = "yes"; // our CSS will set the text to "Pause"
        } else {
            // if track IS playing, pause it
            audio.pauseCurrentSound();
            e.target.dataset.playing = "no"; // our CSS will set the text to "Play"
        }
    };

    // C - hookup volume slider & label
    let volumeSlider = document.querySelector("#volume-slider");
    let volumeLabel = document.querySelector("#volume-label");

    // add .oninput event to slider
    volumeSlider.oninput = e => {
        // set the gain
        audio.setVolume(e.target.value);
        // update value of label to match value of slider
        volumeLabel.innerHTML = Math.round((e.target.value / 2 * 100));
    };

    // set value of label to match initial value of slider
    volumeSlider.dispatchEvent(new Event("input"));

    // D - hookup track <select>
    let trackSelect = document.querySelector("#track-select");
    // add .onchange event to <select>
    trackSelect.onchange = e => {
        // Load next sound file
        audio.loadSoundFile(e.target.value);
        // pause the current track if it is playing
        if (playButton.dataset.playing == "yes") {
            playButton.dispatchEvent(new MouseEvent("click"));
        }
    };

    // E - hookup checkboxes
    document.querySelector("#gradient-cb").addEventListener("click", (e) => { drawParams.showGradient = e.target.checked; });
    document.querySelector("#bars-cb").addEventListener("click", (e) => { drawParams.showBars = e.target.checked; });
    document.querySelector("#circles-cb").addEventListener("click", (e) => { drawParams.showCircles = e.target.checked; });
    document.querySelector("#noise-cb").addEventListener("click", (e) => { drawParams.showNoise = e.target.checked; });
    document.querySelector("#invert-cb").addEventListener("click", (e) => { drawParams.showInvert = e.target.checked; });
    document.querySelector("#emboss-cb").addEventListener("click", (e) => { drawParams.showEmboss = e.target.checked; });
} // end setupUI

// Displays data from the analyzer node every frame
// Parameters: None
// Returns: Nothing
function loop() {
    // Start the animation loop with this function
    requestAnimationFrame(loop);

    // Visualize the audio data!
    canvas.draw(drawParams);    
}

// Make the init function public
export { init };