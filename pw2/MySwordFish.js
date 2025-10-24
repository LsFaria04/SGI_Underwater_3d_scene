import * as THREE from 'three';
import {MyTriangle} from './MyTriangle.js';

/**
 * This class contains a 3D representation of a common carp fish
 */
class MySwordFish extends THREE.Object3D {
    /**
     * 
     * @param {number} widthBody Width of the fin body
     * @param {number} lengthBody Length of the fin body
     * @param {number} widthFin Width of the fins (widest fin)
     * @param {number} lengthFin Length of the fins (largest fin)
     * @param {string|number} color Color of the fish
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

    /**
     * Creates a high detail fish fin body (without fins)
     * @returns {THREE.Mesh} Returns a high detail fish body
     */
    createFishBody() {
        // Scaling factors
        let bw = this.widthBody;
        let bl = this.lengthBody;
        

        let vertices = [
            //front side (top row)
            bl / 2, 0,  0,
            bl / 2 * 0.8, bw * 0.1, bw /2 - bw /2 * 0.7,
            bl / 2 * 0.5, bw * 0.3, bw / 2 - bw /2 * 0.5,
            0, bw * 0.5, bw / 2,
            -bl / 2 * 0.7, bw * 0.5, bw / 2 - bw /2 * 0.2,
            -bl / 2, bw * 0.3, bw / 2 - bw /2 * 0.4,

            //front side head(top row)
            -bl / 2 - bl * 0.12, bw * 0.15,bw /2 - bw /2 * 0.5,
            -bl/ 2 - bl * 0.3, bw * 0.08,bw /2 - bw / 2 * 0.75,
            -bl / 2 -bl *0.6, 0,0,

            //front side (middle row)
            bl / 2, 0,  0,
            bl / 2 * 0.8, 0, bw /2  - bw /2 * 0.7  + bw * 0.1,
            bl / 2 * 0.5, 0, bw / 2 - bw /2 * 0.5 + bw * 0.1,
            0, 0, bw / 2  + bw * 0.1,
            -bl / 2 * 0.7, 0, bw / 2 - bw /2 * 0.2 + bw * 0.1,
            -bl / 2, 0 , bw / 2 - bw /2 * 0.4 + bw * 0.1,

            //front side head(middle row)
            -bl / 2 - bl * 0.12, 0,bw /2 - bw /2 * 0.5,
            -bl/ 2 - bl * 0.3, 0,bw /2 - bw / 2 * 0.75,
            -bl / 2 -bl *0.6, 0,0,

            //front side (bottom row)
            bl / 2, 0,  0,
            bl / 2 * 0.8, -bw * 0.1, bw /2 - bw /2 * 0.7,
            bl / 2 * 0.5, -bw * 0.3, bw / 2 - bw /2 * 0.5,
            0, -bw * 0.5, bw / 2,
            -bl / 2 * 0.7, -bw * 0.5, bw / 2 - bw /2 * 0.2,
            -bl / 2, -bw * 0.3, bw / 2 - bw /2 * 0.4,

            //front side head(bottom row)
            -bl / 2 - bl * 0.12, -bw * 0.15,bw /2 - bw /2 * 0.5,
            -bl/ 2 - bl * 0.3, -bw * 0.08,bw /2 - bw / 2 * 0.75,
            -bl / 2 -bl *0.6, 0,0,

            //bottom
             bl / 2, 0,  0,
            bl / 2 * 0.8, -bw * 0.1 - bw * 0.1, 0,
            bl / 2 * 0.5, -bw * 0.3 - bw * 0.1, 0,
            0, -bw * 0.5, 0,
            -bl / 2 * 0.7, -bw * 0.5 - bw * 0.1, 0,
            -bl / 2, -bw * 0.3 - bw * 0.1, 0,

            //bottom head
            -bl / 2 - bl * 0.12, -bw * 0.15 - bw * 0.1,0,
            -bl/ 2 - bl * 0.3, -bw * 0.08 - bw * 0.05,0,
            -bl / 2 -bl *0.6, 0,0,

            //back side (bottom)
            bl / 2, 0,  0,
            bl / 2 * 0.8, -bw * 0.1, -bw /2 + bw /2 * 0.7,
            bl / 2 * 0.5, -bw * 0.3, -bw / 2 + bw /2 * 0.5,
            0, -bw * 0.5, -bw / 2,
            -bl / 2 * 0.7, -bw * 0.5, -bw / 2 + bw /2 * 0.2,
            -bl / 2, -bw * 0.3, -bw / 2 + bw /2 * 0.4,

            //back side head (bottom)
            -bl / 2 - bl * 0.12, -bw * 0.15,-bw /2 + bw /2 * 0.5,
            -bl/ 2 - bl * 0.3, -bw * 0.08,-bw /2 + bw / 2 * 0.75,
            -bl / 2 -bl *0.6, 0,0,

            //back side (middle row)
            bl / 2, 0,  0,
            bl / 2 * 0.8, 0, -bw /2 - bw * 0.1 + bw /2 * 0.7,
            bl / 2 * 0.5, 0, -bw / 2 - bw * 0.1 +  bw /2 * 0.5,
            0, 0, -bw / 2 - bw * 0.1,
            -bl / 2 * 0.7, 0, -bw / 2 - bw * 0.1 + bw /2 * 0.2,
            -bl / 2, 0 , -bw / 2 - bw * 0.1 +  bw /2 * 0.4,

            //back side head(middle row)
            -bl / 2 - bl * 0.12, 0,-bw /2 + bw /2 * 0.5,
            -bl/ 2 - bl * 0.3, 0,-bw /2 + bw / 2 * 0.75,
            -bl / 2 -bl *0.6, 0,0,
            
            //back side (top row)
            bl / 2, 0,  0,
            bl / 2 * 0.8, bw * 0.1, -bw /2 + bw /2 * 0.7,
            bl / 2 * 0.5, bw * 0.3, -bw / 2 + bw /2 * 0.5,
            0, bw * 0.5, -bw / 2,
            -bl / 2 * 0.7, bw * 0.5, -bw / 2 + bw /2 * 0.2,
            -bl / 2, bw * 0.3, -bw / 2 + bw /2 * 0.4,

            //back side head(top row)
            -bl / 2 - bl * 0.12, bw * 0.15,-bw /2 + bw /2 * 0.5,
            -bl/ 2 - bl * 0.3, bw * 0.08,-bw /2 + bw / 2 * 0.75,
            -bl / 2 -bl *0.6, 0,0,

            //top body
            bl / 2, 0,  0,
            bl / 2 * 0.8, bw * 0.1 + bw * 0.1, 0,
            bl / 2 * 0.5, bw * 0.3 + bw * 0.1, 0,
            0, bw * 0.5, 0,
            -bl / 2 * 0.7, bw * 0.5 + bw * 0.1, 0,
            -bl / 2, bw * 0.3 + bw * 0.1, 0,

            //top head
            -bl / 2 - bl * 0.12, bw * 0.15 + bw * 0.1,0,
            -bl/ 2 - bl * 0.3, bw * 0.08 + bw * 0.05,0,
            -bl / 2 -bl *0.6, 0,0,
        ];

        let indices = [];
        //i is the number of rows and j is the number of vertices per row
        for(let i = 0; i < 7; i++){
            const currentRow = i * 9;
            const nextRow = (i + 1) * 9;
            for(let j = 0; j < 8; j++){
                indices.push(currentRow + j, currentRow + j + 1, nextRow + j);
                indices.push(nextRow + j, currentRow + j + 1, nextRow + j + 1);
            }
        }
        //indices between last and first rows
        const lastRow = 7 * 9;
        for(let j = 0; j < 8; j++){
            indices.push(lastRow + j, lastRow + 1 + j, j);
            indices.push(j, lastRow + j + 1, j + 1);
        }
        
        
        vertices = new Float32Array(vertices);
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        geometry.setIndex(indices);
        geometry.computeVertexNormals();

        const material = new THREE.MeshStandardMaterial({ color: this.color, side: THREE.DoubleSide });

        const detailedMesh = new THREE.Mesh(geometry, material);
        return detailedMesh;
    }

