// Overview: Practice Exercise 07
// Author: Ben Sultzer <bms3902@rit.edu>

/*
    The purpose of this file is to take in the analyser node and a <canvas> element: 
      - the module will create a drawing context that points at the <canvas> 
      - it will store the reference to the analyser node
      - in draw(), it will loop through the data in the analyser node
      - and then draw something representative on the canvas
      - maybe a better name for this file/module would be *visualizer.js* ?
*/

// Get the utilty functions
import * as utils from './utils.js';

// Import the ParticleSystem class
import { ParticleSystem } from "./classes/ParticleSystem.js";

// Variables for tracking delta time for the particle systems
let totalTime = 0;
let preTime = 0;
let deltaTime = 0;

// Track time intervals of one second
let secondCounter = 0;

// The array of particle systems
let particleSystems;

// Define variables for drawing the audio data to the canvas
let ctx, canvasWidth, canvasHeight, gradient, analyserNode, audioData;

// A variable to track what kind of analyser data to use for visualization
let analyserDataType = "frequency"; // Use frequency as a default

// Prepares the canvas for audio data
// "canvasElement" parameter: The canvas to draw to
// "analyserNodeRef" parameter: A reference to the analyser node
// Returns: Nothing
function setupCanvas(canvasElement, analyserNodeRef) {
    // create drawing context
    ctx = canvasElement.getContext("2d");
    canvasWidth = canvasElement.width;
    canvasHeight = canvasElement.height;
    // create a gradient that runs top to bottom
    gradient = utils.getLinearGradient(ctx, 0, 0, 0, canvasHeight, [{ percent: 0, color: "rgb(255, 255, 255)" }, { percent: .25, color: "rgb(204, 204, 204)" }, { percent: .5, color: "rgb(153, 153, 153)" }, { percent: .75, color: "rgb(102, 102, 102)" }, { percent: 1, color: "rgb(51, 51, 51)" }]);
    // keep a reference to the analyser node
    analyserNode = analyserNodeRef;
    // this is the array where the analyser data will be stored
    audioData = new Uint8Array(analyserNode.fftSize / 2);
    particleSystems = new Array(audioData.length);
    for (let i = 0; i < particleSystems.length; i++) {
        particleSystems[i] = new ParticleSystem(utils.getRandom(0, canvasWidth), 0, 50, 3, "red");
    }
}

// Whenever the currently selected analyser data type changes on the page (using the dropdown menu), capture the new data type
// "dataType" parameter: The new data type
// Returns: Nothing
const getAnalyserDataType = (dataType) => {
    analyserDataType = dataType;
}

