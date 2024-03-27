// Overview: Homework 1
// Author: Ben Sultzer <bms3902@rit.edu>

// Import function(s) from utils.js
import { getRandomWord } from "./utils.js";

// The arrays to store the possible technobabble words
let words1;
let words2;
let words3;

// Store whether or not the 5 technobabble phrases button has been clicked
let fiveBabbleClicked = false;

// Creates and displays the technobabble phrase
// "num" parameter: How many technobabble phrases to generate
// Returns: Nothing
const generateTechnobabble = (num) => {
    // Create a variable to store the set of technobabble phrases
    let technobabbleSet = "";

    // If num is equal to five, indicate that the 5 technobabble phrases button has been clicked
    if (num == 5) {
        fiveBabbleClicked = true;
    }

    // Assemble the desired number of technobabble phrases, one on each line, according to the "num" parameter
    for (let i = 0; i < num; i++) {
        technobabbleSet += `${getRandomWord(words1)} ${getRandomWord(words2)} ${getRandomWord(words3)}<br>`;
    }

    // Display the technobabble phrase on the page
    document.querySelector("#output").innerHTML = technobabbleSet;
}

// Gets the technobabble JSON data loaded from the XHR request and places it in the arrays for assembling the technobabble phrase(s). Also sets up the event listeners to generate technobabble when the buttons are pressed and generates/displays one technobabble phrase on start up
// "e" parameter: The event object sent back by the XHR onload event handler
// Returns: Nothing
const babbleLoaded = (e) => {
    // Log the current status to the console
    console.log(`In onload - HTTP Status Code = ${e.target.status}`);

    // Create a variable to store the raw JSON data
    let json;

    // Attempt to extract the data as an object from the JSON file, logging an error to the technobabble output element if something fails
    try {
        json = JSON.parse(e.target.responseText);
    } catch {
        document.querySelector("#output").innerHTML = "BAD JSON!";
        return;
    }

    // Get the set of keys from the technobabble words JSON object
    const keys = Object.keys(json);

    // Use the keys to assign the proper words array from the JSON object to each local words array
    words1 = json[keys[0]];
    words2 = json[keys[1]];
    words3 = json[keys[2]];

    // Hook up the button event listeners - Display the desired number of technobabble phrases when each button is clicked
    document.querySelector("#single-tb").addEventListener("click", () => { generateTechnobabble(1) });
    document.querySelector("#multi-tb").addEventListener("click", () => { generateTechnobabble(5) });

    // Display 1 technobabble phrase when the page first loads
    generateTechnobabble(1);
}

// Sends an XHR request to get the technobabble words from the babble-data.json file
// Parameters: None
// Returns: Nothing
const loadBabble = () => {
    // Set the path to the desired JSON file
    const url = "data/babble-data.json";

    // Create the XHR object
    const xhr = new XMLHttpRequest();

    // Tell the XHR object how it should handle data loading
    xhr.onload = (e) => { babbleLoaded(e) };

    // Tell the XHR object what to do if a problem occurs
    xhr.onerror = e => console.log(`In onerror - HTTP Status Code = ${e.target.status}`);

    // Set up the data request
    xhr.open("GET", url);

    // Send the request
    xhr.send();
}

// Prevents any technobabble phrases from cluttering the screen and causing strange formatting issues when the window is resized
// Parameters: None
// Returns: Nothing
const fixTechnobabbleFormatting = () => {
    // If the window width is below 1408px and the 5 technobbabble phrases button was clicked, clear the technobabble output element to 1 technobabble phrase if the page is resized after clicking the button. Prevents undesirable formatting issues
    if (fiveBabbleClicked && (window.innerWidth < 1408)) {
        generateTechnobabble(1);

        // Formatting has been fixed. Indicate the 5 technobabble phrases button is no longer being treated as clicked
        fiveBabbleClicked = false;
    }
}

// Initiates technobabble data loading from JSON using XHR, and initializes how to handle incorrect technobabble formatting
// Parameters: None
// Returns: Nothing
const init = () => {
    // Load in the technobabble words
    loadBabble();

    // Hook up the technobabble formatting function to the event that indicates the window has been resized
    window.onresize = fixTechnobabbleFormatting;
}

// Begin the app!
init();