    /**
     * Creates a high detail fish fin used in the back of the fish
     * @returns {THREE.Mesh} Returns a high detail fin
     */
    createFishFinBack() {
        // Scaling factors
        const bw = this.widthBody;
        const fw = this.widthFin;
        const fl = this.lengthFin;


        let vertices = [
            //front (back row)
            fw / 2, -fl / 2,0,
            fw / 2 - fw / 2 * 0.5, 0,0,
            fw / 2, fl / 2, 0,

            //front (middle row)
            0, -fl / 2 * 0.5, 0,
            0, 0 ,bw /2 - bw /2 * 0.85,
            0, fl / 2 * 0.5, 0,

            //front (front row)
            -fw / 2, -bw * 0.1,bw /2 - bw /2 * 0.7,
            -fw / 2, 0,bw /2 - bw /2 * 0.7,
            -fw / 2, bw * 0.1, bw /2 - bw /2 * 0.7,

            //back (back row)
            fw / 2, -fl / 2,0,
            fw / 2 - fw / 2 * 0.5, 0,0,
            fw / 2, fl / 2, 0,

            //back (middle row)
            0, -fl / 2 * 0.5, 0,
            0, 0 ,-bw /2 + bw /2 * 0.85,
            0, fl / 2 * 0.5, 0,

            //back (front row)
            -fw / 2, -bw * 0.1,-bw /2 + bw /2 * 0.7,
            -fw / 2, 0,-bw /2 + bw /2 * 0.7,
            -fw / 2, bw * 0.1, -bw /2 + bw /2 * 0.7,
        ];
        
        let indices = [];
        //i is the number of rows and j is the number of vertices per row
        for(let i = 0; i < 2; i++){
            const currentRow = i * 3;
            const nextRow = (i + 1) * 3;
            for(let j = 0; j < 2; j++){
                indices.push(currentRow + j, currentRow + j + 1, nextRow + j);
                indices.push(nextRow + j, currentRow + j + 1, nextRow + j + 1);
            }
        }

        //back face of the fin
        const backRows = 3 * 3;
        for(let i = 0; i < 2; i++){
            const currentRow = backRows + i * 3;
            const nextRow = backRows + ( i + 1) * 3;
            for(let j = 0; j < 2; j++){
                indices.push(currentRow + j, currentRow + j + 1, nextRow + j);
                indices.push(nextRow + j, currentRow + j + 1, nextRow + j + 1);
            }
        }
        
        //top cover
        indices.push(5, 3 * 2 + 2, 3 * 5 + 2);
        //bottom cover
        indices.push(3, 3 * 5,6);

        vertices = new Float32Array(vertices);
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        geometry.setIndex(indices);
        geometry.computeVertexNormals();

        const material = new THREE.MeshStandardMaterial({ color: this.color, side: THREE.DoubleSide });

        const detailedMesh = new THREE.Mesh(geometry, material);
        return detailedMesh;
    }

