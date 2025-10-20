import * as THREE from 'three';
import {MyTriangle} from './MyTriangle.js';

/**
 * This class contains a 3D representation of a common carp fish
 */
class MyCarp extends THREE.Object3D {
    /**
     * 
     * @param {number} widthBody Width of the carp body
     * @param {number} lengthBody Length of the carp body
     * @param {number} widthFin Width of the fins
     * @param {number} lengthFin Length of the fins
     * @param {string|number} color Color of the carp
     */
    constructor(widthBody = 1, lengthBody = 3, widthFin = 0.5, lengthFin = 0.5, color = 0xffaa00) {
        super();

        this.widthBody = widthBody;
        this.lengthBody = lengthBody;
        this.widthFin = widthFin;
        this.lengthFin = lengthFin;
        this.color = color;
        this.lodMediumThreshold = 15;
        this.lodBasicThreshold = 30;
        

        this.init();
    }

    createFishMesh(includeSmallFins = true) {
        // Scaling factors
        const bw = this.widthBody;
        const bl = this.lengthBody;
        const fw = this.widthFin;
        const fl = this.lengthFin;

        // Original vertices scaled accordingly
        const vertices = new Float32Array([
            // Head - left side
            0, 1 * bw, 0,               // 0
            0.5 * bl, 0.5 * bw, 0,      // 1
            0.6 * bl, 1 * bw, 0.2 * bw, // 2
            0.5 * bl, 1.5 * bw, 0,      // 3
            0.6 * bl, 1 * bw, -0.2 * bw, // 4

            // Body center
            2.5 * bl, 1 * bw, 0,        // 5

            // Back Fin
            (2.5 + 0.5) * bl, (1 + Math.max(0.5 * fl / 2,0.5)) * bw, 0,    // 6
            (2.5 + 0.5) * bl, (1 - Math.max(0.5 * fl / 2,0.5)) * bw, 0,    // 7
            (2.5 + 0.25) * bl, 1 * bw, 0,               // 8

            // Top Fin
            1.5 * bl, (1 + 0.2) * bw, 0,        // 9
            1.25 * bl, (1 + 0.3) * bw, 0,       // 10
            1.40 * bl, (1 + Math.max(0.6 * fl / 2,0.6)) * bw, 0,       // 11
            1.70 * bl, (1 + Math.max(0.4 * fl / 2,0.4)) * bw, 0,       // 12

            // Belly Fins (right)
            0.75 * bl , 1 * bw, 0.16 * bw,           // 13
            1 * bl + fw/4, (1 + 0.3 * fl) * bw, 0.3 * bw,   // 14
            1 * bl + fw/4, (1 - 0.3 * fl) * bw, 0.3 * bw,   // 15

            // Belly Fins (left)
            0.75 * bl, 1 * bw, -0.16 * bw,           // 16
            1 * bl + fw/4, (1 + 0.3 * fl) * bw, -0.3 * bw,   // 17
            1 * bl + fw/4, (1 - 0.3 * fl) * bw, -0.3 * bw,   // 18
        ]);

        // Define faces (triangles)
        let indices = [
            // Face
            0, 1, 2,
            0, 2, 3,
            0, 1, 4,
            0, 4, 3,

            // Body
            1, 2, 5,
            1, 4, 5,
            3, 2, 5,
            3, 5, 4,

            // Back Fin
            5, 6, 8,
            5, 7, 8,

            /*

            // Top Fin
            9, 10, 11,
            9, 11, 12,

            // Belly Fins
            13, 14, 15,
            16, 17, 18,

            */
        ];

        if (includeSmallFins) {
            indices = indices.concat([
                // Top Fin
                9, 10, 11,
                9, 11, 12,

                // Belly Fins
                13, 14, 15,
                16, 17, 18,
            ]);
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        geometry.setIndex(indices);
        geometry.computeVertexNormals();

        const material = new THREE.MeshStandardMaterial({ color: this.color, side: THREE.DoubleSide });

        const detailedMesh = new THREE.Mesh(geometry, material);
        return detailedMesh;
    }

    /**
     * Creates the simplified geometry for the fish (Level 1)
     * @returns {THREE.Mesh} The simplified fish mesh
     */
    createSimplifiedMesh() {
        // Use a simple BoxGeometry as the basic block
        const simpleFish = new THREE.Group();
        const geometry = new THREE.PlaneGeometry(this.lengthBody * 2, this.widthBody /2 );
        const face = new MyTriangle(this.lengthBody * 1.5,this.widthBody / 4,0,this.lengthBody * 2,0,0,this.lengthBody * 2,this.widthBody /2,0);
        const back = new MyTriangle(this.lengthBody * 1.5,this.widthBody / 2,0,this.lengthBody * 2,0,0,this.lengthBody * 2,this.widthBody ,0);
        const material = new THREE.MeshStandardMaterial({ color: this.color, side: THREE.DoubleSide });
        const simplifiedMesh = new THREE.Mesh(geometry, material);
        const simplifiedHead = new THREE.Mesh(face,material);
        const simplifiedBack = new THREE.Mesh(back, material);

        simplifiedMesh.position.x = this.lengthBody * 1.5;
        simplifiedMesh.position.y = this.widthBody;
        simplifiedMesh.position.z = 0;

        simplifiedHead.position.x = -this.lengthBody * 1.5;
        simplifiedHead.position.y = this.widthBody * 0.75;
        simplifiedHead.position.z = 0;

        simplifiedBack.position.x = this.lengthBody;
        simplifiedBack.position.y = this.widthBody * 0.5;
        simplifiedBack.position.z = 0;

        simpleFish.add(simplifiedMesh);
        simpleFish.add(simplifiedHead);
        simpleFish.add(simplifiedBack);

        return simpleFish;
    }

    /**
     * Creates the high-detail geometry for the fish
    */
    createDetailedMesh() {
        return this.createFishMesh(true);
    }

    /**
     * Creates the medium-detail geometry for the fish (Level 1) - small fins removed.
    */
    createMediumDetailMesh() {
        return this.createFishMesh(false);
    }



    init() {
        const lod = new THREE.LOD();
        
        // 1. Detailed Mesh (Level 0) - Distance 0
        const detailedFish = this.createDetailedMesh();
        const detailedWrapper = new THREE.Object3D();
        detailedWrapper.add(detailedFish);
        lod.addLevel(detailedWrapper, 0);

        // 2. Medium-Detail Mesh (Level 1)
        const mediumDetailFish = this.createMediumDetailMesh();
        const mediumWrapper = new THREE.Object3D();
        mediumWrapper.add(mediumDetailFish);
   
        lod.addLevel(mediumWrapper, this.lodMediumThreshold);

        // 3. Simplified Mesh (Level 2) - Basic Block
        const simplifiedFish = this.createSimplifiedMesh();
        lod.addLevel(simplifiedFish, this.lodBasicThreshold);
        
        this.position.y = this.widthBody * 1.5;

        this.add(lod);
    }
}

export { MyCarp };
