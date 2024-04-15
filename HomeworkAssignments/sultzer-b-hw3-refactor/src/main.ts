// Overview: Homework 3
// Author: Ben Sultzer <bms3902@rit.edu>

/*
    main.ts is primarily responsible for hooking up the UI to the rest of the application 
    and setting up the main event loop
*/

// We will write the functions in this file in the traditional ES5 way
// In this instance, we feel the code is more readable if written this way
// If you want to re-write these as ES6 arrow functions, to be consistent with the other files, go ahead!

// Import the drawing capabilities
import * as canvas from './canvas';

// Import the audio context, analyser node, and audio interface functions
import * as audio from './audio';

// Import helper functions
import * as utils from './utils';

// Variables to store the app title, audio file paths, track names, and app description
let title:string;
let audioFilePaths:string[];
let trackNames:string[];
let appDescription:string;

// Drawing options object
interface AppParams {
    showParticleSystems: boolean,
    showParticles: boolean,
    partyMode: boolean,
    showEmboss: boolean
}

// Create an object of the AppParams type to represent the options for this app
const appParams:AppParams = { showParticleSystems: true, showParticles: true, partyMode: false, showEmboss: false };

// The default song to play
let defaultTrack:string = "media/New Adventure Theme.mp3";

// Function for detecting where the canvas was clicked and generating a shockwave that radiates from that point, pushing the central particles out of the way
// "e" parameter: The event object sent back by the click event listener
// Returns: Nothing
const canvasClicked = (e:PointerEvent): void => {
    // Gets information about the clicked area to convert into canvas space
    let rectTarget = e.target as HTMLCanvasElement;         // Gets the element that was clicked as a canvas element
    let rect:DOMRect = rectTarget.getBoundingClientRect();  // Gets position and size information of the canvas element relative to the viewport

    // Calculates where the canvas was clicked relative to its own top-left corner rather than the viewport
    let mouseX:number = e.clientX - rect.x;
    let mouseY:number = e.clientY - rect.y;

    // Indicates the canvas was clicked, sending the coordinates and triggering the shockwave for each central particle
    for (let i:number = 0; i < canvas.centralParticles.length; i++) {
        canvas.centralParticles[i].exertShockwave(mouseX, mouseY);
    }    
}