    /**
     * Creates a high detail fish fin used in the top of the fish
     * @returns {THREE.Mesh} Returns a high detail fin
     */
    createTopFin(){

         // Scaling factors
        const bw = this.widthBody;
        const fw = this.widthFin;
        const fl = this.lengthFin;


        let vertices = [
            //front (back row)
            fw / 2, -fl / 4,bw /2 - bw /2 * 0.7,
            fw / 2 - fw / 2 * 0.5, -fl / 4 * 0.5,bw /2 - bw /2 * 0.8,
            fw / 2 - fw / 2 * 0.8, fl / 4 * 0.5,bw /2 - bw /2 * 0.9,
            fw / 2 - fw / 2 * 0.5, fl / 4, 0,

            //front (front row)
            -fw / 2, -fl / 4,bw /2 - bw /2 * 0.7,
            -fw / 2 + fw / 2 * 0.4, -fl / 4 * 0.5,bw /2 - bw /2 * 0.8,
            -fw / 2 + fw / 2 * 0.8, fl / 4 * 0.5,bw /2 - bw /2 * 0.9,
            fw / 2 - fw / 2 * 0.5, fl / 4, 0,

            //back (back row)
            fw / 2, -fl / 4,-bw /2 + bw /2 * 0.7,
            fw / 2 - fw / 2 * 0.5, -fl / 4 * 0.5,-bw /2 + bw /2 * 0.8,
            fw / 2 - fw / 2 * 0.8, fl / 4 * 0.5,-bw /2 + bw /2 * 0.9,
            fw / 2 - fw / 2 * 0.5, fl / 4, 0,

            //back (front row)
            -fw / 2, -fl / 4,-bw /2 + bw /2 * 0.7,
            -fw / 2 + fw / 2 * 0.4, -fl / 4 * 0.5,-bw /2 + bw /2 * 0.8,
            -fw / 2 + fw / 2 * 0.8, fl / 4 * 0.5,-bw /2 + bw /2 * 0.9,
            fw / 2 - fw / 2 * 0.5, fl / 4, 0,
        ];
        
        let indices = [];
        
        //i is the number of rows and j is the number of vertices per row
        for(let i = 0; i < 1; i++){
            const currentRow = i * 4;
            const nextRow = (i + 1) * 4;
            for(let j = 0; j < 3; j++){
                indices.push(currentRow + j, currentRow + j + 1, nextRow + j);
                indices.push(nextRow + j, currentRow + j + 1, nextRow + j + 1);
            }
        }
        
        //back face of the fin
        const backRows = 2 * 4;
        for(let i = 0; i < 1; i++){
            const currentRow = backRows + i * 4;
            const nextRow = backRows + ( i + 1) * 4;
            for(let j = 0; j < 3; j++){
                indices.push(currentRow + j, currentRow + j + 1, nextRow + j);
                indices.push(nextRow + j, currentRow + j + 1, nextRow + j + 1);
            }
        }
        
        //side face fin
        const  lastRow = 3 * 4;
        const secondRow = 4;
        for(let j = 0; j < 3; j++){
                indices.push(secondRow + j, secondRow + j + 1, lastRow + j);
                indices.push(lastRow + j, secondRow + j + 1, lastRow + j + 1);
        }

        //side face fin
        const firstRowBack = 2 * 4;
        for(let j = 0; j < 3; j++){
                indices.push(j, j + 1, firstRowBack + j);
                indices.push(firstRowBack + j, j + 1, firstRowBack + j + 1);
        }
        

        vertices = new Float32Array(vertices);
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        geometry.setIndex(indices);
        geometry.computeVertexNormals();

        const material = new THREE.MeshStandardMaterial({ color: this.color, side: THREE.DoubleSide });

        const detailedMesh = new THREE.Mesh(geometry, material);
        return detailedMesh;

    }

