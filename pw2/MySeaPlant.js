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
    constructor(width = 0.2, height = 1, depth = 0.05, color = "#000000",LOD){
        super();
        
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.color = color;
        
        //create a common shader material to allow a performante calculation of the animation (in the GPU)
        let uniforms = {
            uTime: { value: 0 },
            uBend: { value: 0.1 },
            height: {value: height},
            uColor: {value: new THREE.Color(color)}
        };
        this.material = new THREE.ShaderMaterial({
            uniforms,
            vertexShader: `
                uniform float uTime;
                uniform float uBend;
                uniform float height;
                void main() {
                float influence = (position.y + height * 0.5 ) / height;
                vec3 transformed = position;
                transformed.x += sin(uTime + position.y) * uBend * influence;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 uColor;
                void main() {
                gl_FragColor = vec4(uColor, 1.0);
                }
            `,
        });

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

        this.plant = new THREE.Mesh(plantGeometry, this.material);
        this.plant.position.y = this.height / 2;

        this.add(this.plant);
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

        this.plant = new THREE.Mesh(plantGeometry, this.material);
        this.plant.position.y = this.height / 2;

        this.add(this.plant);
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

        this.plant = new THREE.Mesh(plantGeometry, this.material);
        this.plant.position.y = this.height / 2;

        this.add(this.plant);
    }

    updateColor(color){
        this.material.uniforms.uColor.value.set(new THREE.Color(color));
    }

    update(delta){
        // Accumulate elapsed time
        if (!this.elapsed) this.elapsed = 0;
        this.elapsed += delta;

        //update the time in the shader to animate the plant
        this.material.uniforms.uTime.value = this.elapsed;
    }
}

export{ MySeaPlant};