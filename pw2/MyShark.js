import * as THREE from 'three';

class MyShark extends THREE.Object3D {
    /**
     * 
     * @param {string} color Body color
     */
    constructor(scale = 1, color = "#2244aa") {
        super();

        const tailWidth = 0.1;
        const bodyWidth = 0.6;
        const headWidth = 0.4;

        const rootBone = new THREE.Bone();
        const bodyBone1 = new THREE.Bone();
        const bodyBone2 = new THREE.Bone();
        const bodyBone3 = new THREE.Bone();
        const headBone = new THREE.Bone();
        const tailBone = new THREE.Bone();
        const finsBone1 = new THREE.Bone();
        const finsBone2 = new THREE.Bone();
        const finsBone3 = new THREE.Bone();

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

        const mergedGeometry = this.createMergedBodyGeometry(tailWidth, bodyWidth, headWidth);
        
        const material = new THREE.MeshStandardMaterial({
            color,
            side: THREE.DoubleSide,
            flatShading: false,
        });

        const sharkBody = new THREE.SkinnedMesh(mergedGeometry, material);
        
        this.applyMergedSkinning(sharkBody, skeleton);
        
        sharkBody.add(rootBone);
        sharkBody.bind(skeleton);

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
        const teeth = this.createFinMesh(teethVertices, teethIndices, "#ffffff");

        this.rootPivot = new THREE.Object3D();
        this.rootPivot.add(sharkBody);
        this.add(this.rootPivot);
        this.rootPivot.rotation.x = Math.PI;

        headBone.add(teeth);

        sharkBody.scale.set(scale, scale, scale);

        this.sharkBody = sharkBody;
    }

