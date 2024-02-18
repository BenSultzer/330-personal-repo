// Import the random color and random int util functions
import { getRandomColor, getRandomInt } from "./utils.js";

// Variable to store the "2D drawing context"
let ctx;

// Boolean to track if the screensaver is paused
let paused = false;

// Variable to store a reference to the canvas element
let canvas;

// Boolean to track whether or not rectangles should be drawn
let createRectangles;

// Boolean to track whether or not arcs should be drawn
let createArcs;

// Boolean to track whether or not lines should be drawn
let createLines;

// Draws a rectangle with the specified position, size, fill, stroke, and stroke width (line width)
const drawRectangle = (ctx, x, y, width, height, fillStyle = "black", lineWidth = 0, strokeStyle = "black") => {
    // Save the previous drawing state so that this function is pure
    ctx.save();

    // Set the various drawing state properties and draw the rectangle (fill and/or stroke)
    ctx.fillStyle = fillStyle;
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.fill();
    if (lineWidth > 0) {
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = strokeStyle;
        ctx.stroke();
    }
    ctx.closePath();

    // Get the drawing state back to the previous one
    ctx.restore();
}

// Gets a random color between red, gold, or blue to color the given shape and returns that color
const getRedGoldBlue = (shape) => {
    // Get a random color of red, gold, or blue to color the shape
    let colorInt = getRandomInt(1, 3);

    // Variable in which to store the color
    let color;

    // Rectangles
    if (shape == "rect") {
        if (colorInt == 1) {
            color = "rgba(175, 0, 0, 0.2)";
        } else if (colorInt == 2) {
            color = "rgba(175, 150, 0, 0.2)";
        } else {
            color = "rgba(0, 0, 175, 0.2)";
        }
        // Lines
    } else if (shape == "line") {
        if (colorInt == 1) {
            color = "rgba(150, 0, 0, 0.2)";
        } else if (colorInt == 2) {
            color = "rgba(150, 125, 0, 0.2)";
        } else {
            color = "rgba(0, 0, 100, 0.2)";
        }
        // Circles
    } else {
        if (colorInt == 1) {
            color = "rgba(150, 0, 0, 0.2)";
        } else if (colorInt == 2) {
            color = "rgba(150, 125, 0, 0.2)";
        } else {
            color = "rgba(0, 0, 100, 0.2)";
        }
    }

    return color;
}

// Draws a randomly-sized, colored, and positioned rectangle
const drawRandomRect = (ctx) => {
    drawRectangle(ctx, getRandomInt(0, 640), getRandomInt(0, 480), getRandomInt(10, 90), getRandomInt(10, 90), getRedGoldBlue("rect"));
}

// Draws a line with the specified start position, end position, stroke, and stroke width (line width)
const drawLine = (ctx, x1, x2, y1, y2, lineWidth = 1, strokeStyle = "black") => {
    // Save the previous drawing state so that this function is pure
    ctx.save();

    // Set the various drawing state properties and draw the line
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();

    // Get the drawing state back to the previous one
    ctx.restore();
}

// Draws a randomly-positioned and sized horizontal or vertical line across the canvas
const drawRandomLine = (ctx) => {
    // Determine whether to draw a horizontal or vertical line (0 = horizontal, 1 = vertical)
    let lineType = getRandomInt(0, 1);

    // Draw a horizontal line
    if (lineType == 0) {
        // Get a random value along the y-axis
        let y = getRandomInt(0, 480);
        drawLine(ctx, 0, 640, y, y, getRandomInt(12, 24), getRedGoldBlue("line"));
        // Draw a vertical line
    } else {
        // Get a random value along the x-axis
        let x = getRandomInt(0, 640);
        drawLine(ctx, x, x, 0, 480, getRandomInt(12, 24), getRedGoldBlue("line"));
    }
}

// Draws an arc with the specified position, radius, fill, stroke, stroke width (line width), start angle, and end angle
const drawArc = (ctx, x, y, radius, fillStyle = "black", lineWidth = 0, strokeStyle = "black", startAngle = 0, endAngle = Math.PI * 2) => {
    // Save the previous drawing state so that this function is pure
    ctx.save();

    // Set the various drawing state properties and draw the arc (fill and/or stroke)
    ctx.fillStyle = fillStyle;
    ctx.beginPath();
    ctx.arc(x, y, radius, startAngle, endAngle);
    ctx.fill();
    if (lineWidth > 0) {
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = strokeStyle;
        ctx.stroke();
    }
    ctx.closePath();

    // Get the drawing state back to the previous one
    ctx.restore();
}

