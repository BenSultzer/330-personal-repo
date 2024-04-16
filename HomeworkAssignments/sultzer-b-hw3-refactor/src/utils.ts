// Overview: Homework 3
// Author: Ben Sultzer <bms3902@rit.edu>

// Returns the given color values formatted as a CSS color
// "red" parameter: The R value
// "green" parameter: The G value
// "blue" parameter: The B value
// "alpha" parameter: The A value
// Returns: The CSS color string
const makeColor = (red:number, green:number, blue:number, alpha:number = 1): string => {
    return `rgba(${red},${green},${blue},${alpha})`;
};

// Gets a random number between min and max
// "min" parameter: The lower bound
// "max" parameter: The upper bound
// Returns: The randomly generated number
const getRandom = (min:number, max:number): number => {
    return Math.random() * (max - min) + min;
};

// Gets a random midrange color
// Parameters: None
// Returns: The randomly generated color
const getRandomColor = (): string => {
    const floor:number = 35; // so that colors are not too bright or too dark 
    const getByte = (): number => getRandom(floor, 255 - floor); // Generate the random color values
    return `rgba(${getByte()},${getByte()},${getByte()},1)`;
};

// https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API
// Attempts to make the given element fullscreen
// "element" parameter: The element to make fullscreen
// Returns: Nothing
const goFullscreen = (element:any): void => {
    // Tests for the various possible contexts for going fullscreen, allowing the element to go fullscreen if the current context can handle it
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullscreen) {
        element.mozRequestFullscreen();
    } else if (element.mozRequestFullScreen) { // camel-cased 'S' was changed to 's' in spec
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    }
    // .. and do nothing if the method is not supported
};

// Make the color formatting, random color and number, and fullscreen functions public
export { makeColor, getRandom, getRandomColor, goFullscreen };