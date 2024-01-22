"use strict";
const words1 = ["Acute", "Aft", "Anti-matter", "Bipolar", "Cargo", "Command", "Communication", "Computer", "Deuterium", "Dorsal", "Emergency", "Engineering", "Environmental", "Flight", "Fore", "Guidance", "Heat", "Impulse", "Increased", "Inertial", "Infinite", "Ionizing", "Isolinear", "Lateral", "Linear", "Matter", "Medical", "Navigational", "Optical", "Optimal", "Optional", "Personal", "Personnel", "Phased", "Reduced", "Science", "Ship's", "Shuttlecraft", "Structural", "Subspace", "Transporter", "Ventral"];

const words2 = ["Propulsion", "Dissipation", "Sensor", "Improbability", "Buffer", "Graviton", "Replicator", "Matter", "Anti-matter", "Organic", "Power", "Silicon", "Holographic", "Transient", "Integrity", "Plasma", "Fusion", "Control", "Access", "Auto", "Destruct", "Isolinear", "Transwarp", "Energy", "Medical", "Environmental", "Coil", "Impulse", "Warp", "Phaser", "Operating", "Photon", "Deflector", "Integrity", "Control", "Bridge", "Dampening", "Display", "Beam", "Quantum", "Baseline", "Input"];

const words3 = ["Chamber", "Interface", "Coil", "Polymer", "Biosphere", "Platform", "Thruster", "Deflector", "Replicator", "Tricorder", "Operation", "Array", "Matrix", "Grid", "Sensor", "Mode", "Panel", "Storage", "Conduit", "Pod", "Hatch", "Regulator", "Display", "Inverter", "Spectrum", "Generator", "Cloud", "Field", "Terminal", "Module", "Procedure", "System", "Diagnostic", "Device", "Beam", "Probe", "Bank", "Tie-In", "Facility", "Bay", "Indicator", "Cell"];

// Get a random word from the given words array
let getRandomWord = (wordsArray) => { return wordsArray[Math.floor(Math.random() * wordsArray.length)]; }

// Creates and displays the technobabble phrase
let generateTechnobabble = () => {
    // Get a random word from each of the 3 arrays and concatenate the random words together
    let technobabblePhrase = getRandomWord(words1) + " " + getRandomWord(words2) + " " + getRandomWord(words3);

    // Display the technobabble phrase on the page
    document.querySelector("#output").innerHTML = technobabblePhrase;
}

// Sets up the technobabble generation to trigger when the "myButton" button is clicked
let init = () => {
    // Display the technobabble phrase with a button click
    document.querySelector("#myButton").addEventListener("click", generateTechnobabble);

    // Display a technobabble when the page first loads
    generateTechnobabble();
}

// Set up technobabble generation
window.onload = init;