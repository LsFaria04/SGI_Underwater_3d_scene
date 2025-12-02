import * as THREE from 'three';
import {MyTriangle} from '../objects/MyTriangle.js';
import {
	computeBoundsTree, disposeBoundsTree,
	computeBatchedBoundsTree, disposeBatchedBoundsTree, acceleratedRaycast,
    StaticGeometryGenerator, MeshBVHHelper
} from '../index.module.js';

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
    constructor(widthBody = 1, lengthBody = 3, widthFin = 0.5, lengthFin = 0.5, color = 0xffaa00, texture) {
        super();

        this.widthBody = widthBody;
        this.lengthBody = lengthBody;
        this.widthFin = widthFin;
        this.lengthFin = lengthFin;
        this.color = color;
        this.lodMediumThreshold = 25;
        this.lodBasicThreshold = 35;
        this.texture = texture;
        this.bvh = false;
        

        this.init();
    }

    /**
     * Creates a high detail fish body (without fins) with skinning 
     * @returns {THREE.SkinnedMesh} Returns a high detail fish body
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

            //duplicated
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
        ];

        let indices = [];
        //i is the number of rows and j is the number of vertices per row
        for(let i = 0; i < 8; i++){
            const currentRow = i * 9;
            const nextRow = (i + 1) * 9;
            for(let j = 0; j < 8; j++){
                indices.push(currentRow + j, currentRow + j + 1, nextRow + j);
                indices.push(nextRow + j, currentRow + j + 1, nextRow + j + 1);
            }
        }
        
        
        vertices = new Float32Array(vertices);
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        geometry.setIndex(indices);
        geometry.computeVertexNormals();

        //Bones
        let bones = [];

        const boneCount = 4;
        
        for(let i = 0; i < boneCount; i++){
            const bone = new THREE.Bone();
            if (i > 0) {
                // distance between consecutive bones
                bone.position.x = bl / (boneCount -1);
                bone.position.y = 0;
                bones[i - 1].add(bone);
            } else {
                // root bone at the start of the fish
                bone.position.x = -bl / 2;
                bone.position.y = 0;
            }

            bones.push(bone);
        }


        // --- Skinning attributes ---
        const skinIndices = [];
        const skinWeights = [];

        // Assign weights based on vertex x position
        const vertexCount = vertices.length / 3; // number of vertices
        const vertsPerRow = 9;                   // 9 per line

        for (let v = 0; v < vertexCount; v++) {
            // Column index along the fish (0 = Head, 9 = tail)
            const col = v % vertsPerRow;
            const t = 1- (col / (vertsPerRow - 1)); // normalized [0..1] along body

            if(col > 5){
                //the head vertex should stay fixed between the first and second bones
                    const bonePos = t * (boneCount - 1);
                    const w1 = bonePos - 0;
                    const w0 = 1.0 - w1;
                    skinIndices.push(0, 1, 0, 0);
                    skinWeights.push(w0, w1, 0, 0);
                }
            else{
                
                // Map to bone space
                const bonePos = t * (boneCount - 1);

                const boneIndex0 = Math.floor(bonePos);
                const boneIndex1 = Math.min(boneIndex0 + 1, boneCount - 1);

                const w1 = bonePos - boneIndex0;
                const w0 = 1.0 - w1;

                // Assign indices and weights
                skinIndices.push(boneIndex0, boneIndex1, 0, 0);
                skinWeights.push(w0, w1, 0, 0);
                
            } 
            
        }


        geometry.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(skinIndices, 4));
        geometry.setAttribute('skinWeight', new THREE.Float32BufferAttribute(skinWeights, 4));

        const rows = Math.floor(vertexCount / vertsPerRow);
        const uvs = [];

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < vertsPerRow ; c++) {
                const u = c / (vertsPerRow - 1);
                let v = r / (rows - 1);
                uvs.push(u, v);
            }
        }

        geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));

        this.texture.wrapS = THREE.MirroredRepeatWrapping;
        this.texture.wrapT = THREE.MirroredRepeatWrapping;
        this.texture.repeat.set(1, 2);

        // --- Material ---
        const material = new THREE.MeshStandardMaterial({
            color: this.color,
            side: THREE.DoubleSide,
            map:this.texture
        });

        // --- Skinned Mesh ---
        const skinnedMesh = new THREE.SkinnedMesh(geometry, material);
        const skeleton = new THREE.Skeleton(bones);

        skinnedMesh.add(bones[0]);
        skinnedMesh.bind(skeleton);

        this.generator = new StaticGeometryGenerator( [ skinnedMesh ] );
        this.newgeometry = this.generator.generate();
        this.newgeometry.computeBoundsTree();

        //proxy mesh only used to calculate bvh bounds
        this.mesh = new THREE.Mesh(this.newgeometry, this.generator.getMaterials());
        this.add(this.mesh)
        this.mesh.visible = false;

        skinnedMesh.castShadow = true;
        skinnedMesh.receiveShadow = true;
        material.shadowSide = THREE.BackSide;
       
        return skinnedMesh;
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
        this.geometryFinBack = new THREE.BufferGeometry();
        this.geometryFinBack.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        this.geometryFinBack.setIndex(indices);
        this.geometryFinBack.computeVertexNormals();

        const material = new THREE.MeshStandardMaterial({ color: this.color, side: THREE.DoubleSide });

        const detailedMesh = new THREE.Mesh(this.geometryFinBack, material);
        detailedMesh.castShadow = true;
        
        this.geometryFinBack.computeBoundsTree();

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
        this.geometryFinTop = new THREE.BufferGeometry();
        this.geometryFinTop.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        this.geometryFinTop.setIndex(indices);
        this.geometryFinTop.computeVertexNormals();

        const material = new THREE.MeshStandardMaterial({ color: this.color, side: THREE.DoubleSide });

        const detailedMesh = new THREE.Mesh(this.geometryFinTop, material);
        detailedMesh.castShadow = true;

        this.geometryFinTop.computeBoundsTree();

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
        this.geometryBottomFin = new THREE.BufferGeometry();
        this.geometryBottomFin .setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        this.geometryBottomFin .setIndex(indices);
        this.geometryBottomFin .computeVertexNormals();

        const material = new THREE.MeshStandardMaterial({ color: this.color, side: THREE.DoubleSide });

        const detailedMesh = new THREE.Mesh(this.geometryBottomFin , material);

        this.geometryBottomFin.computeBoundsTree();

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
        this.lod = new THREE.LOD();
        
        // 1. Detailed Mesh (Level 0) - Distance 0
        this.fish = this.createFishBody();
        const fishBackFin = this.createFishFinBack();
        const fishTopFin = this.createTopFin();
        const fishBottomFin = this.createBottomFin();
        this.detailedWrapper = new THREE.Object3D();
        this.detailedWrapper.add(this.fish);

        //attach the fins to a bone in the body
        const midFinsBone = this.fish.skeleton.bones[2];
        const backFinBone = this.fish.skeleton.bones[3];
        midFinsBone.add(fishTopFin);
        midFinsBone.add(fishBottomFin);
        backFinBone.add(fishBackFin);
        fishTopFin.position.set(-this.lengthBody / 4 * 1.2,this.lengthFin / 4 + this.widthBody / 2,0);
        fishBottomFin.position.set(-this.lengthBody / 4 * 1.2,-this.lengthFin / 8 - this.widthBody / 2,0);

        this.lod.addLevel(this.detailedWrapper, 0);

        // 2. Medium-Detail Mesh (Level 1)
        this.fishMedium = this.createFishBody();
        const fishBackFinMedium = this.createFishFinBack();
        const mediumWrapper = new THREE.Object3D();
        mediumWrapper.add(this.fishMedium);
        //mediumWrapper.add(fishBackFinMedium);

        //attach the back fin to a bone in the body
        const backFinBoneMedium = this.fishMedium.skeleton.bones[3];
        backFinBoneMedium.add(fishBackFinMedium);

   
        this.lod.addLevel(mediumWrapper, this.lodMediumThreshold);

        //3. Low-Detail Mesh (Level 2)
        const fishLow = this.createLowDetailFish();
        const lowWrapper = new THREE.Object3D();
        lowWrapper.add(fishLow);
        this.lod.addLevel(lowWrapper, this.lodBasicThreshold);
    
        this.position.y = this.widthBody / 2;

        this.helper = new MeshBVHHelper(this.mesh)
        this.helper.visible = false;
        this.add(this.helper);

        this.add(this.lod);

    }

    update(delta){
        // Accumulate elapsed time
        if (!this.elapsed) this.elapsed = 0;
        this.elapsed += delta;

        const bones = this.fish.skeleton.bones;
        const waveSpeed = 2;   
        const waveAmplitude = 0.3; 

        const bonesMedium = this.fishMedium.skeleton.bones;
        
        bones.forEach((bone, i) => {
            // Head stays stable, tail moves more
            
            const influence = i / bones.length;
            const rotation = Math.sin(this.elapsed * waveSpeed + (bones.length - i)) * waveAmplitude * influence;
            bone.rotation.y = rotation;
        });
        bonesMedium.forEach((bone, i) => {
            // Head stays stable, tail moves more
            
            const influence = i / bones.length;
            const rotation = Math.sin(this.elapsed * waveSpeed + (bones.length - i)) * waveAmplitude * influence;
            bone.rotation.y = rotation;
        });

        //update the bvh. Avoid updates every frame to improve performance
        if(this.generator && (this.elapsed % 4 == 0) && this.bvh){
            this.generator.generate(this.newgeometry);
            this.newgeometry.boundsTree.refit();
            this.helper.update()
            this.geometryBottomFin.boundsTree.refit();
            this.geometryFinBack.boundsTree.refit();
            this.geometryFinTop.boundsTree.refit();
        }
    }
}

export { MySwordFish };
