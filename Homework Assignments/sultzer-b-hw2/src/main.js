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

// Import the audio context, analyser node, and audio interface functions
import * as audio from './audio.js';

// Import helper functions
import * as utils from './utils.js';

// Variables to store the app title, audio file paths, track names, and app description
let title;
let audioFilePaths;
let trackNames;
let appDescription;

// Drawing options object
const appParams = {
    showParticleSystems: true,
    showParticles: true,
    showShift: false,
    showEmboss: false,
    useHighshelf: false,
    useLowshelf: false
};

// here we are faking an enumeration
const DEFAULTS = Object.freeze({
    sound1: "media/New Adventure Theme.mp3"
});

// Loads app data from a JSON file (app title, audio file paths/track titles for the song select element, and an app description)
// Parameters: None
// Returns: Nothing
const loadJson = () => {
    // Get the path to the JSON file and create an XHR object
    const url = "data/av-data.json";
    const xhr = new XMLHttpRequest();

    // Set up the onload event handler with an anonymous function that gets the data and places each data piece in its proper place in the page (takes the event handler's Event object as a parameter and returns nothing)
    xhr.onload = (e) => {
        let json;

        // Attempt to read in the JSON. Display an error in the app description paragraph tag if there was a problem
        try {
            json = JSON.parse(e.target.responseText);
        } catch {
            document.querySelector("#app-description").innerHTML = "An error occurred loading app set-up data.";
            return;
        }

        // Get all the keys from the JSON object
        const keys = Object.keys(json);

        // Assign each of the key values to the correct variable for the page
        title = json[keys[0]];
        audioFilePaths = json[keys[1]];
        trackNames = json[keys[2]];
        appDescription = json[keys[3]];

        // Set the title of the app
        document.querySelector("title").innerHTML = title;

        // Build the select element for songs
        for (let i = 0; i < audioFilePaths.length; i++) {
            if (trackNames[i] == "New Adventure Theme") {   // Make sure the "New Adventure Theme" track is selected by default
                document.querySelector("#track-select").innerHTML += `<option value="media/${audioFilePaths[i]}" selected>${trackNames[i]}</option>`;
            } else {
                document.querySelector("#track-select").innerHTML += `<option value="media/${audioFilePaths[i]}">${trackNames[i]}</option>`;
            }
        }

        // Set the app description paragraph
        document.querySelector("#app-description").innerHTML = appDescription;
    };
    // Set up the error event handler with an anonymous function that simply logs to the console the HTTP Status Code of the XHR object (takes the event handler's Event object as a parameter and returns nothing)
    xhr.onerror = e => console.log(`In onerror - HTTP Status Code = ${e.target.status}`);

    // Open a connection to the JSON file and send the request
    xhr.open("GET", url);
    xhr.send();
}

// Sets up the audio visualizer
// Parameters: None
// Returns: Nothing
function init() {
    // Starts creation of the audio graph with DEFAULTS.sound1 as the source
    audio.setUpWebAudio(DEFAULTS.sound1);
    console.log("init called");
    let canvasElement = document.querySelector("canvas"); // hookup <canvas> element

    // Initialize the various UI elements of the audio visualizer
    setupUI(canvasElement);

    // Get the canvas ready for drawing
    canvas.setupCanvas(canvasElement, audio.analyserNode);

    // Get initial app data from av-data.json
    loadJson();

    // The default track should be "New Adventure Theme"
    document.querySelector("#track-select").value = "media/New Adventure Theme.mp3";


    // Set the checkboxes to be checked on load
    document.querySelector("#particle-systems-cb").checked = true;
    document.querySelector("#particles-cb").checked = true;
    document.querySelector("#shift-cb").checked = false;
    document.querySelector("#emboss-cb").checked = false;
    document.querySelector("#highshelf-cb").checked = false;
    document.querySelector("#lowshelf-cb").checked = false;

    // The default value of the analyser data type should be "frequency"
    document.querySelector("#analyser-data-type").value = "frequency";

    // Set up the event handler for getting the current analyser data type to use for visualization
    document.querySelector("#analyser-data-type").onchange = () => { canvas.getAnalyserDataType(document.querySelector("#analyser-data-type").value) };

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

    // E - hookup track <select>
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

    // F - hookup checkboxes
    document.querySelector("#particle-systems-cb").addEventListener("click", (e) => { appParams.showParticleSystems = e.target.checked; });
    document.querySelector("#particles-cb").addEventListener("click", (e) => { appParams.showParticles = e.target.checked; });
    document.querySelector("#shift-cb").addEventListener("click", (e) => { appParams.showShift = e.target.checked; });
    document.querySelector("#emboss-cb").addEventListener("click", (e) => { appParams.showEmboss = e.target.checked; });
    document.querySelector("#highshelf-cb").addEventListener("click", (e) => {
        appParams.useHighshelf = e.target.checked;
        audio.toggleTreble(appParams); // Call the toggleTreble function to make sure the treble is turned on and off without making the treble node public
    });
    document.querySelector("#lowshelf-cb").addEventListener("click", (e) => {
        appParams.useLowshelf = e.target.checked;
        audio.toggleBass(appParams); // Call the toggleBass function to make sure the bass is turned on and off without making the bass node public
    });
} // end setupUI

// Displays data from the analyser node every frame
// Parameters: None
// Returns: Nothing
function loop() {
    // Start the animation loop with this function at 60 FPS
    setTimeout(loop, 1000 / 60);

    // Visualize the audio data!
    canvas.draw(appParams);
}

// Make the init function public
export { init };