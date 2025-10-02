import * as THREE from 'three';

/**
 * This class represents a rubber
 */
class MyRubber extends THREE.Object3D {
    /**
     * 
     * @param {number} width Rubber width
     * @param {number} height Rubber height
     * @param {number} depth Rubber depth
     * @param {string} color1 Color of the main part
     * @param {string} color2 Color of the tip
     */
    constructor(width = 2, height = 0.5, depth = 1, color1 = 0xff9999, color2 = 0xffffff) {
        super();

        // Rubber body
        const bodyGeometry = new THREE.BoxGeometry(width * 0.7, height, depth);
        const bodyMaterial = new THREE.MeshPhongMaterial({ color: color1});
        const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
        bodyMesh.position.x = -width * 0.15;
        bodyMesh.position.y = height / 2;
        this.add(bodyMesh);

        // Rubber tip
        const tipGeometry = new THREE.BoxGeometry(width * 0.3, height, depth);
        const tipMaterial = new THREE.MeshPhongMaterial({ color: color2});
        const tipMesh = new THREE.Mesh(tipGeometry, tipMaterial);
        tipMesh.position.x = width * 0.35;
        tipMesh.position.y = height / 2;
        this.add(tipMesh);

    }
}

export { MyRubber };
