import * as THREE from 'three';
import { generateRandom } from './utils.js';
/**
 * This class represents a sea plant
 */
class MySeaPlant extends THREE.Object3D {
    /**
     * 
     * @param {*} width Width of the plant
     * @param {*} height Height of the plant
     * @param {*} depth Depth of the plant
     * @param {*} color Color of the plant
     * @param {*} plantTexture Texture of the plant
     * @param {string} LOD Level of detail ("L", "M", "H")
     */
    constructor(width = 0.2, height = 1, depth = 0.05, color = "#000000", plantTexture, LOD){
        super();
        
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.plantTexture = plantTexture;
        this.color = color;
        
        switch (LOD){
            case "L":
                this.initLowLOD();
                break;
            case "M":
                this.initMidLOD();
                break;
            case "H":
                this.initHighLOD();
                break;
            default:
                this.initLowLOD();
        }
        
    }

    initLowLOD(){
        //simple box 
        const plantGeometry = new THREE.BoxGeometry(this.width, this.height, this.depth);
        const plantMaterial = new THREE.MeshPhongMaterial({color: this.color, map: this.plantTexture ? this.plantTexture : null});
        const plant = new THREE.Mesh(plantGeometry, plantMaterial);
        plant.position.y = this.height / 2;

        this.add(plant);
    }
    initMidLOD(){
        const plantGeometry = new THREE.BoxGeometry(this.width, this.height, this.depth, 4,4,4);

        const pos = plantGeometry.attributes.position;
        const vect = new THREE.Vector3();

        const frequency = generateRandom(1, 20);
        const phase = generateRandom(1,2);
        //adds some curvature to the plant
        for (let i = 0; i < pos.count; i++) {
            vect.fromBufferAttribute(pos, i);
            const bend = 0.2;

            vect.x += Math.sin(vect.y * frequency + phase) * bend;

            pos.setXYZ(i, vect.x, vect.y, vect.z);
        }
        pos.needsUpdate = true;
        plantGeometry.computeVertexNormals();

        const plantMaterial = new THREE.MeshPhongMaterial({color: this.color, map: this.plantTexture ? this.plantTexture : null});
        const plant = new THREE.Mesh(plantGeometry, plantMaterial);
        plant.position.y = this.height / 2;

        this.add(plant);
    }
    initHighLOD(){
        const plantGeometry = new THREE.BoxGeometry(this.width, this.height, this.depth, this.width / 0.05,this.height / 0.05,this.depth /0.05);

        const pos = plantGeometry.attributes.position;
        const vect = new THREE.Vector3();

        const frequency = generateRandom(1, 20);
        const phase = generateRandom(1,2);
        //adds some curvature to the plant
        for (let i = 0; i < pos.count; i++) {
            vect.fromBufferAttribute(pos, i);
            const bend = 0.2;
            vect.x += Math.sin(vect.y * frequency + phase) * bend;

            pos.setXYZ(i, vect.x, vect.y, vect.z);
        }
        pos.needsUpdate = true;
        plantGeometry.computeVertexNormals();

        const plantMaterial = new THREE.MeshPhongMaterial({color: this.color, map: this.plantTexture ? this.plantTexture : null});
        const plant = new THREE.Mesh(plantGeometry, plantMaterial);
        plant.position.y = this.height / 2;

        this.add(plant);
    }
}

export{ MySeaPlant};