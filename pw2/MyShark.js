import * as THREE from 'three';

class MyShark extends THREE.Object3D {
    /**
     * 
     * @param {string} color Body color
     */
    constructor(scale = 1,color = "#2244aa") {
        super();

        const tailWidth = 0.1;
        const bodyWidth = 0.6;
        const headWidth = 0.4;

        const rootBone = new THREE.Bone();
        const bodyBone1 = new THREE.Bone(); //body part near the tail
        const bodyBone2 = new THREE.Bone(); //body part in the middle
        const bodyBone3 = new THREE.Bone(); //body part near the head
        const headBone = new THREE.Bone();
        const tailBone = new THREE.Bone();
        const finsBone1 = new THREE.Bone(); //back fins
        const finsBone2 = new THREE.Bone(); // pair of fins on the middle
        const finsBone3 = new THREE.Bone(); // pair of fins on the front and top fin

        this.rootBone = rootBone;
        this.bodyBone1 = bodyBone1;
        this.bodyBone2 = bodyBone2;
        this.bodyBone3 = bodyBone3;
        this.headBone = headBone;
        this.tailBone = tailBone;
        this.finsBone1 = finsBone1; 
        this.finsBone2 = finsBone2; 
        this.finsBone3 = finsBone3; 



        rootBone.add(bodyBone1);
        bodyBone1.add(bodyBone2);
        bodyBone2.add(bodyBone3);
        bodyBone3.add(headBone);
        bodyBone1.add(tailBone); 

        bodyBone1.add(finsBone1);
        bodyBone2.add(finsBone2);
        bodyBone3.add(finsBone3);


        const skeleton = new THREE.Skeleton([rootBone, bodyBone1, bodyBone2, bodyBone3,
            headBone, tailBone, finsBone1, finsBone2, finsBone3]);


        /*
        const vertices = new Float32Array([
        0.38, 2.44, 0,  // 0
        0.98, 2.51, 0,  // 1
        2.37, 3.07, 0,  // 2
        1.78, 3.40, 0,  // 3
        1.39, 3.82, 0,  // 4
        1.66, 3.82, 0,  // 5
        2.37, 3.40, 0,  // 6
        3.05, 3.40, 0,  // 7
        3.23, 2.88, 0,  // 8
        2.63, 3.02, 0,  // 9
        2.47, 2.73, 0,  // 10
        2.68, 3.40, 0,  // 11
        2.47, 3.50, 0,  // 12
        2.67, 3.50, 0,  // 13
        2.58, 3.71, 0,  // 14
        0, 0, 0,  // 15 - mistake, it was a repeated vertex
        3.48, 3.50, 0,  // 16
        4.37, 2.69, 0,  // 17
        4.07, 3.64, 0,  // 18
        3.60, 4.00, 0,  // 19
        0, 0, 0,  // 20 - mistake, it was a repeated vertex
        5.48, 3.55, 0,  // 21 
        5.22, 3.82, 0,  // 22
        5.30, 2.60, 0,  // 23
        4.08, 2.74, 0,  // 24
        4.44, 2.55, 0,  // 25
        4.40, 2.44, 0,  // 26
        4.18, 1.69, 0,  // 27
        4.67, 1.89, 0,  // 28
        6.43, 2.77, 0,  // 29
        6.30, 3.33, 0,  // 30
        6.01, 3.71, 0,  // 31
        5.42, 4.23, 0,  // 32
        5.16, 4.69, 0,  // 33
        5.52, 4.47, 0,  // 34
        6.61, 3.65, 0,  // 35 
        6.77, 3.41, 0,  // 36 
        7.10, 3.24, 0,  // 37 
        7.20, 3.00, 0,  // 38 
        7.58, 3.21, 0,  // 39 
        7.17, 3.42, 0,  // 40 
        7.05, 3.53, 0,  // 41 

        //teeth
        6.8, 3.48, 0,  // 42 - tooth 1
        6.92, 3.42, 0,  // 43 - tooth 1
        6.92, 3.49, 0,  // 44 - tooth 1
        6.96, 3.52, 0,  // 45 - tooth 2
        7.02, 3.45, 0,  // 46 - tooth 2
        7.02, 3.53, 0,  // 47 - tooth 2
        6.92, 3.40, 0,  // 48 - tooth 3
        6.96, 3.47, 0,  // 49 - tooth 3
        7.01, 3.40, 0,  // 50 - tooth 3
        7.05, 3.40, 0,  // 51 - tooth 4
        7.08, 3.49, 0,  // 52 - tooth 4
        7.13, 3.40, 0,  // 53 - tooth 4
        ]);
        */

        const tailVertices = new Float32Array([
            //front face
            0.38, 2.44, tailWidth/2,  // 0
            2.37, 3.07, tailWidth/2,  // 1   
            1.78, 3.40, tailWidth/2,  // 2   body 
            1.39, 3.82, tailWidth/2,  // 3
            2.37, 3.40, tailWidth/2,  // 4   
            
            //back face
            0.38, 2.44, -tailWidth/2,  // 5
            2.37, 3.07, -tailWidth/2,  // 6  
            1.78, 3.40, -tailWidth/2,  // 7  body
            1.39, 3.82, -tailWidth/2,  // 8
            2.37, 3.40, -tailWidth/2,  // 9  
        ]);

        const tailIndices = [
            //front face
            0,1,2,
            2,4,3,

            //back face
            5,6,7,
            7,9,8,

            //side faces
            0,1,5,
            5,1,6,

            0,5,2,
            5,7,2,

            2,7,3,
            8,3,7,

            3,4,8,
            9,8,4,
        ];

        const bodyVertices = new Float32Array([
            // front face
            1.78, 3.40, tailWidth/2,  // 0  tail
            2.37, 3.07, tailWidth/2,  // 1 tail
            2.37, 3.40, tailWidth/2,  // 2 tail
            2.4, 3.2, bodyWidth/2,  // 3
            2.63, 3.02, 0,  // 4 lowerTopFin
            2.65, 3.2, bodyWidth/2, // 5
            2.68, 3.40, 0,  // 6 lowerBottomFin
            3.05, 3.40, 0,  // 7 lowerBottomFin
            3.13, 3.2, bodyWidth/2,  // 8
            3.23, 2.88, 0,  // 9 lowerTopFin
            3.37, 3.22, bodyWidth/2,  // 10
            3.48, 3.50, 0,  // 11 midBottomFin
            3.75, 3.25, bodyWidth/2,  // 12
            4.07, 3.64, 0,  // 13 midBottomFin
            4.18, 3.28, bodyWidth/2,  // 14
            4.08, 2.74, 0,  // 15 upperTopFin
            5.22, 3.82, 0,  // 16 upperBottomFin
            5.45, 3.30, bodyWidth/2,  // 17
            5.30, 2.60, 0,  // 18 upperTopFin
            6.43, 2.77, 0,  // 19 head
            6.01, 3.71, 0,  // 20 head and upperBottomFin
            6.30, 3.33, bodyWidth/2,  // 21 head    
            5.74, 3.34, bodyWidth/2,  // 22 
            
            // back faces
            1.78, 3.40, -tailWidth/2,  // 23 0  tail
            2.37, 3.07, -tailWidth/2,  // 24 1 tail
            2.37, 3.40, -tailWidth/2,  // 25 2 tail
            2.4, 3.2, -bodyWidth/2,  // 26 3
            2.63, 3.02, 0,  // 27 4 lowerTopFin
            2.65, 3.2, -bodyWidth/2, // 28 5
            2.68, 3.40, 0,  // 29 6 lowerBottomFin
            3.05, 3.40, 0,  // 30 7 lowerBottomFin
            3.13, 3.2, -bodyWidth/2,  // 31 8
            3.23, 2.88, 0,  // 32 9 lowerTopFin
            3.37, 3.22, -bodyWidth/2,  // 33 10
            3.48, 3.50, 0,  // 34 11 midBottomFin
            3.75, 3.25, -bodyWidth/2,  // 35 12
            4.07, 3.64, 0,  // 36 13 midBottomFin
            4.18, 3.28, -bodyWidth/2,  // 37 14
            4.08, 2.74, 0,  // 38 15 upperTopFin
            5.22, 3.82, 0,  // 39 16 upperBottomFin
            5.45, 3.30, -bodyWidth/2,  // 40 17
            5.30, 2.60, 0,  // 41 18 upperTopFin
            6.43, 2.77, 0,  // 42 19 head
            6.01, 3.71, 0,  // 43 20 head and upperBottomFin
            6.30, 3.33, -bodyWidth/2,  // 44 21 head
            5.74, 3.34, -bodyWidth/2,  // 45 22
        ]);

        const bodyIndices = [
            // mid plane
            0,3,23,
            23,3,26,

            3,5,26,
            26,5,28,

            5,10,28,
            28,10,33,

            10,14,33,
            33,14,37,

            14,17,37,
            37,17,40,

            17,22,40,
            40,22,45,

            22,21,45,
            45,21,44,

            // front face

            0,3,2,
            23,26,25,

            0,1,3,
            23,24,26,

            3,1,5,
            26,24,28,

            1,4,5,
            24,27,28,

            2,3,6,
            25,26,29,

            3,5,6,
            26,28,29,

            5,7,6,
            28,30,29,

            5,8,7,
            28,31,30,

            4,10,5,
            27,33,28,

            4,9,10,
            27,32,33,

            7,8,11,
            30,31,34,

            8,10,11,
            31,33,34,

            11,10,12,
            34,33,35,

            11,12,13,
            34,35,36,

            9,14,10,
            32,37,33,

            9,15,14,
            32,38,37,

            14,15,17,
            37,38,40,

            15,18,17,
            38,41,40,

            18,19,17,
            41,42,40,

            17,19,22,
            40,42,45,

            22,19,21,
            45,42,44,

            12,14,13,
            35,37,36,

            13,14,16,
            36,37,39,

            14,17,16,
            37,40,39,

            16,22,20,
            39,45,43,

            22,21,20,
            45,44,43,

            16,17,22,
            39,40,45,
        ];

        const headVertices = new Float32Array([
            6.43, 2.77, 0,  // 0 body
            6.30, 3.33, bodyWidth/2,  // 1 body   
            7.10, 3.24, headWidth/2,  // 2
            7.20, 3.00, headWidth/2,  // 3
            7.58, 3.21, headWidth/2,  // 4
            7.17, 3.42, headWidth/2,  // 5
            6.01, 3.71, 0,  // 6 body and upperBottomFin
            7.05, 3.53, headWidth/2,  // 7
            

            6.43, 2.77, -0,  // 8 body
            6.30, 3.33, -bodyWidth/2,  // 9 body  
            7.10, 3.24, -headWidth/2,  // 10   
            7.20, 3.00, -headWidth/2,  // 11
            7.58, 3.21, -headWidth/2,  // 12
            7.17, 3.42, -headWidth/2,  // 13
            6.01, 3.71, -0,  // 14 body and upperBottomFin
            7.05, 3.53, -headWidth/2,  // 15

        ]);

        const headIndices = [
            // upper jaw 

            //front
            1,0,2,
            0,3,2,
            2,3,4,
            1,2,5,
            2,4,5,
            //back
            9,8,10,
            8,11,10,
            10,11,12,
            9,10,13,
            10,12,13,
            //sides
            0,3,11,

            3,4,11,
            4,12,11,

            4,5,12,
            5,13,12,

            1,5,9,
            5,13,9,
            
            // lower jaw
            //front
            1,7,6,
            //back
            9,15,14,
            //sides
            1,7,9,
            7,15,9,

            6,15,7,

        ];
        

        const teethVertices = new Float32Array([
            6.85, 3.44, 0,  // 0 - tooth 1
            6.92, 3.42, 0,  // 1 - tooth 1
            6.92, 3.47, 0,  // 2 - tooth 1
            6.96, 3.49, 0,  // 3 - tooth 2
            7.02, 3.45, 0,  // 4 - tooth 2
            7.02, 3.52, 0,  // 5 - tooth 2
            6.92, 3.415, 0,  // 6 - tooth 3
            6.96, 3.47, 0,  // 7 - tooth 3
            7.01, 3.415, 0,  // 8 - tooth 3
            7.05, 3.42, 0,  // 9 - tooth 4
            7.08, 3.49, 0,  // 10 - tooth 4
            7.13, 3.42, 0,  // 11 - tooth 4
        ]);

        const teethIndices = [
            0, 1, 2,
            3, 4, 5,
            6, 7, 8,
            9, 10, 11,
        ];

        const lowerTopfinVertices = new Float32Array([
            3.23, 2.90, 0.05,  // 0 
            2.63, 3.04, 0.05,  // 1 
            2.47, 2.75, 0,  // 2          
 
            3.23, 2.90, -0.05,  // 3
            2.63, 3.04, -0.05,  // 4
            2.47, 2.75, 0,  // 5   duplicate
        ]);
        const lowerTopfinIndices = [
            2,0,1,
            2,4,3,

            2,1,4,
            2,3,0,
        ];

        const lowerBottomfinVertices = new Float32Array([
            3.05, 3.40, 0.05,  // 0
            2.68, 3.40, 0.05,  // 1

            2.58, 3.71, 0,  // 2

            3.05, 3.40, -0.05,  // 3
            2.68, 3.40, -0.05,  // 4
        ]);
        const lowerBottomfinIndices = [
            0,1,2,
            2,3,4,
            0,3,2,
            1,4,2,
        ];

        const midBottomfinVertices = new Float32Array([
            3.48, 3.38, 0.1,  // 0  
            4.07, 3.52, 0.1,  // 1

            3.60, 4.00, 0,  // 2

            3.48, 3.38, -0.1,  // 3
            4.07, 3.52, -0.1,  // 4


        ]);
        const midBottomfinIndices = [
            0,1,2,
            2,3,4,
            0,3,2,
            1,4,2,
            
        ];

        const upperTopfinVertices = new Float32Array([
        4.08, 2.84, 0.05,  // 0
        5.30, 2.70, 0.05,  // 1

        4.40, 2.54, 0,  // 2
        4.18, 1.79, 0,  // 3

        4.08, 2.84, -0.05,  // 4
        5.30, 2.70, -0.05,  // 5

        4.08, 2.84, 0,  // 6
        5.30, 2.70, 0,  // 7

        ]);
        const upperTopfinIndices = [
            0,2,1,
            2,3,1,

            4,2,5,
            2,3,5,

            0,2,6,
            4,6,2,

            1,7,3,
            5,3,7,
        ];

        const upperBottomfinVertices = new Float32Array([
            5.22, 3.72, 0.05,  // 0
            6.01, 3.61, 0.05,  // 1

            5.16, 4.59, 0,  // 2

            5.22, 3.72, -0.05,  // 3
            6.01, 3.61, -0.05,  // 4
        ]);
        const upperBottomfinIndices = [   
            0,1,2,
            2,3,4,
            
            0,3,2,
            1,4,2,

        ];
        
        const tailPart = createPart(tailVertices, tailIndices, color);
        const tail = new THREE.SkinnedMesh(tailPart.geometry, tailPart.material);

        const bodyPart = createPart(bodyVertices, bodyIndices, color);
        const body = new THREE.SkinnedMesh(bodyPart.geometry, bodyPart.material);
        
        const headPart = createPart(headVertices, headIndices, color);
        const head = new THREE.SkinnedMesh(headPart.geometry, headPart.material);

        const lowerTopFinPart =  createPart(lowerTopfinVertices, lowerTopfinIndices, color);
        const lowerTopFin = new THREE.SkinnedMesh(lowerTopFinPart.geometry, lowerTopFinPart.material);

        const lowerBottomFinPart = createPart(lowerBottomfinVertices, lowerBottomfinIndices, color);
        const lowerBottomFin = new THREE.SkinnedMesh(lowerBottomFinPart.geometry, lowerBottomFinPart.material);

        const midBottomFinPart = createPart(midBottomfinVertices, midBottomfinIndices, color);
        const midBottomFin = new THREE.SkinnedMesh(midBottomFinPart.geometry, midBottomFinPart.material);
        
        const upperTopFinPart = createPart(upperTopfinVertices, upperTopfinIndices, color);
        const upperTopFin = new THREE.SkinnedMesh(upperTopFinPart.geometry, upperTopFinPart.material);

        const upperBottomFinPart = createPart(upperBottomfinVertices, upperBottomfinIndices, color);
        const upperBottomFin = new THREE.SkinnedMesh(upperBottomFinPart.geometry, upperBottomFinPart.material);

        const teethPart = createPart(teethVertices, teethIndices, "#ffffff");
        const teeth = new THREE.Mesh(teethPart.geometry, teethPart.material);

// --- Create and position mirrored fins ---
centerGeometry(midBottomFin);
const midBottomFinRight = cloneSkinnedMesh(midBottomFin, skeleton, [7, 0, 0, 0], [1, 0, 0, 0]); // finsBone2
const midBottomFinLeft = cloneSkinnedMesh(midBottomFin, skeleton, [7, 0, 0, 0], [1, 0, 0, 0]);  // finsBone2
midBottomFinRight.position.set(3.6, 3.47, 0.2);
midBottomFinLeft.position.set(3.6, 3.5, -0.2);
midBottomFinRight.rotation.set(Math.PI / 12, 0, -Math.PI / 12);
midBottomFinLeft.rotation.set(-Math.PI / 12, 0, -Math.PI / 12);

centerGeometry(upperBottomFin);
const upperBottomFinRight = cloneSkinnedMesh(upperBottomFin, skeleton, [8, 0, 0, 0], [1, 0, 0, 0]); // finsBone3
const upperBottomFinLeft = cloneSkinnedMesh(upperBottomFin, skeleton, [8, 0, 0, 0], [1, 0, 0, 0]);  // finsBone3
upperBottomFinLeft.position.set(5.3, 3.9, 0.2);
upperBottomFinRight.position.set(5.3, 4, -0.2);
upperBottomFinLeft.rotation.set(Math.PI / 12, 0, 0);
upperBottomFinRight.rotation.set(-Math.PI / 12, 0, 0);


// --- Assign manual skinning to each mesh ---

// Tail (mostly tailBone = 5, a bit bodyBone1 = 1)
const tailSkinIndices = [], tailSkinWeights = [];
for (let i = 0; i < tail.geometry.attributes.position.count; i++) {
    tailSkinIndices.push(5, 1, 0, 0);
    tailSkinWeights.push(0.8, 0.2, 0, 0);
}
skinMesh(tail, skeleton, tailSkinIndices, tailSkinWeights);

// Body (smooth blend along bodyBone1–3)
const bodySkinIndices = [], bodySkinWeights = [];
const pos = body.geometry.attributes.position;
body.geometry.computeBoundingBox();
const minX = body.geometry.boundingBox.min.x;
const maxX = body.geometry.boundingBox.max.x;
for (let i = 0; i < pos.count; i++) {
    const vertex = new THREE.Vector3().fromBufferAttribute(pos, i);
    const t = (vertex.x - minX) / (maxX - minX);
    let b0, b1, w0, w1;

    if (t < 0.5) { // blend bodyBone1–bodyBone2
        b0 = 1; b1 = 2;
        w1 = t * 2;
    } else { // blend bodyBone2–bodyBone3
        b0 = 2; b1 = 3;
        w1 = (t - 0.5) * 2;
    }
    w0 = 1 - w1;
    bodySkinIndices.push(b0, b1, 0, 0);
    bodySkinWeights.push(w0, w1, 0, 0);
}
skinMesh(body, skeleton, bodySkinIndices, bodySkinWeights);

// Head (mostly headBone = 4, some bodyBone3 = 3)
const headSkinIndices = [], headSkinWeights = [];
for (let i = 0; i < head.geometry.attributes.position.count; i++) {
    headSkinIndices.push(4, 3, 0, 0);
    headSkinWeights.push(0.9, 0.1, 0, 0);
}
skinMesh(head, skeleton, headSkinIndices, headSkinWeights);

// Fins (each attached to its corresponding bone)
function makeFullWeight(mesh, boneIndex) {
    const indices = [], weights = [];
    for (let i = 0; i < mesh.geometry.attributes.position.count; i++) {
        indices.push(boneIndex, 0, 0, 0);
        weights.push(1, 0, 0, 0);
    }
    skinMesh(mesh, skeleton, indices, weights);
}

makeFullWeight(lowerTopFin, 6);     // finsBone1
makeFullWeight(lowerBottomFin, 6);  // finsBone1
makeFullWeight(midBottomFinRight, 7);
makeFullWeight(midBottomFinLeft, 7);
makeFullWeight(upperTopFin, 8);
makeFullWeight(upperBottomFinRight, 8);
makeFullWeight(upperBottomFinLeft, 8);


// --- Skeleton and scene hierarchy ---

body.add(rootBone);
body.bind(skeleton);

this.rootPivot = new THREE.Object3D();
this.rootPivot.add(body);

this.add(this.rootPivot);
this.rootPivot.rotation.x = Math.PI;

finsBone1.add(lowerTopFin);
finsBone1.add(lowerBottomFin);
finsBone2.add(midBottomFinLeft);
finsBone2.add(midBottomFinRight);
finsBone3.add(upperTopFin);
finsBone3.add(upperBottomFinLeft);
finsBone3.add(upperBottomFinRight);

headBone.add(head);
tailBone.add(tail);
head.add(teeth);

body.scale.set(scale, scale, scale);

        function createPart(vertices, indices, color = "#2244aa") {
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
            geometry.setIndex(indices);
            geometry.computeVertexNormals();

            const material = new THREE.MeshStandardMaterial({
                color,
                side: THREE.DoubleSide,
                flatShading: false,
            });
 
            return new THREE.Mesh(geometry, material);
        }

        function skinMesh(mesh, skeleton, skinIndices, skinWeights) {
            if (!skinIndices || !skinWeights) {
                console.warn("skinMesh(): missing indices or weights");
                return;
            }

            mesh.geometry.setAttribute(
                'skinIndex',
                new THREE.Uint16BufferAttribute(skinIndices, 4)
            );
            mesh.geometry.setAttribute(
                'skinWeight',
                new THREE.Float32BufferAttribute(skinWeights, 4)
            );

            mesh.bind(skeleton);
        }


        function cloneSkinnedMesh(originalMesh, skeleton, skinIndices, skinWeights) {
            const geometry = originalMesh.geometry.clone();
            const material = originalMesh.material.clone();
            const clone = new THREE.SkinnedMesh(geometry, material);
            skinMesh(clone, skeleton, skinIndices, skinWeights);
            return clone;
        }

        function centerGeometry(mesh) {
            mesh.geometry.computeBoundingBox();
            const box = mesh.geometry.boundingBox;
            const center = new THREE.Vector3();
            box.getCenter(center);
            mesh.geometry.translate(-center.x, -center.y, -center.z);
        }
    }

    update(delta) {
        if (!this.elapsed) this.elapsed = 0;
        this.elapsed += delta;

        const bones = [
            this.tailBone,
            this.bodyBone1,
            this.bodyBone2,
            this.bodyBone3,
            this.headBone
        ];

        const waveSpeed = 1;      // controls speed of the wave
        const waveAmplitude = 0.1; // maximum rotation in radians

        bones.forEach((bone, i) => {
            // influence goes from 0 (bodyBone1) to 1 (tailBone)
            const influence = i / (bones.length - 1);

            // sine wave along the spine
            const rotation = Math.sin(this.elapsed * waveSpeed + (1 - influence) * Math.PI) * waveAmplitude * influence;

            bone.rotation.y = rotation;
        });

        // Optional: slightly offset the head counter-sway
        this.headBone.rotation.y *= 0.4; 
    }
}

export { MyShark };
