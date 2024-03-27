// Get a random word from the given words array
const getRandomWord = (wordsArray) => { return wordsArray[Math.floor(Math.random() * wordsArray.length)]; }

// Export the getRandomWord function
export { getRandomWord };