// Loads app data from a JSON file (app title, audio file paths/track titles for the song select element, and an app description)
// Parameters: None
// Returns: Nothing
const loadJson = (): void => {
    // Get the path to the JSON file and create an XHR object
    const url:string = "data/av-data.json";
    const xhr:XMLHttpRequest = new XMLHttpRequest();

    // Set up the onload event handler with an anonymous function that gets the data and places each data piece in its proper place in the page (takes the event handler's Event object as a parameter and returns nothing)
    xhr.onload = (e:ProgressEvent<EventTarget>): void => {
        // Get the XHR object that triggered the onload event
        let xhrTarget = e.target as XMLHttpRequest;

        // Variable to store the resulting JSON data
        let json:Object;

        // Attempt to read in the JSON. Display an error in the app description paragraph tag if there was a problem
        try {
            json = JSON.parse(xhrTarget.responseText);
        } catch {
            document.querySelector("#app-description").innerHTML = "An error occurred loading app set-up data.";
            return;
        }

        // Get all the keys from the JSON object
        const keys:string[] = Object.keys(json);

        // Assign each of the key values to the correct variable for the page
        title = json[keys[0]];
        audioFilePaths = json[keys[1]];
        trackNames = json[keys[2]];
        appDescription = json[keys[3]];

        // Set the title of the app
        document.querySelector("title").innerHTML = title;

        // Build the select element for songs
        for (let i:number = 0; i < audioFilePaths.length; i++) {
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
    xhr.onerror = (e:ProgressEvent<EventTarget>): void => {
        // Get the XHR object that triggered the onload event
        let xhrTarget = e.target as XMLHttpRequest;

        // Print that there was an error
        console.log(`In onerror - HTTP Status Code = ${xhrTarget.status}`);
    };

    // Open a connection to the JSON file and send the request
    xhr.open("GET", url);
    xhr.send();
}

// Sets up the audio visualizer
// Parameters: None
// Returns: Nothing
const init = (): void => {
    // Starts creation of the audio graph with defaultTrack as the source
    audio.setUpWebAudio(defaultTrack);
    console.log("init called");
    let canvasElement:HTMLCanvasElement = document.querySelector("canvas"); // hookup <canvas> element

    // Initialize the various UI elements of the audio visualizer
    setupUI(canvasElement);

    // Get the canvas ready for drawing
    canvas.setupCanvas(canvasElement, audio.analyserNode);

    // Gets the screen position of a click relative to the top-left corner of the canvas for exerting a shockwave on the central particles
    canvasElement.addEventListener("click", canvasClicked);

    // Get initial app data from av-data.json
    loadJson();

    // Create variables for all elements to get from the DOM
    let particleSysCB = document.querySelector("#particle-systems-cb") as HTMLInputElement;
    let particlesCB = document.querySelector("#particles-cb") as HTMLInputElement;
    let partyCB = document.querySelector("#party-cb") as HTMLInputElement;
    let embossCB = document.querySelector("#emboss-cb") as HTMLInputElement;
    let analyserDataTypeDropdown = document.querySelector("#analyser-data-type") as HTMLSelectElement;
    let emitterTypeDropdown = document.querySelector("#emitter-type") as HTMLSelectElement;
    let shockwaveTypeDropdown = document.querySelector("#shockwave-type") as HTMLSelectElement;

    // Set the checkboxes to be checked on load
    particleSysCB.checked = true;
    particlesCB.checked = true;
    partyCB.checked = false;
    embossCB.checked = false;

    // The default value of the analyser data type should be "frequency"
    analyserDataTypeDropdown.value = "frequency";

    // Set up the event handler for getting the current analyser data type to use for visualization
    analyserDataTypeDropdown.onchange = (): void => { canvas.getAnalyserDataType(analyserDataTypeDropdown.value) };

    // The default value of the emitter type should be "fountain"
    emitterTypeDropdown.value = "fountain";

    // Set up the event handler for getting the current emitter type to use for the central particle emitter
    emitterTypeDropdown.onchange = (): void => { canvas.getEmitterType(emitterTypeDropdown.value) };

    // The default value of the shockwave type should be "normal"
    shockwaveTypeDropdown.value = "normal";

    // Set up the event handler for getting the current shockwave type to use for the central particles
    shockwaveTypeDropdown.onchange = (): void => { canvas.getShockwaveType(shockwaveTypeDropdown.value) };

    // Call the loop function for a constant stream of audio data from the analyser node
    loop();
}

// Hooks up the various UI elements of the audio visualizer
// "canvasElement" parameter: A reference to the canvas containing the audio visualizer
// Returns: Nothing
const setupUI = (canvasElement:HTMLCanvasElement): void => {
    // A - hookup fullscreen button
    const fsButton = document.querySelector("#fs-button") as HTMLButtonElement;

    // add .onclick event to button
    fsButton.onclick = (e:MouseEvent): void => {
        console.log("goFullscreen() called");
        utils.goFullscreen(canvasElement);
    };

    // B - hookup play button
    const playButton = document.querySelector("#play-button") as HTMLButtonElement;

    // add .onclick event to button
    playButton.onclick = (e:MouseEvent): void => {
        console.log(`audioCtx.state before = ${audio.audioCtx.state}`);

        // check if context is in suspended state (autoplay policy)
        if (audio.audioCtx.state == "suspended") {
            audio.audioCtx.resume();
        }
        console.log(`audioCtx.state after = ${audio.audioCtx.state}`);

        // Toggle playing/pausing
        if (playButton.dataset.playing == "no") {
            // if track is currently paused, play it
            audio.playCurrentSound();
            playButton.dataset.playing = "yes"; // our CSS will set the text to "Pause"
        } else {
            // if track IS playing, pause it
            audio.pauseCurrentSound();
            playButton.dataset.playing = "no"; // our CSS will set the text to "Play"
        }
    };

    // C - hookup volume slider & label
    let volumeSlider = document.querySelector("#volume-slider") as HTMLInputElement;
    let volumeLabel = document.querySelector("#volume-label") as HTMLLabelElement;

    // add .oninput event to slider
    volumeSlider.oninput = (e:InputEvent): void => {
        // set the gain
        audio.setVolume(Number(volumeSlider.value));
        // update value of label to match value of slider
        let newValue:number = Math.round((Number(volumeSlider.value) / 2 * 100));
        volumeLabel.innerHTML = newValue.toString();
    };

    // set value of label to match initial value of slider
    volumeSlider.dispatchEvent(new Event("input"));

    // D - hookup gravity slider & label
    let gravitySlider = document.querySelector("#gravity-slider") as HTMLInputElement;
    let gravityLabel = document.querySelector("#gravity-label") as HTMLLabelElement;

    // Add .oninput event to slider
    gravitySlider.oninput = (e:InputEvent): void => {
        // Set the gravity value
        canvas.getGravityFromInput(Number(gravitySlider.value));
        // Update value of label to match value of slider
        gravityLabel.innerHTML = gravitySlider.value;
    };

    // Set value of label to match initial value of slider by firing an input event on start-up
    // First set the value to 1
    gravitySlider.value = "1";
    gravitySlider.dispatchEvent(new Event("input"));

    // E - hookup speed slider & label
    let speedSlider = document.querySelector("#speed-slider") as HTMLInputElement;
    let speedLabel = document.querySelector("#speed-label") as HTMLLabelElement;

    // Add .oninput event to slider
    speedSlider.oninput = (e:InputEvent): void => {
        // Set the speed modifier
        canvas.getSpeedModFromInput(Number(speedSlider.value));
        // Update value of label to match value of slider
        speedLabel.innerHTML = speedSlider.value;
    };

    // Set value of label to match initial value of slider by firing an input event on start-up
    // First set the value to 1
    speedSlider.value = "1";
    speedSlider.dispatchEvent(new Event("input"));

    // F - hookup treble slider & label
    let trebleSlider = document.querySelector("#treble-slider") as HTMLInputElement;
    let trebleLabel = document.querySelector("#treble-label") as HTMLLabelElement;

    // Add .oninput event to slider
    trebleSlider.oninput = (e:InputEvent): void => {
        // Set the treble boost amount
        audio.boostTreble(Number(trebleSlider.value));
        // Update value of label to match value of slider
        trebleLabel.innerHTML = trebleSlider.value;
    };

    // Set value of label to match initial value of slider by firing an input event on start-up
    // First set the value to 0
    trebleSlider.value = "0";
    trebleSlider.dispatchEvent(new Event("input"));

    // G - hookup bass slider & label
    let bassSlider = document.querySelector("#bass-slider") as HTMLInputElement;
    let bassLabel = document.querySelector("#bass-label") as HTMLLabelElement;

    // Add .oninput event to slider
    bassSlider.oninput = (e:InputEvent): void => {
        // Set the bass boost amount
        audio.boostBass(Number(bassSlider.value));
        // Update value of label to match value of slider
        bassLabel.innerHTML = bassSlider.value;
    };

    // Set value of label to match initial value of slider by firing an input event on start-up
    // First set the value to 0
    bassSlider.value = "0";
    bassSlider.dispatchEvent(new Event("input"));

    // H - hookup track <select>
    let trackSelect = document.querySelector("#track-select") as HTMLSelectElement;
    
    // add .onchange event to <select>
    trackSelect.onchange = e => {
        // Load next sound file
        audio.loadSoundFile(e.target.value);
        // pause the current track if it is playing
        if (playButton.dataset.playing == "yes") {
            playButton.dispatchEvent(new MouseEvent("click"));
        }
    };

    // I - hookup checkboxes
    document.querySelector("#particle-systems-cb").addEventListener("click", (e) => { appParams.showParticleSystems = e.target.checked; });
    document.querySelector("#particles-cb").addEventListener("click", (e) => { appParams.showParticles = e.target.checked; });
    document.querySelector("#party-cb").addEventListener("click", (e) => { appParams.partyMode = e.target.checked; });
    document.querySelector("#emboss-cb").addEventListener("click", (e) => { appParams.showEmboss = e.target.checked; });
} // end setupUI

// Displays data from the analyser node every frame
// Parameters: None
// Returns: Nothing
const loop = () => {
    // Start the animation loop with this function at 60 FPS
    setTimeout(loop, 1000 / 60);

    // Visualize the audio data!
    canvas.draw(appParams);
}

// Make the init function and AppParams interface public
export { init, AppParams };