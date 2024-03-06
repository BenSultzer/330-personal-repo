// Author: Ben Sultzer <bms3902@rit.edu>
// Description: Class that represents a single particle in a particle system
class Particle {
    // Initializes the data necessary for a particle
    // "positionX" parameter: The x-coordinate of the particle system's origin
    // "positionY" parameter: The y-coordinate of the particle system's origin
    // "numParticles" parameter: The number of particles in this particle system
    // Returns: Nothing
    constructor(positionX, positionY, radius, color, speed, direction) {
        this.positionX = positionX;
        this.positionY = positionY;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.direction = new Array(direction[0], direction[1]);
        this.normalize(direction); // Make sure to normalize the direction immediately!
        this.acceleration = 1;
    }

    // Normalizes a vector
    // "direction" parameter: The direction to normalize
    // Returns: The normalized direction
    normalize(direction) {
        // Gets the magnitude of the direction
        let magnitude = Math.sqrt(Math.pow(direction[0], 2) + Math.pow(direction[1], 2));

        // Divides each component by the magnitude
        direction[0] /= magnitude;
        direction[1] /= magnitude;

        // Returns the result
        return direction;
    }

    
    exertShockwave(mouseX, mouseY) {

    }

    // Sets the value of gravity for this particle
    // "value": The new gravity value
    // Returns: Nothing
    setGravity(value) {
        this.acceleration = value;
    }

    // Updates the particle's position with its speed, direction, and acceleration
    // "deltaTime" parameter: The time that has passed since last frame
    // Returns: Nothing
    update(deltaTime) {
        // Update vertical direction with acceleration
        this.direction[1] += this.acceleration * deltaTime;

        // Update position with speed and direction
        this.positionX += this.direction[0] * this.speed * deltaTime;
        this.positionY += this.direction[1] * this.speed * deltaTime;
    }

    // Draws the particle to the canvas
    // "ctx" parameter: The 2D drawing context to use for drawing
    // Returns: Nothing
    draw(ctx) {
        // Draw a circle to represent the particle
        this.drawCircle(ctx, this.positionX, this.positionY, this.radius, this.color);
    }

    // Draws a circle with the specified position, radius, and color
    // "ctx" parameter: The 2D drawing context
    // "x" parameter: The x-position of the circle
    // "y" parameter: The y-position of the circle
    // "radius" parameter: The radius of the circle
    // "color" parameter: The color of the circle
    // Returns: Nothing
    drawCircle(ctx, x, y, radius, color) {
        // Save the previous drawing state so that this function is pure 
        ctx.save();

        // Set the various drawing state properties and draw the arc 
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();

        // Get the drawing state back to the previous one
        ctx.restore();
    }
}

// Export the Particle class
export { Particle };