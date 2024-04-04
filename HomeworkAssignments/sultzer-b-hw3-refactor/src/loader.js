// Overview: Homework 2
// Author: Ben Sultzer <bms3902@rit.edu>

// Get main.js's init() function
import * as main from "./main.js";

// Starts up the app
// Parameters: None
// Returns: Nothing
const startUp = () => {
    console.log("startUp() called");
    // 1 - do preload here - load fonts, images, additional sounds, etc...

    // 2 - start up app
    main.init();
}

// Start up the app
startUp();