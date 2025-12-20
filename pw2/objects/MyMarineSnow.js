import * as THREE from 'three';


/**
 * This class represents snow particles falling down into the sea bed
 * 
**/



export class MyMarineSnow extends THREE.Object3D {
    /**
     *  
     * @param {number} sizes Sizes of the snow particles
     * @param {*} colors Array of colors for the snow particles
     * @param {*} sprites Array of textures for the snow particles
     * @param {number} fallSpeed Speed at which the snow particles fall
     **/
    constructor(sizes = [1], colors = ["#FFFFFF"], sprites = null, fallSpeed = 0.05){
        super();

        this.fallSpeed = fallSpeed;
        this.time = 0;

        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        this.fallSpeeds = [];
        this.meanderSpeeds = [];
        this.meanderOffsets = [];

        // Generate 100 random vertices within a cube of 50X50X50
        for (let i = 0; i < 100; i++) {
            const x = 50 * Math.random() - 25;
            const y = 50 * Math.random() - 25;
            const z = 50 * Math.random() - 25;
            this.fallSpeeds.push(this.fallSpeed * Math.random() + this.fallSpeed);
            this.meanderSpeeds.push(Math.random() * 0.5 + 0.2); // Random horizontal movement speed
            this.meanderOffsets.push(Math.random() * Math.PI * 2); // Random phase offset
            vertices.push(x, y, z);
        }

        this.initialPositions = [...vertices]; // Store initial positions
        geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));

        this.materials = this.buildMaterials(colors, sprites, sizes);
        this.particles = [];
        for (let i = 0; i < this.materials.length; i++) {
            this.particles[i] = new THREE.Points(geometry, this.materials[i]);
        }
        this.add(...this.particles);
    }


    buildMaterials(colors, sprites, sizes){
        var materials = [];

        // Assuming colors length is equal to sprites length
        for (let i = 0; i < colors.length; i++){
            materials[i] = new THREE.PointsMaterial({
                size: sizes[i],
                color: new THREE.Color(colors[i]),
                map: sprites ? sprites[i] : null,
                blending: THREE.AdditiveBlending,
                transparent: true,
                depthWrite: false,
            });
        }

        return materials;
    }

    getMaterials(){
        return this.materials;
    }

    update(delta){
        this.time += delta;

        // Update particle positions
        for (let i = 0; i < this.particles.length; i++) {
            const object = this.particles[i];
            if (object instanceof THREE.Points) {
                const positions = object.geometry.attributes.position.array;
                
                // Update each vertex individually
                for (let j = 0; j < positions.length; j += 3) {
                    const particleIndex = j / 3;
                    
                    // Horizontal meandering using sine waves
                    const originalX = this.initialPositions[j];
                    const originalZ = this.initialPositions[j + 2];
                    
                    positions[j] = originalX + Math.sin(this.time * this.meanderSpeeds[particleIndex] + this.meanderOffsets[particleIndex]) * 3; // X meandering
                    positions[j + 2] = originalZ + Math.cos(this.time * this.meanderSpeeds[particleIndex] * 0.7 + this.meanderOffsets[particleIndex]) * 2; // Z meandering
                    
                    // Vertical falling
                    positions[j + 1] -= this.fallSpeeds[particleIndex] * delta * 60; // Y is at index j + 1
                    
                    if (positions[j + 1] < -10) {
                        positions[j + 1] = 25; // Reset this particle to top
                        // Reset to original horizontal position when particle resets
                        positions[j] = originalX;
                        positions[j + 2] = originalZ;
                    }
                }
                
                object.geometry.attributes.position.needsUpdate = true;
            }
        }
        
    }

}