    /**
     * Creates a high detail fish fin used in the bottom of the fish
     * @returns {THREE.Mesh} Returns a high detail fin
     */
    createBottomFin(){

        // Scaling factors
        const bw = this.widthBody;
        const fw = this.widthFin;
        const fl = this.lengthFin;


        let vertices = [
            //front (back row)
            fw / 4, fl / 8,bw /2 - bw /2 * 0.7,
            fw / 4 - fw / 4 * 0.5, fl / 8 * 0.5,bw /2 - bw /2 * 0.8,
            fw / 4 - fw / 4 * 0.8, -fl / 8 * 0.5,bw /2 - bw /2 * 0.9,
            fw / 4 - fw / 4 * 0.5, -fl / 8, 0,

            //front (front row)
            -fw / 4, fl / 8,bw /2 - bw /2 * 0.7,
            -fw / 4 + fw / 4 * 0.4, fl / 8 * 0.5,bw /2 - bw /2 * 0.8,
            -fw / 4 + fw / 4 * 0.8, -fl / 8 * 0.5,bw /2 - bw /2 * 0.9,
            fw / 4 - fw / 4 * 0.5, -fl / 8, 0,

            //back (back row)
            fw / 4, fl / 8,-bw /2 + bw /2 * 0.7,
            fw / 4 - fw / 4 * 0.5, fl / 8 * 0.5,-bw /2 + bw /2 * 0.8,
            fw / 4 - fw / 4 * 0.8, -fl / 8 * 0.5,-bw /2 + bw /2 * 0.9,
            fw / 4 - fw / 4 * 0.5, -fl / 8, 0,

            //back (front row)
            -fw / 4, fl / 8,-bw /2 + bw /2 * 0.7,
            -fw / 4 + fw / 4 * 0.4, fl / 8 * 0.5,-bw /2 + bw /2 * 0.8,
            -fw / 4 + fw / 4 * 0.8, -fl / 8 * 0.5,-bw /2 + bw /2 * 0.9,
            fw / 4 - fw / 4 * 0.5, -fl / 8, 0,
        ];
        
        let indices = [];
        
        //i is the number of rows and j is the number of vertices per row
        for(let i = 0; i < 1; i++){
            const currentRow = i * 4;
            const nextRow = (i + 1) * 4;
            for(let j = 0; j < 3; j++){
                indices.push(currentRow + j, currentRow + j + 1, nextRow + j);
                indices.push(nextRow + j, currentRow + j + 1, nextRow + j + 1);
            }
        }
        
        //back face of the fin
        const backRows = 2 * 4;
        for(let i = 0; i < 1; i++){
            const currentRow = backRows + i * 4;
            const nextRow = backRows + ( i + 1) * 4;
            for(let j = 0; j < 3; j++){
                indices.push(currentRow + j, currentRow + j + 1, nextRow + j);
                indices.push(nextRow + j, currentRow + j + 1, nextRow + j + 1);
            }
        }
        
        //side face fin
        const  lastRow = 3 * 4;
        const secondRow = 4;
        for(let j = 0; j < 3; j++){
                indices.push(secondRow + j, secondRow + j + 1, lastRow + j);
                indices.push(lastRow + j, secondRow + j + 1, lastRow + j + 1);
        }

        //side face fin
        const firstRowBack = 2 * 4;
        for(let j = 0; j < 3; j++){
                indices.push(j, j + 1, firstRowBack + j);
                indices.push(firstRowBack + j, j + 1, firstRowBack + j + 1);
        }
        

        vertices = new Float32Array(vertices);
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        geometry.setIndex(indices);
        geometry.computeVertexNormals();

        const material = new THREE.MeshStandardMaterial({ color: this.color, side: THREE.DoubleSide });

        const detailedMesh = new THREE.Mesh(geometry, material);
        return detailedMesh;

    }