    createMergedBodyGeometry(tailWidth, bodyWidth, headWidth) {
        const allVertices = [];
        const allIndices = [];
        
        const tailVertices = [
            //front face
            0.38, 2.44, tailWidth/2,  // 0
            2.37, 3.07, tailWidth/2,  // 1   
            1.78, 3.40, tailWidth/2,  // 2
            1.39, 3.82, tailWidth/2,  // 3
            2.37, 3.40, tailWidth/2,  // 4   
            
            //back face
            0.38, 2.44, -tailWidth/2,  // 5
            2.37, 3.07, -tailWidth/2,  // 6  
            1.78, 3.40, -tailWidth/2,  // 7
            1.39, 3.82, -tailWidth/2,  // 8
            2.37, 3.40, -tailWidth/2,  // 9  
        ];

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

        const bodyVertices = [
            // front face
            1.78, 3.40, tailWidth/2,  // 0  tail
            2.37, 3.07, tailWidth/2,  // 1 tail
            2.37, 3.40, tailWidth/2,  // 2 tail
            2.4, 3.2, bodyWidth/2,  // 3
            2.63, 3.02, 0,  // 4
            2.65, 3.2, bodyWidth/2, // 5
            2.68, 3.40, 0,  // 6
            3.05, 3.40, 0,  // 7
            3.13, 3.2, bodyWidth/2,  // 8
            3.23, 2.88, 0,  // 9
            3.37, 3.22, bodyWidth/2,  // 10
            3.48, 3.50, 0,  // 11
            3.75, 3.25, bodyWidth/2,  // 12
            4.07, 3.64, 0,  // 13
            4.18, 3.28, bodyWidth/2,  // 14
            4.08, 2.74, 0,  // 15
            5.22, 3.82, 0,  // 16
            5.45, 3.30, bodyWidth/2,  // 17
            5.30, 2.60, 0,  // 18
            6.43, 2.77, 0,  // 19
            6.01, 3.71, 0,  // 20
            6.30, 3.33, bodyWidth/2,  // 21
            5.74, 3.34, bodyWidth/2,  // 22 
            
            // back faces
            1.78, 3.40, -tailWidth/2,  // 23
            2.37, 3.07, -tailWidth/2,  // 24
            2.37, 3.40, -tailWidth/2,  // 25
            2.4, 3.2, -bodyWidth/2,  // 26
            2.63, 3.02, 0,  // 27
            2.65, 3.2, -bodyWidth/2, // 28
            2.68, 3.40, 0,  // 29
            3.05, 3.40, 0,  // 30
            3.13, 3.2, -bodyWidth/2,  // 31
            3.23, 2.88, 0,  // 32
            3.37, 3.22, -bodyWidth/2,  // 33
            3.48, 3.50, 0,  // 34
            3.75, 3.25, -bodyWidth/2,  // 35
            4.07, 3.64, 0,  // 36
            4.18, 3.28, -bodyWidth/2,  // 37
            4.08, 2.74, 0,  // 38
            5.22, 3.82, 0,  // 39
            5.45, 3.30, -bodyWidth/2,  // 40
            5.30, 2.60, 0,  // 41
            6.43, 2.77, 0,  // 42
            6.01, 3.71, 0,  // 43
            6.30, 3.33, -bodyWidth/2,  // 44
            5.74, 3.34, -bodyWidth/2,  // 45
        ];

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

        const headVertices = [
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
        ];

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

        // BASE FIN GEOMETRIES (centered at origin)
        const lowerTopfinBaseVertices = [
            3.23, 2.90, 0.05,  // 0 
            2.63, 3.04, 0.05,  // 1 
            2.47, 2.75, 0,     // 2          
            3.23, 2.90, -0.05, // 3
            2.63, 3.04, -0.05, // 4
            2.47, 2.75, 0,     // 5
        ];

        const lowerBottomfinBaseVertices = [
            3.05, 3.40, 0.05,  // 0
            2.68, 3.40, 0.05,  // 1
            2.58, 3.71, 0,     // 2
            3.05, 3.40, -0.05, // 3
            2.68, 3.40, -0.05, // 4
        ];

        const midBottomfinBaseVertices = [
            3.48, 3.38, 0.1,   // 0  
            4.07, 3.52, 0.1,   // 1
            3.60, 4.00, 0,     // 2
            3.48, 3.38, -0.1,  // 3
            4.07, 3.52, -0.1,  // 4
        ];

        const upperTopfinBaseVertices = [
            4.08, 2.8, 0.05,  // 0
            5.30, 2.66, 0.05,  // 1
            4.40, 2.50, 0,     // 2
            4.18, 1.75, 0,     // 3
            4.08, 2.80, -0.05, // 4
            5.30, 2.66, -0.05, // 5
            4.08, 2.8, 0,     // 6
            5.30, 2.66, 0,     // 7
        ];

        const upperBottomfinBaseVertices = [
            5.22, 3.72, 0.05,  // 0
            6.01, 3.61, 0.05,  // 1
            5.16, 5, 0,     // 2
            5.22, 3.72, -0.05, // 3
            6.01, 3.61, -0.05, // 4
        ];

        // First, center all base geometries
        const centerGeometry = (vertices) => {
            // Calculate center
            let minX = Infinity, maxX = -Infinity;
            let minY = Infinity, maxY = -Infinity;
            let minZ = Infinity, maxZ = -Infinity;
            
            for (let i = 0; i < vertices.length; i += 3) {
                minX = Math.min(minX, vertices[i]);
                maxX = Math.max(maxX, vertices[i]);
                minY = Math.min(minY, vertices[i + 1]);
                maxY = Math.max(maxY, vertices[i + 1]);
                minZ = Math.min(minZ, vertices[i + 2]);
                maxZ = Math.max(maxZ, vertices[i + 2]);
            }
            
            const centerX = (minX + maxX) / 2;
            const centerY = (minY + maxY) / 2;
            const centerZ = (minZ + maxZ) / 2;
            
            // Translate to center
            const centered = [];
            for (let i = 0; i < vertices.length; i += 3) {
                centered.push(
                    vertices[i] - centerX,
                    vertices[i + 1] - centerY,
                    vertices[i + 2] - centerZ
                );
            }
            return centered;
        };

        // create fin pairs
        const midBottomfinCentered = centerGeometry(midBottomfinBaseVertices);
        const upperBottomfinCentered = centerGeometry(upperBottomfinBaseVertices);

        const transformVertices = (vertices, position, rotation) => {
            const transformed = [];
            const cosZ = Math.cos(rotation.z);
            const sinZ = Math.sin(rotation.z);
            const cosX = Math.cos(rotation.x);
            const sinX = Math.sin(rotation.x);
            
            for (let i = 0; i < vertices.length; i += 3) {
                let x = vertices[i];
                let y = vertices[i + 1];
                let z = vertices[i + 2];
                
                const xz = x * cosZ - y * sinZ;
                const yz = x * sinZ + y * cosZ;
                const zz = z;
                
                const xx = xz;
                const yx = yz * cosX - zz * sinX;
                const zx = yz * sinX + zz * cosX;
                
                transformed.push(
                    xx + position.x,
                    yx + position.y,
                    zx + position.z
                );
            }
            return transformed;
        };

        const midBottomFinRight = transformVertices(midBottomfinCentered, 
            { x: 3.6, y: 3.47, z: 0.2 }, 
            { x: Math.PI/8, y: 0, z: -Math.PI/24 }
        );

        const midBottomFinLeft = transformVertices(midBottomfinCentered,
            { x: 3.6, y: 3.5, z: -0.2 },
            { x: -Math.PI/8, y: 0, z: -Math.PI/24 }
        );

        const upperBottomFinRight = transformVertices(upperBottomfinCentered,
            { x: 5.3, y: 3.7, z: -0.5 },
            { x: -Math.PI/4, y: 0, z: 0 }
        );

        const upperBottomFinLeft = transformVertices(upperBottomfinCentered,
            { x: 5.3, y: 3.7, z: 0.5 },
            { x: Math.PI/4, y: 0, z: 0 }
        );

        const lowerTopfinIndices = [2,0,1, 2,4,3, 2,1,4, 2,3,0];
        const lowerBottomfinIndices = [0,1,2, 2,3,4, 0,3,2, 1,4,2];
        const midBottomfinIndices = [0,1,2, 2,3,4, 0,3,2, 1,4,2];
        const upperTopfinIndices = [0,2,1, 2,3,1, 4,2,5, 2,3,5, 0,2,6, 4,6,2, 1,7,3, 5,3,7];
        const upperBottomfinIndices = [0,1,2, 2,3,4, 0,3,2, 1,4,2];

        // combine all vertices
        allVertices.push(
            ...tailVertices, 
            ...bodyVertices, 
            ...headVertices, 
            ...lowerTopfinBaseVertices, 
            ...lowerBottomfinBaseVertices,
            ...midBottomFinRight,      
            ...midBottomFinLeft,       
            ...upperTopfinBaseVertices,
            ...upperBottomFinRight,    
            ...upperBottomFinLeft    
        );
        
        // calculate vertex counts (divided by 3 because of x,y,z)
        const tailVertexCount = tailVertices.length / 3;
        const bodyVertexCount = bodyVertices.length / 3;
        const headVertexCount = headVertices.length / 3;
        const lowerTopFinVertexCount = lowerTopfinBaseVertices.length / 3;
        const lowerBottomFinVertexCount = lowerBottomfinBaseVertices.length / 3;
        const midBottomFinVertexCount = midBottomFinRight.length / 3; 
        const upperTopFinVertexCount = upperTopfinBaseVertices.length / 3;
        const upperBottomFinVertexCount = upperBottomFinRight.length / 3; 
        
        // add indices with offsets
        allIndices.push(...tailIndices);
        
        const bodyOffset = tailVertexCount;
        allIndices.push(...bodyIndices.map(index => index + bodyOffset));
        
        const headOffset = tailVertexCount + bodyVertexCount;
        allIndices.push(...headIndices.map(index => index + headOffset));

        const lowerTopFinOffset = headOffset + headVertexCount;
        allIndices.push(...lowerTopfinIndices.map(index => index + lowerTopFinOffset));

        const lowerBottomFinOffset = lowerTopFinOffset + lowerTopFinVertexCount;
        allIndices.push(...lowerBottomfinIndices.map(index => index + lowerBottomFinOffset));

        // mid bottom fin right
        const midBottomFinOffset = lowerBottomFinOffset + lowerBottomFinVertexCount;
        allIndices.push(...midBottomfinIndices.map(index => index + midBottomFinOffset));

        // mid bottom fin left
        const midBottomFinLeftOffset = midBottomFinOffset + midBottomFinVertexCount;
        allIndices.push(...midBottomfinIndices.map(index => index + midBottomFinLeftOffset));

        const upperTopFinOffset = midBottomFinLeftOffset + midBottomFinVertexCount;
        allIndices.push(...upperTopfinIndices.map(index => index + upperTopFinOffset));

        // upper bottom fin right
        const upperBottomFinOffset = upperTopFinOffset + upperTopFinVertexCount;
        allIndices.push(...upperBottomfinIndices.map(index => index + upperBottomFinOffset));

        // upper bottom fin left
        const upperBottomFinLeftOffset = upperBottomFinOffset + upperBottomFinVertexCount;
        allIndices.push(...upperBottomfinIndices.map(index => index + upperBottomFinLeftOffset));

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(allVertices), 3));
        geometry.setIndex(allIndices);
        geometry.computeVertexNormals();

        return geometry;
    }

    applyMergedSkinning(mesh) {
        const skinIndices = [];
        const skinWeights = [];
        const geometry = mesh.geometry;
        const pos = geometry.attributes.position;
        
        // bone influences based on vertex X position (from tail to head)
        geometry.computeBoundingBox();
        const minX = geometry.boundingBox.min.x;
        const maxX = geometry.boundingBox.max.x;
        
        for (let i = 0; i < pos.count; i++) {
            const vertex = new THREE.Vector3().fromBufferAttribute(pos, i);
            const t = (vertex.x - minX) / (maxX - minX);
            
            // bone weights based on position along the body
            if (t < 0.2) {
                // tail - mostly tailBone (5) with some bodyBone1 (1)
                skinIndices.push(5, 1, 0, 0);
                skinWeights.push(0.8, 0.2, 0, 0);
            } else if (t < 0.4) {
                // rear body - bodyBone1 (1) with some bodyBone2 (2)
                skinIndices.push(1, 2, 5, 0);
                skinWeights.push(0.7, 0.2, 0.1, 0);
            } else if (t < 0.6) {
                // middle body - bodyBone2 (2) with some bodyBone1 (1) and bodyBone3 (3)
                skinIndices.push(2, 1, 3, 0);
                skinWeights.push(0.6, 0.2, 0.2, 0);
            } else if (t < 0.8) {
                // front body - bodyBone3 (3) with some bodyBone2 (2) and headBone (4)
                skinIndices.push(3, 2, 4, 0);
                skinWeights.push(0.6, 0.2, 0.2, 0);
            } else {
                // head - mostly headBone (4) with some bodyBone3 (3)
                skinIndices.push(4, 3, 0, 0);
                skinWeights.push(0.8, 0.2, 0, 0);
            }
        }

        geometry.setAttribute(
            'skinIndex',
            new THREE.Uint16BufferAttribute(skinIndices, 4)
        );
        geometry.setAttribute(
            'skinWeight',
            new THREE.Float32BufferAttribute(skinWeights, 4)
        );
    }

    createFinMesh(vertices, indices, color) {
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

        const waveSpeed = 1.5;
        const waveAmplitude = 0.2;

        bones.forEach((bone, i) => {
            const phaseOffset = i * 0.5;
            
            // influence values for less body movement
            const influences = [1.0, 0.6, 0.3, 0.15, 0.05]; // tail, body1, body2, body3, head
            
            const rotation = Math.sin(this.elapsed * waveSpeed + phaseOffset) * waveAmplitude * influences[i];
            bone.rotation.y = rotation;
        });

        this.headBone.rotation.y *= 0.2; 
    }
}


export { MyShark };
