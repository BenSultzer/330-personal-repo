// Overview: Homework 3
// Author: Ben Sultzer <bms3902@rit.edu>

// 1 - our WebAudio context, **we will export and make this public at the bottom of the file**
let audioCtx:AudioContext;

// **These are "private" properties - these will NOT be visible outside of this module (i.e. file)**
// 2 - WebAudio nodes that are part of our WebAudio audio routing graph
let element:HTMLAudioElement;
let sourceNode:MediaElementAudioSourceNode;
let analyserNode:AnalyserNode;
let gainNode:GainNode;
let trebleNode:BiquadFilterNode;
let bassNode:BiquadFilterNode;

// 3 - Use an enum to represent default values for the amount of gain and audio samples to take
enum DEFAULTS {
    gain = .5,
    numSamples = 256
}

// **Next are "public" methods - we are going to export all of these at the bottom of this file**
// Sets the sound file to be used
// "filePath" parameter: The file path to the desired sound file
// Returns: Nothing
const loadSoundFile = (filePath:string): void => {
    element.src = filePath;
}

// Plays the currently set sound
// Parameters: None
// Returns: Nothing
const playCurrentSound = (): void => {
    element.play();
}

// Pauses the currently set sound
// Parameters: None
// Returns: Nothing
const pauseCurrentSound = (): void => {
    element.pause();
}

// Changes the volume of the currently set sound
// "value" parameter: The new volume
// Returns: Nothing
const setVolume = (value:number): void => {
    gainNode.gain.value = value;
}

// Creates and returns a treble node
// "audioCtx" parameter: The audio context object to create the treble node
// Returns: The treble node
const makeTrebleNode = (audioCtx:AudioContext): BiquadFilterNode => {
    // Creates a BiquadFilterNode
    let treble:BiquadFilterNode = audioCtx.createBiquadFilter();

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
const makeBassNode = (audioCtx:AudioContext): BiquadFilterNode => {
    // Creates a BiquadFilterNode
    let bass:BiquadFilterNode = audioCtx.createBiquadFilter();

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
const boostTreble = (value:number): void => {
    trebleNode.gain.setValueAtTime(value, audioCtx.currentTime);
}

// Boosts the bass frequencies by the given amount
// "value" parameter: The amount of boost
// Returns: Nothing 
const boostBass = (value:number): void => {
    bassNode.gain.setValueAtTime(value, audioCtx.currentTime);
}

// Sets up the audio graph with the given audio file as the source
// "filePath" parameter: The file path to the audio file to use as the source
// Returns: Nothing
const setUpWebAudio = (filePath:string): void => {
    // 1 - The || is because WebAudio has not been standardized across browsers yet
    const AudioContext = window.AudioContext;
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