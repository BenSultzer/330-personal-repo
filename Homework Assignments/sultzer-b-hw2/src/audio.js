// Overview: Practice Exercise 07
// Author: Ben Sultzer <bms3902@rit.edu>

// 1 - our WebAudio context, **we will export and make this public at the bottom of the file**
let audioCtx;

// **These are "private" properties - these will NOT be visible outside of this module (i.e. file)**
// 2 - WebAudio nodes that are part of our WebAudio audio routing graph
let element, sourceNode, analyserNode, gainNode, trebleNode, bassNode;

// 3 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
    gain: .5,
    numSamples: 256
});

// 4 - create a new array of 8-bit integers (0-255)
// this is a typed array to hold the audio frequency data
let audioData = new Uint8Array(DEFAULTS.numSamples / 2);

// **Next are "public" methods - we are going to export all of these at the bottom of this file**
// Sets the sound file to be used
// "filePath" parameter: The file path to the desired sound file
// Returns: Nothing
const loadSoundFile = (filePath) => {
    element.src = filePath;
}

// Plays the currently set sound
// Parameters: None
// Returns: Nothing
const playCurrentSound = () => {
    element.play();
}

// Pauses the currently set sound
// Parameters: None
// Returns: Nothing
const pauseCurrentSound = () => {
    element.pause();
}

// Changes the volume of the currently set sound
// "value" parameter: The new volume
// Returns: Nothing
const setVolume = (value) => {
    value = Number(value); // make sure that it's a Number rather than a String
    gainNode.gain.value = value;
}

// Creates and returns a treble node
// "audioCtx" parameter: The audio context object to create the treble node
// Returns: The treble node
const makeTrebleNode = (audioCtx) => {
    // Creates a BiquadFilterNode
    let treble = audioCtx.createBiquadFilter();

    // Lets the audio system know this BiquadFilterNode is a treble node
    treble.type = "highshelf";

    // The treble node will look for frequency values greater than 1000 Hz
    treble.frequency.setValueAtTime(1000, audioCtx.currentTime);

    // Any frequencies within the given range will be boosted by the given amount (0 
    // as default becuase treble checkbox is off by default)
    treble.gain.setValueAtTime(0, audioCtx.currentTime);

    // Return the node
    return treble;
}

// Creates and returns a bass node
// "audioCtx" parameter: The audio context object to create the bass node
// Returns: The bass node
const makeBassNode = (audioCtx) => {
    // Creates a BiquadFilterNode
    let bass = audioCtx.createBiquadFilter();

    // Lets the audio system know this BiquadFilterNode is a treble node
    bass.type = "lowshelf";

    // The bass node will look for frequency values less than 1000 Hz
    bass.frequency.setValueAtTime(1000, audioCtx.currentTime);

    // Any frequencies within the given range will be boosted by the given amount (0 
    // as default becuase bass checkbox is off by default)
    bass.gain.setValueAtTime(0, audioCtx.currentTime);

    // Return the node
    return bass;
}

// Boosts the treble frequencies by the given amount
// "value" parameter: The amount of boost
// Returns: Nothing 
const boostTreble = (value) => {
    trebleNode.gain.setValueAtTime(value, audioCtx.currentTime);
}

// Boosts the bass frequencies by the given amount
// "value" parameter: The amount of boost
// Returns: Nothing 
const boostBass = (value) => {
    bassNode.gain.setValueAtTime(value, audioCtx.currentTime);
}

// Sets up the audio graph with the given audio file as the source
// "filePath" parameter: The file path to the audio file to use as the source
// Returns: Nothing
const setUpWebAudio = (filePath) => {
    // 1 - The || is because WebAudio has not been standardized across browsers yet
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();

    // 2 - this creates an <audio> element
    element = new Audio(); // document.querySelector("audio");

    // 3 - have it point at a sound file
    loadSoundFile(filePath);

    // 4 - create a source node that points at the <audio> element
    sourceNode = audioCtx.createMediaElementSource(element);

    // 5 - create an analyser node
    analyserNode = audioCtx.createAnalyser(); // note the UK spelling of "Analyser"

    /*
    // 6
    We will request DEFAULTS.numSamples number of samples or "bins" spaced equally 
    across the sound spectrum.
    
    If DEFAULTS.numSamples (fftSize) is 256, then the first bin is 0 Hz, the second is 172 Hz, 
    the third is 344Hz, and so on. Each bin contains a number between 0-255 representing 
    the amplitude of that frequency.
    */

    // fft stands for Fast Fourier Transform
    analyserNode.fftSize = DEFAULTS.numSamples;

    // 7 - create a gain (volume) node
    gainNode = audioCtx.createGain();
    gainNode.gain.value = DEFAULTS.gain;

    // 8 - Get the treble node
    trebleNode = makeTrebleNode(audioCtx);

    // 9 - Get the bass node
    bassNode = makeBassNode(audioCtx);

    // 10 - connect the nodes - we now have an audio graph
    sourceNode.connect(trebleNode);
    trebleNode.connect(bassNode);
    bassNode.connect(analyserNode);
    analyserNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);
}

// Make the web audio setup, playing/pausing sound, sound loading, effect toggling, and volume setting functions public, as well as the audio context and analyser node
export { audioCtx, setUpWebAudio, playCurrentSound, pauseCurrentSound, loadSoundFile, setVolume, boostTreble, boostBass, analyserNode };