// Draws a randomly-sized, colored, and positioned arc
const drawRandomArc = (ctx) => {
    drawArc(ctx, getRandomInt(0, 640), getRandomInt(0, 480), getRandomInt(10, 50), getRedGoldBlue("arc"), 0, getRedGoldBlue("arc"), 0, Math.PI * 2);
}

// Update function for constantly drawing to the screen
const update = () => {
    // If the pause button has been pressed, return from update so the sreensaver isn't changed
    if (paused) {
        return;
    }

    // Hook up the update function to the canvas's "ticker"
    requestAnimationFrame(update);

    // Draw a random instance of the three different shapes in the canvas (following the Boolean value for each)
    if (createRectangles) {
        drawRandomRect(ctx);
    }
    if (createArcs) {
        drawRandomArc(ctx);
    }
    if (createLines) {
        drawRandomLine(ctx);
    }
}

// Clear the screen to white with a screen-sized white rectangle
const clearScreen = () => {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 640, 480);
}

// Function for detecting where the canvas was clicked, generating randomly-positioned, colored, and sized circles around that position
const canvasClicked = (e) => {
    // Gets information about the clicked area to convert into canvas space
    let rect = e.target.getBoundingClientRect();

    // Calculates where the canvas was clicked relative to its own top-left corner
    let mouseX = e.clientX - rect.x;
    let mouseY = e.clientY - rect.y;
    console.log(mouseX, mouseY);

    // Generates ten random circles around the calculated position
    for (let i = 0; i < 10; i++) {
        let x = getRandomInt(-100, 100) + mouseX;
        let y = getRandomInt(-100, 100) + mouseY;
        let radius = getRandomInt(20, 50);

        // Draws the next circle
        drawArc(ctx, x, y, radius, getRedGoldBlue("arc"));
    }
}

// Function for making sure each UI element's event handler is hooked up properly
const setupUI = () => {
    // Stop the calls to update() when the "Pause" button is pressed to pause the screensaver
    document.querySelector("#btn-pause").addEventListener("click", () => { paused = true; });

    // Resume the calls to update() when the "Play" button is pressed to start the screensaver again
    document.querySelector("#btn-play").addEventListener("click", () => {
        // If the game is already unpaused, don't continue to initiate the animation again as if it is continuously being unpaused (prevents stacking calls to requestAnimationFrame() for update())
        if (paused) {
            paused = false;
            update();
        }
    });

    // Gets the screen position relative to the top-left corner of the canvas for the spraypaint feature
    canvas.addEventListener("click", canvasClicked);

    // Updates the state of the "Draw Rectangles" checkbox when it is clicked
    document.querySelector("#cb-rectangles").addEventListener("click", (e) => { createRectangles = e.target.checked; });

    // Updates the state of the "Draw Arcs" checkbox when it is clicked
    document.querySelector("#cb-arcs").addEventListener("click", (e) => { createArcs = e.target.checked; });

    // Updates the state of the "Draw Lines" checkbox when it is clicked
    document.querySelector("#cb-lines").addEventListener("click", (e) => { createLines = e.target.checked; });

    // Hook up the event to clear the screen when the "Clear Screen" button is clicked
    document.querySelector("#btn-clear").addEventListener("click", clearScreen);
}

// Initializes the various program features
const init = () => {
    console.log("page loaded!");
    // #2 Now that the page has loaded, start drawing!

    // A - `canvas` variable points at <canvas> tag
    canvas = document.querySelector("canvas");

    // B - the `ctx` variable points at a "2D drawing context"
    ctx = canvas.getContext("2d");

    // Connect UI elements to their respective event handlers
    setupUI();

    // Call the screensaver function
    update();

    // Initialize the Boolean, for drawing each type of shape, to the current value of the respective "Draw" checkbox so the state presists across page reloads
    createRectangles = document.querySelector("#cb-rectangles").checked;
    createArcs = document.querySelector("#cb-arcs").checked;
    createLines = document.querySelector("#cb-lines").checked;
}

// Start the program when the window loads
init();