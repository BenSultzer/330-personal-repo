// Overview: Homework 3
// Author: Ben Sultzer <bms3902@rit.edu>

/*
    The purpose of this file is to take in the analyser node and a <canvas> element: 
      - the module will create a drawing context that points at the <canvas> 
      - it will store the reference to the analyser node
      - in draw(), it will loop through the data in the analyser node
      - and then draw something representative on the canvas
      - maybe a better name for this file/module would be *visualizer.js* ?
*/

// Get the AppParams interface from main.ts
import { AppParams } from "./main";

// Get the utilty functions
import * as utils from './utils.js';

// Import the ParticleSystem class
import { ParticleSystem } from "./classes/ParticleSystem";

// Import the Particle class
import { Particle } from "./classes/Particle";

// Variables for tracking delta time for the particle systems
let totalTime:number = 0;
let preTime:number = 0;
let deltaTime:number = 0;

// Variable to store the current value for gravity (-1 to start)
let currentGravity:number = -1;

// The emitter type for the central particle emitter (fountain to start)
let emitterType:string = "fountain";

// The shockwave type for the central particles (normal to start)
let shockwaveType:string = "normal";

// The modifier for central particle speed (1 to start, so no effect)
let speedModifier:number = 1;

// Track the lifetimes of the background particle systems
let backgroundPSLifeCounter:number = 0;

// Track the lifetimes of the central particles
let centralParticleLifeCounter:number = 0;

// The array of particle systems for the background
let particleSystemsBackground:ParticleSystem[];

// The array of particles that shoot from the center
let centralParticles:Particle[];

// Define variables for drawing the audio data to the canvas
let ctx:CanvasRenderingContext2D;
let canvasWidth:number;
let canvasHeight:number;
let analyserNode:AnalyserNode;
let audioData:Uint8Array;

// A variable to track what kind of analyser data to use for visualization
let analyserDataType:string = "frequency"; // Use frequency as a default

// Prepares the canvas for audio data
// "canvasElement" parameter: The canvas to draw to
// "analyserNodeRef" parameter: A reference to the analyser node
// Returns: Nothing
const setupCanvas = (canvasElement:HTMLCanvasElement, analyserNodeRef:AnalyserNode): void => {
    // create drawing context
    ctx = canvasElement.getContext("2d");
    canvasWidth = canvasElement.width;
    canvasHeight = canvasElement.height;
    // keep a reference to the analyser node
    analyserNode = analyserNodeRef;
    // this is the array where the analyser data will be stored
    audioData = new Uint8Array(analyserNode.fftSize / 2);
    // Create the array of background particle systems and initialize each element with a new particle system
    particleSystemsBackground = new Array(audioData.length);
    for (let i:number = 0; i < particleSystemsBackground.length; i++) {
        particleSystemsBackground[i] = new ParticleSystem(0, 0, 0, 0, "white");
    }
    // Create the array of central particles and initialize each element with a new particle
    centralParticles = new Array(audioData.length);
    for (let i:number = 0; i < centralParticles.length; i++) {
        centralParticles[i] = new Particle(canvasWidth / 2, canvasHeight / 2, 0, "white", 0, new Array(0, 0));
    }
}

// Gets the current speed modifier to be used on the central particles
// "value" parameter: The speed modifier
// Returns: Nothing
const getSpeedModFromInput = (value:number): void => {
    speedModifier = value;
}

// Gets the current shockwave type to be used on the central particles
// "type" parameter: The type of shockwave to use
// Returns: Nothing
const getShockwaveType = (type:string): void => {
    shockwaveType = type;
}

// Gets the current emitter type to be used when rendering the central particles
// "type" parameter: The type of emitter to use
// Returns: Nothing
const getEmitterType = (type:string): void => {
    emitterType = type;
}

// Gets the gravity from user input on the gravity slider
// "value" parameter: The new gravity
// Returns: Nothing
const getGravityFromInput = (value:number): void => {
    currentGravity = value;
}

// Whenever the currently selected analyser data type changes on the page (using the dropdown menu), capture the new data type
// "dataType" parameter: The new data type
// Returns: Nothing
const getAnalyserDataType = (dataType:string): void => {
    analyserDataType = dataType;
}

