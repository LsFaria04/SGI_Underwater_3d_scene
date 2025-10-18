import * as THREE from 'three';

class MyShark extends THREE.Object3D {
    /**
     * 
     * @param {string} color Body color
     */
    constructor(scale = 1, color = "#2244aa") {
        super();

        // vertices comments may no be 100% accurate, I had only commented indices and afterwards asked llm to comment vertices for ease of understanding
        const vertices = new Float32Array([
            // tail
            0.38, 2.44, 0,  // 0 - tail bottom tip
            0.98, 2.51, 0,  // 1 - tail top tip
            2.37, 3.07, 0,  // 2 - tail upper mid
            1.78, 3.40, 0,  // 3 - tail mid connector
            1.39, 3.82, 0,  // 4 - tail upper fin (tip)
            1.66, 3.82, 0,  // 5 - tail upper fin (inner)
            2.37, 3.40, 0,  // 6 - tail-body connection (upper)

            // rear body
            3.05, 3.40, 0,  // 7 - rear body top
            3.23, 2.88, 0,  // 8 - rear body bottom
            2.63, 3.02, 0,  // 9 - tail underside
            2.47, 2.73, 0,  // 10 - tail underside inner

            // lower body fins
            2.68, 3.40, 0,  // 11 - lower fin start (rear)
            2.47, 3.50, 0,  // 12 - lower fin inner
            2.67, 3.50, 0,  // 13 - lower fin tip
            2.58, 3.71, 0,  // 14 - lower fin outer tip
            2.36, 3.40, 0,  // 15 - lower fin end

            // mid body
            3.48, 3.50, 0,  // 16 - mid body top
            4.37, 2.69, 0,  // 17 - mid body bottom start
            4.07, 3.64, 0,  // 18 - mid body top ridge
            3.60, 4.00, 0,  // 19 - mid dorsal ridge

            // front body (before head)
            4.37, 2.69, 0,  // 20 - lower mid body (duplicate of 17)
            5.48, 3.55, 0,  // 21 - body forward upper
            5.22, 3.82, 0,  // 22 - upper forward body
            5.30, 2.60, 0,  // 23 - lower forward body
            
            // dorsal fin
            4.08, 2.74, 0,  // 24 - dorsal fin base front
            4.44, 2.55, 0,  // 25 - dorsal fin lower base
            4.40, 2.44, 0,  // 26 - dorsal fin inner base
            4.18, 1.69, 0,  // 27 - dorsal fin lower tip
            4.67, 1.89, 0,  // 28 - dorsal fin upper tip

            // head (upper jaw / snout)
            6.43, 2.77, 0,  // 29 - snout upper base
            6.30, 3.33, 0,  // 30 - snout top mid
            6.01, 3.71, 0,  // 31 - head upper ridge
            5.42, 4.23, 0,  // 32 - top of head crest
            5.16, 4.69, 0,  // 33 - head top fin tip
            5.52, 4.47, 0,  // 34 - head top fin inner

            // head (lower jaw / mouth)
            6.61, 3.65, 0,  // 35 - mouth upper curve
            6.77, 3.41, 0,  // 36 - mouth mid upper
            7.10, 3.24, 0,  // 37 - mouth front upper
            7.20, 3.00, 0,  // 38 - snout tip (nose)
            7.58, 3.21, 0,  // 39 - frontmost mouth edge
            7.17, 3.42, 0,  // 40 - upper jaw contour
            7.05, 3.53, 0,  // 41 - lower jaw contour
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
            8, 15, 16,

            // body 2
            8, 16, 20,
            16, 20, 18,

            // body 3
            18, 20, 21,
            18, 21, 22,
            20, 23, 21,

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
            11, 13, 15,
            13, 14, 15,

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
        ];

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        geometry.setIndex(indices);
        geometry.computeVertexNormals();

        const material = new THREE.MeshStandardMaterial({
            color: color,
            side: THREE.DoubleSide,
            flatShading: true
        });

        const sharkMesh = new THREE.Mesh(geometry, material);
        sharkMesh.scale.set(scale, scale, scale);

        sharkMesh.rotation.y = Math.PI; 

        this.add(sharkMesh);

        this.mesh = sharkMesh;
        this.geometry = geometry;
    }
}

export { MyShark };
