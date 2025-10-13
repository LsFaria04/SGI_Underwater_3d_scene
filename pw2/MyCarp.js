import * as THREE from 'three';

/**
 * This class contains a 3D representation of a common carp fish
 */
class MyCarp extends THREE.Object3D {
    /**
     * 
     * @param {number} width carp width
     * @param {number} length carp length
     * @param {string} color Color of the carp
     */
    constructor(width, length, color){
        super();
        this.width = width;
        this.length = length;
        this.color = color;

        this.init();
    }

    init(){

        const vertices = new Float32Array([
        // Head - left side
        0, 1, 0,  // 0
        0.5, 0.5, 0, // 1
        0.6, 1, 0.2, // 2
        0.5, 1.5, 0, // 3
        0.6, 1, -0.2, // 4

        // Body - Only a Vertex
        2.5, 1, 0, // 5

        // BackFins
        3, 1.5, 0, //6
        3, 0.5, 0, // 7
        2.75, 1, 0, // 8

        // TopFin
        1.5, 1.2, 0, // 9
        1.25, 1.3, 0, // 10
        1.40, 1.6, 0, // 11
        1.70, 1.4, 0, // 12

        // BellyFins
        0.75, 1, 0.16, // 13
        1, 1.3, 0.3, // 14
        1, 0.7, 0.3, // 15

        0.75, 1, -0.16, // 16
        1, 1.3, -0.3, // 17
        1, 0.7, -0.3, // 18

        

        ]);

        // Define faces (triangles)
        const indices = [
            //Face
            0, 1, 2,
            0, 2, 3,
            0, 1, 4,
            0, 4, 3,

            // Body
            1, 2, 5,
            1, 4, 5,
            3, 2, 5,
            3, 5, 4,

            // BackFin
            5,6,8,
            5,7,8,

            //Top Fin
            9,10,11,
            9,11,12,

            //Belly Fins
            13,14,15,
            16,17,18,

        ];

        // Create BufferGeometry
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        geometry.setIndex(indices);
        geometry.computeVertexNormals();

        // Create a material
        const material = new THREE.MeshStandardMaterial({ color: 0xff0000, side: THREE.DoubleSide });

        // Create mesh
        const fish = new THREE.Mesh(geometry, material);

        this.position.y = this.width/2;

        this.add(fish);

    }

}

export {MyCarp};