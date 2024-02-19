// Gets a random value between min and max inclusive
const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Make getRandomInt() public
export { getRandomInt };