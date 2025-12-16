import * as THREE from 'three';
import { MyCoral } from './MyCoral.js';
import { floorHeightPosition } from '../utils.js';

class MyCoralReef extends THREE.Group {
      /**
     * 
     * @param {number} numbCorals Number of corals in the reef
     * @param {string} type Coral Type
     * @param {number} radius Radius of the reef
     * @param {number} iterations Iterations of L Stochastic 
     */
    constructor(numbCorals = 5,x, z, type = 'branchingCoral', radius = 3, iterations = 4, texture){
        super();
        this.position.set(x, 0, z);
        this.name = "CoralReefGroup";

        this.coralGen = new MyCoral(texture);
        this.type = this.coralGen.coralPresets[type];

        const coralMeshTemplate = this.coralGen.generateCoralMesh(this.type, iterations);

        for (let i = 0; i < numbCorals; i++){

            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * radius * Math.sqrt(Math.random()); // Favors center concentration
            const x = Math.cos(angle) * dist;
            const z = Math.sin(angle) * dist;

            const coralMeshGroup = coralMeshTemplate.clone();

            const worldX = this.position.x + x;
            const worldZ = this.position.z + z;
            coralMeshGroup.position.set(x, floorHeightPosition(worldX, worldZ), z);
            coralMeshGroup.rotation.y = Math.random() * Math.PI * 2;

            this.add(coralMeshGroup);
        }
        
    }

    dispose() {
        this.traverse(child => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach(m => m.dispose());
                } else {
                    child.material.dispose();
                }
            }
        });
    }
}

export{ MyCoralReef };