// Draws the audio data to the canvas
// "params" parameter: The set of app options
// Returns: Nothing
function draw(params = {}) {
    // Keep track of the total runtime of the app at 60 FPS, calculating delta time for the particle system
    preTime = totalTime;
    totalTime += 1 / 60;
    deltaTime = totalTime - preTime;

    // 1 - populate the audioData array with data from the analyserNode that corresponds to the currently selected analyser data type
    if (analyserDataType == "frequency") { // Frequency data
        analyserNode.getByteFrequencyData(audioData);
    } else {
        analyserNode.getByteTimeDomainData(audioData); // Waveform data
    }

    // 2 - draw background
    ctx.save();
    ctx.fillStyle = "black";
    ctx.globalAlpha = 0.1;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.restore();

    // 3 - draw gradient
    if (params.showGradient) {
        ctx.save();
        ctx.fillStyle = gradient;
        ctx.globalAlpha = 0.3;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.restore();
    }

    // 4 - draw bars
    if (params.showBars) {
        let barSpacing = 4;
        let margin = 5;
        let screenWidthForBars = canvasWidth - (audioData.length * barSpacing) - margin * 2;
        let barWidth = screenWidthForBars / audioData.length;
        let barHeight = 200;
        let topSpacing = 100;

        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.50)';
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.50)';
        // loop through the data and draw!
        for (let i = 0; i < audioData.length; i++) {
            // Create a particle system for the current piece of audio data if the current particle system's life time is over
            secondCounter += 1 / 60;
            if (secondCounter >= 1.3) {
                particleSystems[i] = new ParticleSystem(margin + i * (barWidth + barSpacing), topSpacing + 256 - audioData[i], 5, ((256 - audioData[i]) + 20) / 10, "rgba(255 - audioData[i], 0.0, 0.0, 0.5)");
                secondCounter = 0;
            }
            //ctx.fillRect(margin + i * (barWidth + barSpacing), topSpacing + 256 - audioData[i], barWidth, barHeight);
            //ctx.strokeRect(margin + i * (barWidth + barSpacing), topSpacing + 256 - audioData[i], barWidth, barHeight);
        }
        if (document.querySelector("#play-button").dataset.playing == "yes") {
            for (let i = 0; i < particleSystems.length; i++) {
                particleSystems[i].update(ctx, deltaTime);
            }
        }
        ctx.restore();
    }

    // 5 - draw circles
    if (params.showCircles) {
        let maxRadius = canvasHeight / 4;
        ctx.save();
        ctx.globalAlpha = 0.5;
        for (let i = 0; i < audioData.length; i++) {
            // red-ish circles
            let percent = audioData[i] / 255;

            let circleRadius = percent * maxRadius;
            ctx.beginPath();
            ctx.fillStyle = utils.makeColor(255, 111, 111, 0.34 - percent / 3.0);
            ctx.arc(canvasWidth / 2, canvasHeight / 2, circleRadius, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();

            // blue-ish circles, bigger, more transparent
            ctx.beginPath();
            ctx.fillStyle = utils.makeColor(0, 0, 255, 0.10 - percent / 10.0);
            ctx.arc(canvasWidth / 2, canvasHeight / 2, circleRadius * 1.5, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();

            // yellow-ish circles, smaller
            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = utils.makeColor(200, 200, 0, 0.50 - percent / 5.0);
            ctx.arc(canvasWidth / 2, canvasHeight / 2, circleRadius * 0.50, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();
            ctx.restore();
        }
        ctx.restore();
    }

    // 6 - bitmap manipulation
    // TODO: right now. we are looping though every pixel of the canvas (320,000 of them!), 
    // regardless of whether or not we are applying a pixel effect
    // At some point, refactor this code so that we are looping though the image data only if
    // it is necessary

    // A) grab all of the pixels on the canvas and put them in the `data` array
    // `imageData.data` is a `Uint8ClampedArray()` typed array that has 1.28 million elements!
    // the variable `data` below is a reference to that array 
    let imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    let data = imageData.data;
    let length = data.length;
    let width = imageData.width; // not using here
    // B) Iterate through each pixel, stepping 4 elements at a time (which is the RGBA for 1 pixel)
    for (let i = 0; i < length; i += 4) {
        // C) randomly change every 20th pixel to red
        if (params.showNoise && Math.random() < 0.05) {
            // data[i] is the red channel
            // data[i+1] is the green channel
            // data[i+2] is the blue channel
            // data[i+3] is the alpha channel
            data[i] = data[i + 1] = data[i + 2] = 0; // zero out the red and green and blue channels
            data[i] = 10; // Grey noise
        } // end if

        // invert?
        if (params.showInvert) {
            let red = data[i], green = data[i + 1], blue = data[i + 2];
            data[i] = 255 - red;        // set red
            data[i + 1] = 255 - green;  // set green
            data[i + 2] = 255 - blue;   // set blue
            // data[i + 3] is the alpha, but we're leaving that alone
        }
    } // end for

    // note we are stepping through *each* sub-pixel
    if (params.showEmboss) {
        for (let i = 0; i < length; i++) {
            if (i % 4 == 3) {
                continue; // skip alpha channel
            }
            data[i] = 127 + 2 * data[i] - data[i + 4] - data[i + width * 4];
        }
    }

    // D) copy data back to canvas
    ctx.putImageData(imageData, 0, 0);
} // end draw()

// make the functions for getting the canvas ready, drawing, and saving the current audio data type to use for drawing public
export { setupCanvas, draw, getAnalyserDataType };