// Draws the audio data to the canvas
// "params" parameter: The set of app options
// Returns: Nothing
const draw = (params:AppParams) => {
    // Keep track of the total runtime of the app at 60 FPS, calculating delta time for the particle system
    preTime = totalTime;
    totalTime += 1 / 60;
    deltaTime = totalTime - preTime;

    // 1 - Populate the audioData array with data from the analyserNode that corresponds to the currently selected analyser data type
    if (analyserDataType == "frequency") { // Frequency data
        analyserNode.getByteFrequencyData(audioData);
    } else {
        analyserNode.getByteTimeDomainData(audioData); // Waveform data
    }

    // 2 - Draw background
    ctx.save();
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.restore();

    // Get the play button
    const playButton = document.querySelector("#play-button") as HTMLButtonElement;

    // 3 - Draw particle systems
    if (params.showParticleSystems) {
        let particleSystemSpacing:number = 4;
        let margin:number = 5;
        let screenWidthForParticleSystems:number = canvasWidth - (audioData.length * particleSystemSpacing) - margin * 2;
        let horizontalSpaceForParticleSystem:number = screenWidthForParticleSystems / audioData.length;
        let topSpacing:number = 100;

        ctx.save();
        // Loop through the data, creating particle systems for each entry
        for (let i:number = 0; i < audioData.length; i++) {
            // Create a particle system for the current piece of audio data if the lifetime is over for the previous particle system of that entry
            backgroundPSLifeCounter += 1 / 60; // Update the lifetime counter
            if (backgroundPSLifeCounter >= 1.3) {
                // Create a new particle system and reset the lifetime counter
                particleSystemsBackground[i] = new ParticleSystem(margin + i * (horizontalSpaceForParticleSystem + particleSystemSpacing), topSpacing + 256 - audioData[i], 5, ((256 - audioData[i]) + 20) / 10, "rgba(50, 50, 50, 0.75)");
                backgroundPSLifeCounter = 0;
            }
        }        

        // If the current song is playing, update and draw each particle system
        if (playButton.dataset.playing == "yes") {
            for (let i:number = 0; i < particleSystemsBackground.length; i++) {
                particleSystemsBackground[i].update(ctx, deltaTime);
            }
        }
        ctx.restore();
    }

    // 4 - Draw central particles
    if (params.showParticles) {
        ctx.save();
        for (let i:number = 0; i < audioData.length; i++) {
            // Create a particle for the current piece of audio data if the lifetime is over for the previous particle of that entry
            centralParticleLifeCounter += 1 / 60; // Update the lifetime counter
            if (centralParticleLifeCounter >= 3) {
                // Create a new particle and reset the lifetime counter
                // The direction the particle moves should be random if the emitter type is "fountain" and oscillate according to a sine wave if the type is "beam"
                let direction: number[];
                // Make the speed a little slower for the fountain
                let speed:number;
                if (emitterType == "fountain") {
                    direction = new Array(utils.getRandom(-1, 1), utils.getRandom(-1, 1));
                    speed = (100 + audioData[i]) * speedModifier; // Apply the speed modifier from input
                } else {
                    direction = new Array(Math.sin(totalTime * 3), -1); // For the beam, oscillate the direction between up and to the left and up and to the right
                    speed = (200 + audioData[i]) * speedModifier; // Apply the speed modifier from input
                }
                centralParticles[i] = new Particle(canvasWidth / 2, canvasHeight / 2, ((256 - audioData[i]) + 20) / 10, `rgba(${175 + audioData[i]}, 0, 0, 0.75)`, speed, direction);
                centralParticles[i].setGravity(currentGravity);  // Set the current gravity for the particle
                centralParticleLifeCounter = 0;
            }
        }

        // If the current song is playing, update and draw each particle
        if (playButton.dataset.playing == "yes") {
            for (let i:number = 0; i < centralParticles.length; i++) {
                centralParticles[i].setShockwaveType(shockwaveType);
                centralParticles[i].update(deltaTime);
                centralParticles[i].draw(ctx);
            }
        }
        ctx.restore();
    }

    // 5 - bitmap manipulation
    // TODO: right now. we are looping though every pixel of the canvas (320,000 of them!), 
    // regardless of whether or not we are applying a pixel effect
    // At some point, refactor this code so that we are looping though the image data only if
    // it is necessary

    // A) grab all of the pixels on the canvas and put them in the `data` array
    // `imageData.data` is a `Uint8ClampedArray()` typed array that has 1.28 million elements!
    // the variable `data` below is a reference to that array 
    let imageData:ImageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    let data:Uint8ClampedArray = imageData.data;
    let length:number = data.length;
    let width:number = imageData.width; // not using here
    // B) Iterate through each pixel, stepping 4 elements at a time (which is the RGBA for 1 pixel)
    for (let i:number = 0; i < length; i += 4) {
        // Enter party mode? (Based on Shift RGB bitmap effect)
        if (params.partyMode) {
            // Rapidly shift the RGB values up and down with a sine wave
            data[i] += 100 * Math.sin(totalTime * 10);
            data[i + 1] += 100 * Math.sin(totalTime);
            data[i + 2] += 100 * Math.sin(totalTime);
        }

        // If the current gravity is up, invert the colors
        if (currentGravity == -1) {
            let red:number = data[i];
            let green:number = data[i + 1];
            let blue:number = data[i + 2];
            data[i] = 255 - red;        // set red
            data[i + 1] = 255 - green;  // set green
            data[i + 2] = 255 - blue;   // set blue
        }
    } // end for

    // note we are stepping through *each* sub-pixel
    if (params.showEmboss) {
        for (let i:number = 0; i < length; i++) {
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
export { setupCanvas, draw, getAnalyserDataType, getGravityFromInput, getEmitterType, getShockwaveType, getSpeedModFromInput, centralParticles };