    /**
     * Creates a low detail fish with only simple geometry (planes and triangles)
     * @returns {THREE.Mesh} Returns a low detail fish
     */
    createLowDetailFish(){
        const fish = new THREE.Group();
        const material = new THREE.MeshStandardMaterial({ color: this.color, side: THREE.DoubleSide });
        const bodyGeometry = new THREE.PlaneGeometry(this.lengthBody, this.widthBody);
        const body = new THREE.Mesh(bodyGeometry, material);
        fish.add(body);

        const headGeometry = new MyTriangle(-this.lengthBody / 2, this.widthBody / 2,0,-this.lengthBody / 2 - this.lengthBody * 0.6,0,0,-this.lengthBody / 2,-this.widthBody / 2,0);
        const head = new THREE.Mesh(headGeometry, material)
        fish.add(head)

        const finGeometry = new MyTriangle(this.lengthBody / 2 + this.widthFin, this.lengthFin / 2,0,this.lengthBody / 2,0,0,this.lengthBody / 2 + this.widthFin,-this.lengthFin / 2,0);
        const fin = new THREE.Mesh(finGeometry, material)
        fish.add(fin)

        return fish;
    }


    init() {
        const lod = new THREE.LOD();
        
        // 1. Detailed Mesh (Level 0) - Distance 0
        const fish = this.createFishBody();
        const fishBackFin = this.createFishFinBack();
        const fishTopFin = this.createTopFin();
        const fishBottomFin = this.createBottomFin();
        fishBackFin.position.set(this.lengthBody / 2 ,0,0);
        fishTopFin.position.set(-this.lengthBody/ 2 * 0.5,this.lengthFin / 4 + this.widthBody / 2,0);
        fishBottomFin.position.set(-this.lengthBody/ 2 * 0.5,-this.lengthFin / 8 - this.widthBody / 2,0);
        const detailedWrapper = new THREE.Object3D();
        detailedWrapper.add(fish);
        detailedWrapper.add(fishBackFin);
        detailedWrapper.add(fishTopFin);
        detailedWrapper.add(fishBottomFin);
        lod.addLevel(detailedWrapper, 0);

        // 2. Medium-Detail Mesh (Level 1)
        const fishMedium = this.createFishBody();
        const fishBackFinMedium = this.createFishFinBack();
        fishBackFinMedium.position.set(this.lengthBody / 2 ,0,0);
        const mediumWrapper = new THREE.Object3D();
        mediumWrapper.add(fishMedium);
        mediumWrapper.add(fishBackFinMedium);
   
        lod.addLevel(mediumWrapper, this.lodMediumThreshold);

        //3. Low-Detail Mesh (Level 2)
        const fishLow = this.createLowDetailFish();
        const lowWrapper = new THREE.Object3D();
        lowWrapper.add(fishLow);
        lod.addLevel(lowWrapper, this.lodBasicThreshold);
    
        this.position.y = this.widthBody / 2;

        this.add(lod);
    }
}

export { MySwordFish };
