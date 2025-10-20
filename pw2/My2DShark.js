import * as THREE from 'three';

class My2DShark extends THREE.Object3D {
    /**
     * 
     * @param {string} color Body color
     */
    constructor(depth = 1,color = "#2244aa") {
        super();

        const tailVertices = new Float32Array([
            0.38, 2.44, 0,  // 0
            0.98, 2.51, 0,  // 1
            2.37, 3.07, 0,  // 2
            1.78, 3.40, 0,  // 3
            1.39, 3.82, 0,  // 4
            1.66, 3.82, 0,  // 5
            2.37, 3.40, 0,  // 6
        ]);
        const tailIndices = [
            0, 1, 2,
            0, 2, 3,
            4, 3, 5,
            3, 6, 5,
        ];

        const bodyVertices = new Float32Array([
            2.37, 3.07, 0,  // 0
            1.78, 3.40, 0,  // 1
            3.05, 3.40, 0,  // 2
            3.23, 2.88, 0,  // 3
            3.48, 3.50, 0,  // 4
            4.37, 2.69, 0,  // 5
            4.07, 3.64, 0,  // 6
            5.48, 3.55, 0,  // 7
            5.22, 3.82, 0,  // 8
            5.30, 2.60, 0,  // 9
            6.43, 2.77, 0,  // 10
            6.30, 3.33, 0,  // 11
            6.01, 3.71, 0,  // 12
        ]);

        const bodyIndices = [
            // body 1   (1 is closer to tail, 4 is closer to head)
            0, 2, 1,
            0, 3, 2,
            3, 2, 4,

            // body 2
            3, 4, 5,
            4, 5, 6,

            // body 3
            6, 5, 7,
            6, 7, 8,
            5, 9, 7,

            // body 4
            9, 10, 7,
            7, 10, 11,
            7, 11, 12 
        ];

        const headVertices = new Float32Array([
            6.43, 2.77, 0,  // 0
            6.30, 3.33, 0,  // 1
            6.01, 3.71, 0,  // 2
            6.61, 3.65, 0,  // 3
            6.77, 3.41, 0,  // 4
            7.10, 3.24, 0,  // 5
            7.20, 3.00, 0,  // 6 
            7.58, 3.21, 0,  // 7
            7.17, 3.42, 0,  // 8
            7.05, 3.53, 0,  // 9 
        ]);
        const headIndices = [
            // upper jaw
            0, 4, 1,  
            0, 5, 4,
            0, 6, 5,
            5, 6, 7,
            4, 5, 8,
            5, 7, 8,

            // lower jaw
            1, 3, 2,  
            1, 4, 3,
            4, 9, 3,
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
            3.23, 2.88, 0,  // 0
            2.63, 3.02, 0,  // 1
            2.47, 2.73, 0,  // 2
        ]);
        const lowerTopfinIndices = [
            0,2,1
        ];

        const lowerBottomfinVertices = new Float32Array([
            3.05, 3.40, 0,  // 0
            2.68, 3.40, 0,  // 1
            2.47, 3.50, 0,  // 2
            2.67, 3.50, 0,  // 3
            2.58, 3.71, 0,  // 4
        ]);
        const lowerBottomfinIndices = [
            1, 2, 3,
            1, 3, 0,
            3, 4, 0,
        ];

        const midBottomfinVertices = new Float32Array([
            3.48, 3.50, 0,  // 0
            4.07, 3.64, 0,  // 1
            3.60, 4.00, 0,  // 2
        ]);
        const midBottomfinIndices = [0,1,2];

        const upperTopfinVertices = new Float32Array([
            5.30, 2.60, 0,  // 0
            4.08, 2.74, 0,  // 1
            4.44, 2.55, 0,  // 2
            4.40, 2.44, 0,  // 3
            4.18, 1.69, 0,  // 4
            4.67, 1.89, 0,  // 5
        ]);
        const upperTopfinIndices = [
            1, 2, 0,
            1, 3, 0,
            4, 0, 3,
            4, 5, 0,
        ];

        const upperBottomfinVertices = new Float32Array([
            5.48, 3.55, 0,  // 0 
            5.22, 3.82, 0,  // 1
            6.01, 3.71, 0,  // 2
            5.42, 4.23, 0,  // 3
            5.16, 4.69, 0,  // 4
            5.52, 4.47, 0,  // 5
        ]);
        const upperBottomfinIndices = [            
            1, 0, 2,
            1, 2, 3,
            4, 3, 2,
            4, 2, 5 ,
        ];

        function createPart(vertices, indices, color = "#2244aa") {
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
            geometry.setIndex(indices);
            geometry.computeVertexNormals();

            const material = new THREE.MeshStandardMaterial({
                color,
                side: THREE.DoubleSide,
                flatShading: true
            });

            return new THREE.Mesh(geometry, material);
        }
        
        const tail = createPart(tailVertices, tailIndices, color);
        const body = createPart(bodyVertices, bodyIndices, color);
        const head = createPart(headVertices, headIndices, color);
        const lowerTopFin = createPart(lowerTopfinVertices, lowerTopfinIndices, color);
        const lowerBottomFin = createPart(lowerBottomfinVertices, lowerBottomfinIndices, color);
        const midBottomFin = createPart(midBottomfinVertices, midBottomfinIndices, color);
        const upperTopFin = createPart(upperTopfinVertices, upperTopfinIndices, color);
        const upperBottomFin = createPart(upperBottomfinVertices, upperBottomfinIndices, color);
        const teeth = createPart(teethVertices, teethIndices, "#ffffff");

        const eyeWhite = new THREE.Mesh(
            new THREE.CircleGeometry(0.12, 8),
            new THREE.MeshStandardMaterial({ color: "#ffffff", side: THREE.DoubleSide })
        );

        const eyeBlack = new THREE.Mesh(
            new THREE.CircleGeometry(0.06, 8),
            new THREE.MeshStandardMaterial({ color: "#000000", side: THREE.DoubleSide })
        );

        eyeWhite.position.set(6.9, 3.1, -0.01);
        eyeBlack.position.set(6.9, 3.1, -0.02); 
        eyeBlack.scale.set(1,1,1);
        eyeWhite.scale.set(1,1,1);

        body.add(head);
        body.add(tail);
        head.add(teeth);
        body.add(lowerTopFin);
        body.add(lowerBottomFin);
        body.add(midBottomFin);
        body.add(upperTopFin);
        body.add(upperBottomFin);
        head.add(eyeWhite);
        head.add(eyeBlack);
        
        this.add(body);

        body.rotation.set(Math.PI, 0, 0); // made shark on the wrong pose initially

    }
}

export { My2DShark };
