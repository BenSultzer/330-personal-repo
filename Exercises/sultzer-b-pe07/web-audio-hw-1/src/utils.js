// Overview: Practice Exercise 07
// Author: Ben Sultzer <bms3902@rit.edu>

// Returns the given color values formatted as a CSS color
// "red" parameter: The R value
// "green" parameter: The G value
// "blue" parameter: The B value
// "alpha" parameter: The A value
// Returns: The CSS color string
const makeColor = (red, green, blue, alpha = 1) => {
    return `rgba(${red},${green},${blue},${alpha})`;
};

// Gets a random number between min and max
// "min" parameter: The lower bound
// "max" parameter: The upper bound
// Returns: The randomly generated number
const getRandom = (min, max) => {
    return Math.random() * (max - min) + min;
};

// Gets a random midrange color
// Parameters: None
// Returns: The randomly generated color
const getRandomColor = () => {
    const floor = 35; // so that colors are not too bright or too dark 
    const getByte = () => getRandom(floor, 255 - floor); // Generate the random color values
    return `rgba(${getByte()},${getByte()},${getByte()},1)`;
};

// Creates a color gradient with the given colors and pattern/layout
// "ctx" parameter: The 2D drawing context object
// "startX" parameter: The starting x-position of the gradient
// "startY" parameter: The starting y-position of the gradient
// "endX" parameter: The ending x-position of the gradient
// "endY" parameter: The ending y-position of the gradient
// "colorStops" parameter: The set of the colors to add to the gradient
// Returns: The resulting gradient
const getLinearGradient = (ctx, startX, startY, endX, endY, colorStops) => {
    // Create the linear gradient
    let lg = ctx.createLinearGradient(startX, startY, endX, endY);

    // Add the colors to the gradient
    for (let stop of colorStops) {
        lg.addColorStop(stop.percent, stop.color);
    }
    return lg;
};

// https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API
// Attempts to make the given element fullscreen
// "element" parameter: The element to make fullscreen
// Returns: Nothing
const goFullscreen = (element) => {
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

// Make the color formatting, random color, linear gradient creation, and fullscreen functions public
export { makeColor, getRandomColor, getLinearGradient, goFullscreen };