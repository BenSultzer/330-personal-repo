// Overview: Extra Credit - "Phyllo-classy"
// Author: Ben Sultzer <bms3902@rit.edu>

// Import the PhylloFlower class
import { PhylloFlower } from "./PhylloFlower.js";

// The canvas size and canvas 2D drawing context variable
const canvasWidth = 640, canvasHeight = 480;
let ctx;

// Create an array of PhylloFlower objects
let sprites = [];

// The FPS of the app
let fps = 60;

// Tracks the total running time of the app
let totalTime = 0;

// Stores the currently selected trig function
let trigFunction;

// Clears the screen and restarts the "flower"
// Parameters: None
// Returns: Nothing
const restart = () => {
    // Clear the screen to black
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Reset each "flower's" circle element generations to the first generation
    for (let i = 0; i < 2; i++) {
        sprites[i].n = 0;
    }

    // Start the timer over for the total runtime of the app
    totalTime = 0;
}

// Whenever the value of the trig function dropdown menu changes, store the new value to use as the "flower" circle element radius calculation algorithm
// Parameters: None
// Returns: Nothing
const getTrigFunction = () => {
    trigFunction = document.querySelector("#radius-algorithm").value;
}

// Set up the Algorithmic Botany app
// Parameters: None
// Returns: Nothing
function init() {
    // Set up the canvas for drawing
    ctx = canvas.getContext("2d");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Create the two PhylloFlower objects
    sprites.push(new PhylloFlower(200, 200, 137.5, 4));
    sprites.push(new PhylloFlower(450, 200, 137.1, 3));

    // Make sure the 2D drawing context object was created successfully
    if (ctx == null) {
        // Indicate there was a problem
        console.log("There was a problem getting the 2D drawing context!");
        return 0;
    } else {
        // Set the initial background (a black rectangle since no color has been set)
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // Hook up the restart button
        document.querySelector("#restart").addEventListener("click", restart);

        // Hook up the trig dropdown menu's onchange event (gets the new trig function for drawing the "flower" circle element radii every time the 
        // dropdown menu's currently selected option changes)
        document.querySelector("#radius-algorithm").onchange = getTrigFunction;

        // Get an initial algorithm for the "flower" circle element radii
        trigFunction = document.querySelector("#radius-algorithm").value;

        // Begin the drawing loop
        loop();
    }
}

// Looping function for drawing the "flower"
// Parameters: None
// Returns: Nothing
function loop() {
    // Set the delay between calls to loop() (set the FPS)
    setTimeout(loop, 1000 / fps);

    // Update total time
    totalTime += 1 / fps;

    // Draw each of the "flowers"
    for (let i = 0; i < 2; i++) {
        sprites[i].draw(ctx, trigFunction, totalTime);
    }
}

// Call init when the page loads
init();