"use strict";
const words1 = ["Acute", "Aft", "Anti-matter", "Bipolar", "Cargo", "Command", "Communication", "Computer", "Deuterium", "Dorsal", "Emergency", "Engineering", "Environmental", "Flight", "Fore", "Guidance", "Heat", "Impulse", "Increased", "Inertial", "Infinite", "Ionizing", "Isolinear", "Lateral", "Linear", "Matter", "Medical", "Navigational", "Optical", "Optimal", "Optional", "Personal", "Personnel", "Phased", "Reduced", "Science", "Ship's", "Shuttlecraft", "Structural", "Subspace", "Transporter", "Ventral"];

const words2 = ["Propulsion", "Dissipation", "Sensor", "Improbability", "Buffer", "Graviton", "Replicator", "Matter", "Anti-matter", "Organic", "Power", "Silicon", "Holographic", "Transient", "Integrity", "Plasma", "Fusion", "Control", "Access", "Auto", "Destruct", "Isolinear", "Transwarp", "Energy", "Medical", "Environmental", "Coil", "Impulse", "Warp", "Phaser", "Operating", "Photon", "Deflector", "Integrity", "Control", "Bridge", "Dampening", "Display", "Beam", "Quantum", "Baseline", "Input"];

const words3 = ["Chamber", "Interface", "Coil", "Polymer", "Biosphere", "Platform", "Thruster", "Deflector", "Replicator", "Tricorder", "Operation", "Array", "Matrix", "Grid", "Sensor", "Mode", "Panel", "Storage", "Conduit", "Pod", "Hatch", "Regulator", "Display", "Inverter", "Spectrum", "Generator", "Cloud", "Field", "Terminal", "Module", "Procedure", "System", "Diagnostic", "Device", "Beam", "Probe", "Bank", "Tie-In", "Facility", "Bay", "Indicator", "Cell"];

// Get a random word from the given words array
let getRandomWord = (wordsArray) => { return wordsArray[Math.floor(Math.random() * wordsArray.length)]; }

// Creates and displays the technobabble phrase
let generateTechnobabble = (num) => {
    // Create a variable to store the set of technobabble phrases
    let technobabblePhrase = "";
    
    // Assemble the desired number of technobablle phrases, one on each line, according to the "num" parameter
    for (let i = 0; i < num; i++) {
        technobabblePhrase += getRandomWord(words1) + " " + getRandomWord(words2) + " " + getRandomWord(words3) + "<br>";
    }

    // Display the technobabble phrase on the page
    document.querySelector("#output").innerHTML = technobabblePhrase;
}

// Sets up the technobabble generation to trigger when the buttons are clicked
let init = () => {
    // Display the desired number of technobabble phrases when each button is clicked
    document.querySelector("#single-tb").addEventListener("click", () => { generateTechnobabble(1) });
    document.querySelector("#multi-tb").addEventListener("click", () => { generateTechnobabble(5) });

    // Display 1 technobabble phrase when the page first loads
    generateTechnobabble(1);
}

// Set up technobabble generation
window.onload = init;