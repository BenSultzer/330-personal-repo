// Import the Particle class
import { Particle } from "./Particle.js";

// Import helper functions
import * as utils from '../utils.js';

// Author: Ben Sultzer <bms3902@rit.edu>
// Description: Class that creates an explosion at a point
class ParticleSystem {
    // Initializes the data necessary for a particle system
    // "positionX" parameter: The x-coordinate of the particle system's origin
    // "positionY" parameter: The y-coordinate of the particle system's origin
    // "numParticles" parameter: The number of particles in this particle system
    // Returns: Nothing
    constructor(positionX, positionY, numParticles, particleRadius, particleColor) {
        this.positionX = positionX;
        this.positionY = positionY;
        this.particles = new Array(numParticles);
        this.particleRadius = particleRadius;
        this.particleColor = particleColor;

        // Initialize the particle system
        this.createParticleSystem();
    }

    // Creates the particle system with the indicated number of particles
    // Returns: Nothing
    createParticleSystem() {
        // Loop through this particle system's list of particles and initialize all particles
        for(let i = 0; i < this.particles.length; i++) {
            this.particles[i] = new Particle(this.positionX, 
                                             this.positionY, 
                                             this.particleRadius, 
                                             this.particleColor, 
                                             getRandom(0, 5), 
                                             new Array(getRandom(0, 1), getRandom(0, 1)));
        }
    }

    // Udpates all particles in this particle system to create an explosion!
    // "ctx" parameter: The 2D drawing context to use for drawing
    // "deltaTime" parameter: The time that has passed since last frame
    // Returns: Nothing
    update(ctx, deltaTime) {
        // Loop through all particles, updating their data then drawing them
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].update(deltaTime);
            this.particles[i].draw(ctx);
        }
    }
}

// Export the ParticleSystem class
export { ParticleSystem };