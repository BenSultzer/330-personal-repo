// Gets a random RGBA color
const getRandomColor = () => {
    // Gets a color that ranges from slight strength to full strength (min value of 55 for red, green, and blue)
    const getByte = () => {
        return 55 + Math.round(Math.random() * 150);
    }

    // Returns color in CSS "rgba()" format
    return `rgba(${getByte()}, ${getByte()}, ${getByte()}, .8)`;
}

// Gets a random value between min and max inclusive
const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Make getRandomColor() and getRandomInt() public
export { getRandomColor, getRandomInt };