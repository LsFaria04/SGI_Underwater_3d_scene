import * as THREE from 'three';

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

        this.init();
    }

    init() {
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
        const indices = [
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

            // Top Fin
            9, 10, 11,
            9, 11, 12,

            // Belly Fins
            13, 14, 15,
            16, 17, 18,
        ];

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        geometry.setIndex(indices);
        geometry.computeVertexNormals();

        const material = new THREE.MeshStandardMaterial({ color: this.color, side: THREE.DoubleSide });

        const fish = new THREE.Mesh(geometry, material);

        // Adjust position so fish doesn't sit too low or clip through origin
        this.position.y = this.widthBody * 1.5;

        this.add(fish);
    }
}

export { MyCarp };
