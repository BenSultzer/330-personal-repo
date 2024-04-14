// Overview: Homework 3
// Author: Ben Sultzer <bms3902@rit.edu>

// Get main.ts's init() function
import { init } from "./main";

// Starts up the app
// Parameters: None
// Returns: Nothing
const startUp = (): void => {
    console.log("startUp() called");
    // 1 - do preload here - load fonts, images, additional sounds, etc...

    // 2 - start up app
    init();
}

// Start up the app
startUp();