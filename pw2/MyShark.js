import * as THREE from 'three';

class MyShark extends THREE.Object3D {
    /**
     * 
     * @param {string} color Body color
     */
    constructor(depth = 1,color = "#2244aa") {
        super();

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

        const indices = [
            // Tail
            0, 1, 2,
            0, 2, 3,
            3, 4, 5,
            3, 6, 5,


            // body 1   (1 is closer to tail, 4 is closer to head)
            2, 7, 3,
            2, 8, 7, 
            8, 7, 16, 

            // body 2
            8, 16, 17,
            16, 17, 18,

            // body 3
            18, 17, 21,
            18, 21, 22,
            17, 23, 21,

            // body 4
            23, 29, 21,
            21, 29, 30,
            21, 30, 31,   
                        
            // head - upper jaw
            29, 36, 30,  
            29, 37, 36,
            29, 38, 37,
            37, 38, 39,
            36, 37, 40,
            37, 39, 40,

            // head - lower jaw
            30, 35, 31,  
            30, 36, 35,
            36, 41, 35,


            // lower body top fin
            8, 10, 9,

            // lower body bottom fin
            11, 12, 13,
            11, 13, 7,
            13, 14, 7,

            // mid body bottom fin
            16, 18, 19,

            // upper body top fin
            24, 25, 23,
            24, 26, 23,
            27, 23, 26,
            27, 28, 23,

            // upper body bottom fin
            22, 21, 31,
            22, 31, 32,
            33, 32, 31,
            33, 31, 34,

            // teeth
            42, 43, 44,
            45, 46, 47,
            48, 49, 50,
            51, 52, 53,
        ];
        */
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
            3, 4, 5,
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

        body.add(head);
        body.add(tail);
        head.add(teeth);
        body.add(lowerTopFin);
        body.add(lowerBottomFin);
        body.add(midBottomFin);
        body.add(upperTopFin);
        body.add(upperBottomFin);
        
        this.add(body);

        body.rotation.set(Math.PI, 0, 0); // made shark on the wrong pose initially

    }
}

export { MyShark };
