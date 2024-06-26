// Overview: Homework 3
// Author: Ben Sultzer <bms3902@rit.edu>
// Description: Class that represents a single particle in a particle system
class Particle {
    positionX:number;
    positionY:number;
    radius:number;
    color:string;
    speed:number;
    direction:number[];
    acceleration:number;
    shockwaveType:string;

    // Initializes the data necessary for a particle
    // "positionX" parameter: The x-coordinate of the particle system's origin
    // "positionY" parameter: The y-coordinate of the particle system's origin
    // "numParticles" parameter: The number of particles in this particle system
    // Returns: Nothing
    constructor(positionX:number, positionY:number, radius:number, color:string, speed:number, direction:number[]) {
        this.positionX = positionX;
        this.positionY = positionY;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.direction = direction;
        this.normalize(direction); // Make sure to normalize the direction immediately!
        this.acceleration = 1;
        this.shockwaveType = "normal";
    }

    // Normalizes a vector
    // "direction" parameter: The direction to normalize
    // Returns: The normalized direction
    normalize(direction:number[]): number[] {
        // Gets the magnitude of the direction
        let magnitude:number = Math.sqrt(Math.pow(direction[0], 2) + Math.pow(direction[1], 2));

        // Divides each component by the magnitude
        direction[0] /= magnitude;
        direction[1] /= magnitude;

        // Returns the result
        return direction;
    }

    // Exerts a shockwave force on this particle that originates from the mouse click position
    // "mouseX" parameter: The x-position of the mouse when the user clicks
    // "mouseY" parameter: The y-position of the mouse when the user clicks
    // Returns: Nothing
    exertShockwave(mouseX:number, mouseY:number): void {
        // A set amount of force for the shockwave
        let force:number = 1.5;

        // Get the distance from the mouse click to the particle
        let distance:number = Math.sqrt(Math.pow(this.positionX - mouseX, 2) + Math.pow(this.positionY - mouseY, 2));

        // Get the direction from the mouse click to the particle
        let shockwaveDirection:number[] = new Array(2);
        shockwaveDirection[0] = this.positionX - mouseX;
        shockwaveDirection[1] = this.positionY - mouseY;

        // Normalize the shockwave direction
        let shockwaveDirectionNormalized:number[] = this.normalize(shockwaveDirection);

        // Change the particle's direction by the shockwave's direction and scale it's speed by the force of the shockwave
        this.direction[0] += shockwaveDirectionNormalized[0];
        this.direction[1] += shockwaveDirectionNormalized[1];

        // If the shockwave type is "freeze", scale the force by the distance from the mouse position
        if (this.shockwaveType == "freeze") {
            this.speed *= (force * 10) / distance;
        } else {
            this.speed *= force;
        }
    }

    // Sets the type of shockwave for this particle
    // "value": The new shockwave type
    // Returns: Nothing
    setShockwaveType(value:string): void {
        this.shockwaveType = value;
    }

    // Sets the value of gravity for this particle
    // "value": The new gravity value
    // Returns: Nothing
    setGravity(value:number): void {
        this.acceleration = value;
    }

    // Updates the particle's position with its speed, direction, and acceleration
    // "deltaTime" parameter: The time that has passed since last frame
    // Returns: Nothing
    update(deltaTime:number): void {
        // Update vertical direction with acceleration
        this.direction[1] += this.acceleration * deltaTime;

        // Update position with speed and direction
        this.positionX += this.direction[0] * this.speed * deltaTime;
        this.positionY += this.direction[1] * this.speed * deltaTime;
    }

    // Draws the particle to the canvas
    // "ctx" parameter: The 2D drawing context to use for drawing
    // Returns: Nothing
    draw(ctx:CanvasRenderingContext2D): void {
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
    drawCircle(ctx:CanvasRenderingContext2D, x:number, y:number, radius:number, color:string): void {
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