// Author: Ben Sultzer <bms3902@rit.edu>
// Description: Class that creates and draws algorithmic botany "flowers"
class PhylloFlower {
    // Initializes the data necessary for a "flower"
    // "centerX" parameter: The x-coordinate of the center of the "flower"
    // "centerY" parameter: The y-coordinate of the center of the "flower"
    // "divergence" parameter: The angle difference between the position vectors of two successive circle elements
    // "c" parameter: The padding between each circle element
    // Returns: Nothing
    constructor(centerX, centerY, divergence, c) {
        this.radius = 1;    // Give a default circle element radius of 1
        this.n = 0;         // Starts with the first circle element generation
        this.centerX = centerX;
        this.centerY = centerY;
        this.divergence = divergence;
        this.c = c;
    }

    // Draws the current "flower" to the canvas
    // "ctx" parameter: The 2D drawing context to use for drawing
    // "trigFunc" parameter: The trig function to use for circle element radii variance
    // "totalTime" parameter: The total running time of the app for use in getting trig values for the radii
    // Returns: Nothing
    draw(ctx, trigFunc, totalTime) {
        // Each frame draw a new dot
        // `a` is the angle
        // `r` is the radius from the center (e.g. "Pole") of the "flower"
        // `c` is the "padding/spacing" between the dots
        let a = this.n * this.dtr(this.divergence);
        let r = this.c * Math.sqrt(this.n);

        // Now calculate the `x` and `y`
        let x = r * Math.cos(a) + this.centerX;
        let y = r * Math.sin(a) + this.centerY;
        //console.log(x, y);

        // Shades of purple
        //let color = `rgb(${n % 256},0,255)`;

        // Spiraled shades of purple
        //let aDegrees = (this.n * this.divergence) % 256;
        //let color = `rgb(${aDegrees},0,255)`;

        // Mac spinning wheel of death!
        let aDegrees = (this.n * this.divergence) % 361;
        let color = `hsl(${aDegrees},100%,50%)`;

        // Rainbow
        //let color = `hsl(${n/5 % 361},100%,50%)`;

        // Determine which algorithm to use to update the "flower" circle element radius
        if (trigFunc == "sine") {
            // Update the radius so it fluctuates with a sine wave
            this.radius = Math.sin(totalTime) + 2;
        } else if (trigFunc == "cosine") {
            // Update the radius so it fluctuates with a cosine wave
            this.radius = Math.cos(totalTime) + 2;
        } else {
            // Update the radius so it fluctuates with a tangent wave
            this.radius = Math.tan(totalTime) + 2;

            // Clamp the radius so the near infinite values are never reached
            // Clamp positive infinity to 3
            if (this.radius > 3) {
                this.radius = 3;
            }

            // Clamp negative infinity to 1
            if (this.radius < 1) {
                this.radius = 1;
            }
        }

        // Draw the current circle element of the "flower"
        this.drawCircle(ctx, x, y, this.radius, color);

        // Go to the next "flower" circle element
        this.n++;
    }

    // Converts from degrees to radians
    // "degrees" parameter: The angle to convert
    // Returns: The given angle converted to radians
    dtr(degrees) {
        return degrees * (Math.PI / 180);
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

// Export the PhylloFlower class
export { PhylloFlower };