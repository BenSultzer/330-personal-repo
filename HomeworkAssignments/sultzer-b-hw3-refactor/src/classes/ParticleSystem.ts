// Import the Particle class
import { Particle } from "./Particle";

// Import helper functions
import * as utils from '../utils';

// Overview: Homework 3
// Author: Ben Sultzer <bms3902@rit.edu>
// Description: Class that creates an explosion at a point
class ParticleSystem {
    positionX:number;
    positionY:number;
    particles:Particle[];
    particleRadius:number;
    particleColor:string;

    // Initializes the data necessary for a particle system
    // "positionX" parameter: The x-coordinate of the particle system's origin
    // "positionY" parameter: The y-coordinate of the particle system's origin
    // "numParticles" parameter: The number of particles in this particle system
    // Returns: Nothing
    constructor(positionX:number, positionY:number, numParticles:number, particleRadius:number, particleColor:string) {
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
    createParticleSystem(): void {
        // Loop through this particle system's list of particles and initialize all particles
        for(let i:number = 0; i < this.particles.length; i++) {
            this.particles[i] = new Particle(this.positionX, 
                                             this.positionY, 
                                             this.particleRadius, 
                                             this.particleColor, 
                                             utils.getRandom(100, 200), 
                                             new Array(utils.getRandom(-1, 1), utils.getRandom(-1, 1)));
        }
    }

    // Udpates all particles in this particle system to create an explosion!
    // "ctx" parameter: The 2D drawing context to use for drawing
    // "deltaTime" parameter: The time that has passed since last frame
    // Returns: Nothing
    update(ctx:CanvasRenderingContext2D, deltaTime:number): void {
        // Loop through all particles, updating their data then drawing them
        for (let i:number = 0; i < this.particles.length; i++) {
            this.particles[i].update(deltaTime);
            this.particles[i].draw(ctx);
        }
    }
}

// Export the ParticleSystem class
export { ParticleSystem };