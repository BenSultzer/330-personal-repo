// WILL DO ALL OF SECTION III AT END WHEN I'M DONE
// Import the function(s) from utils.js
import { getRandomWord } from "./utils.js";

const words1 = ["Acute", "Aft", "Anti-matter", "Bipolar", "Cargo", "Command", "Communication", "Computer", "Deuterium", "Dorsal", "Emergency", "Engineering", "Environmental", "Flight", "Fore", "Guidance", "Heat", "Impulse", "Increased", "Inertial", "Infinite", "Ionizing", "Isolinear", "Lateral", "Linear", "Matter", "Medical", "Navigational", "Optical", "Optimal", "Optional", "Personal", "Personnel", "Phased", "Reduced", "Science", "Ship's", "Shuttlecraft", "Structural", "Subspace", "Transporter", "Ventral"];

const words2 = ["Propulsion", "Dissipation", "Sensor", "Improbability", "Buffer", "Graviton", "Replicator", "Matter", "Anti-matter", "Organic", "Power", "Silicon", "Holographic", "Transient", "Integrity", "Plasma", "Fusion", "Control", "Access", "Auto", "Destruct", "Isolinear", "Transwarp", "Energy", "Medical", "Environmental", "Coil", "Impulse", "Warp", "Phaser", "Operating", "Photon", "Deflector", "Integrity", "Control", "Bridge", "Dampening", "Display", "Beam", "Quantum", "Baseline", "Input"];

const words3 = ["Chamber", "Interface", "Coil", "Polymer", "Biosphere", "Platform", "Thruster", "Deflector", "Replicator", "Tricorder", "Operation", "Array", "Matrix", "Grid", "Sensor", "Mode", "Panel", "Storage", "Conduit", "Pod", "Hatch", "Regulator", "Display", "Inverter", "Spectrum", "Generator", "Cloud", "Field", "Terminal", "Module", "Procedure", "System", "Diagnostic", "Device", "Beam", "Probe", "Bank", "Tie-In", "Facility", "Bay", "Indicator", "Cell"];

// Creates and displays the technobabble phrase
const generateTechnobabble = (num) => {
    // Create a variable to store the set of technobabble phrases
    let technobabbleSet = "";

    // Assemble the desired number of technobabble phrases, one on each line, according to the "num" parameter
    // CLEAR RESULTS TO ONE TB PHRASE WHEN GO BELOW 1408PX.
    for (let i = 0; i < num; i++) {
        technobabbleSet += `${getRandomWord(words1)} ${getRandomWord(words2)} ${getRandomWord(words3)}<br>`;
    }

    // Display the technobabble phrase on the page
    document.querySelector("#output").innerHTML = technobabbleSet;
}

// Gets the technobabble JSON data loaded from the XHR request and places it in the arrays for assembling the technobabble phrase(s). Also sets up the event listeners to generate technobabble when the buttons are pressed and generates/displays one technobabble phrase on start-up
const babbleLoaded = (e) => {
    // Log the current status to the console
    console.log(`In onload - HTTP Status Code = ${e.target.status}`);

    // Create a variable to store the raw JSON data
    let json;

    // Attempt to extract the data as a string from the JSON, logging an error to the technobabble output element if something fails
    try {
        json = JSON.parse(e.target.responseText);
    } catch {
        document.querySelector("#output").innerHTML = "BAD JSON!";
        return;
    }

    const keys = Object.keys(json);
    words1 = keys[0];
    words2 = keys[1];
    words3 = keys[2];
    let obj;
    for (let k of keys) {
        //console.log(json[k]);
        obj = json[k];
    }

    // Display the desired number of technobabble phrases when each button is clicked
    document.querySelector("#single-tb").addEventListener("click", () => { generateTechnobabble(1) });
    document.querySelector("#multi-tb").addEventListener("click", () => { generateTechnobabble(5) });

    // Display 1 technobabble phrase when the page first loads
    generateTechnobabble(1);
}

// Sends an XHR request to get the technobabble words from the babble-data.json file
const loadBabble = () => {
    const url = "data/babble-data.json";
    const xhr = new XMLHttpRequest();
    xhr.onload = (e) => { babbleLoaded(e) };
    xhr.onerror = e => console.log(`In onerror - HTTP Status Code = ${e.target.status}`);
    xhr.open("GET", url);
    xhr.send();
}

// Initiates technobabble data loading from JSON using XHR
const init = () => {
    // Load in the technobabble words
    loadBabble();
}

init();