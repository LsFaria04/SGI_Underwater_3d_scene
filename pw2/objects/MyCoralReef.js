import * as THREE from 'three';
import { MyCoral } from './MyCoral.js';
import { floorHeightPosition, generateRandom } from '../utils.js';

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
        this.corals = [];
        this.helpers = [];


        for (let i = 0; i < numbCorals; i++){

            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * radius * Math.sqrt(Math.random()); // Favors center concentration
            const x = Math.cos(angle) * dist;
            const z = Math.sin(angle) * dist;

            const coralMeshGroup = this.coralGen.generateCoralMesh(this.type, iterations, generateRandom(0.05, 0.1));

            const worldX = this.position.x + x;
            const worldZ = this.position.z + z;
            coralMeshGroup.position.set(x, floorHeightPosition(worldX, worldZ), z);
            coralMeshGroup.rotation.y = Math.random() * Math.PI * 2;

            //used for the collision system
            coralMeshGroup.box = new THREE.Box3().setFromObject(coralMeshGroup, true);
            const helper = new THREE.Box3Helper(coralMeshGroup.box, 0xff0000);
            helper.visible = false;
            this.add(helper);
            this.helpers.push(helper);

            this.corals.push(coralMeshGroup);

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