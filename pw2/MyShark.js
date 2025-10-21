import * as THREE from 'three';

class MyShark extends THREE.Object3D {
    /**
     * 
     * @param {string} color Body color
     */
    constructor(tailWidth = 0.1, bodyWidth = 0.6, headWidth = 0.4, finWidth = 0.05, color = "#2244aa") {
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
            //front face
            1.78, 3.40, tailWidth/2,  // 0  tail
            2.37, 3.07, tailWidth/2,  // 1 tail
            2.37, 3.40, tailWidth/2,  // 2 tail
            3.23, 2.88, bodyWidth/2,  // 3
            3.05, 3.40, bodyWidth/2,  // 4
            5.30, 2.60, bodyWidth/2,  // 5
            5.22, 3.82, bodyWidth/2,  // 6
            6.43, 2.77, bodyWidth/2,  // 7  body
            6.30, 3.33, bodyWidth/2,  // 8  body
            6.01, 3.71, bodyWidth/2,  // 9  body

            //back face
            1.78, 3.40, -tailWidth/2,  // 10  tail
            2.37, 3.07, -tailWidth/2,  // 11  tail
            2.37, 3.40, -tailWidth/2,  // 12  tail
            3.23, 2.88, -bodyWidth/2,  // 13
            3.05, 3.40, -bodyWidth/2,  // 14
            5.30, 2.60, -bodyWidth/2,  // 15
            5.22, 3.82, -bodyWidth/2,  // 16
            6.43, 2.77, -bodyWidth/2,  // 17  body
            6.30, 3.33, -bodyWidth/2,  // 18  body
            6.01, 3.71, -bodyWidth/2,  // 19  body

        ]);
        const bodyIndices = [
            // front face
            0,1,2,
            1,3,4,
            2,1,4,
            3,5,4,
            4,5,6,
            5,7,6,
            6,7,8,
            6,8,9,


            // back face
            10,11,12,
            11,13,14,
            12,11,14,
            13,15,14,
            14,15,16,
            15,17,16,
            16,17,18,
            16,18,19,


            // side faces
            1,3,11,
            3,13,11,
            
            3,5,13,
            13,5,15,

            5,7,15,
            17,15,7,

            2,4,12,
            12,4,14,

            4,6,14,
            16,14,6,

            6,9,19,
            6,19,16,

            8,9,18,
            18,9,19,
        ];

        const headVertices = new Float32Array([
            6.43, 2.77, bodyWidth/2,  // 0 body 
            6.30, 3.33, bodyWidth/2,  // 1 body
            7.58, 3.21, headWidth/2,  // 2
            7.17, 3.42, headWidth/2,  // 3
            7.10, 3.24, headWidth/2,  // 4
            7.05, 3.53, headWidth/2,  // 5
            6.01, 3.71, bodyWidth/2,  // 6 body

            6.43, 2.77, -bodyWidth/2,  // 7 body 
            6.30, 3.33, -bodyWidth/2,  // 8 body
            7.58, 3.21, -headWidth/2,  // 9
            7.17, 3.42, -headWidth/2,  // 10
            7.10, 3.24, -headWidth/2,  // 11
            7.05, 3.53, -headWidth/2,  // 12
            6.01, 3.71, -bodyWidth/2,  // 13 body


        ]);
        const headIndices = [
            // front faces
            1,0,4,
            4,0,2,
            3,4,2,
            1,4,3,
            6,1,5,

            // back faces
            8,7,11,
            11,7,9,

            10,11,9,
            8,11,10,
            13,8,12,

            // side faces
            0,2,7,
            7,2,9,

            5,6,12,
            13,12,6,

            1,5,8,
            8,5,12,

            2,3,9,
            10,9,3,

            3,4,10,
            10,4,11,

            1,3,10,
            1,10,8
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
            3.23, 2.88, finWidth / 2,  // 0
            2.63, 3.02, finWidth / 2,  // 1
            2.47, 2.73, finWidth / 2,  // 2

            3.23, 2.88, -finWidth / 2,  // 0
            2.63, 3.02, -finWidth / 2,  // 1
            2.47, 2.73, -finWidth / 2,  // 2
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
                flatShading: false,
            });

            return new THREE.Mesh(geometry, material);
        }
        
        const tail = createPart(tailVertices, tailIndices, color);
        const body = createPart(bodyVertices, bodyIndices, color);
        const head = createPart(headVertices, headIndices, color);

        /*
        const lowerTopFin = createPart(lowerTopfinVertices, lowerTopfinIndices, color);
        const lowerBottomFin = createPart(lowerBottomfinVertices, lowerBottomfinIndices, color);
        const midBottomFin = createPart(midBottomfinVertices, midBottomfinIndices, color);
        const upperTopFin = createPart(upperTopfinVertices, upperTopfinIndices, color);
        const upperBottomFin = createPart(upperBottomfinVertices, upperBottomfinIndices, color);
        const teeth = createPart(teethVertices, teethIndices, "#ffffff");
        /*  
        /*
        body.add(tail);
        head.add(teeth);
        body.add(lowerTopFin);
        body.add(lowerBottomFin);
        body.add(midBottomFin);
        body.add(upperTopFin);
        body.add(upperBottomFin);

        */
        
        body.add(tail);
        this.add(body);
        body.add(head);

        body.rotation.set(Math.PI, 0, 0); // made shark on the wrong pose initially

    }
}

export { MyShark };
