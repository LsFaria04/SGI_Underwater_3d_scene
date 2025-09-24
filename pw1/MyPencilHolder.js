import * as THREE from 'three';
import { MyPencil } from './MyPencil.js';

/**
 * This class represents a pencil holder composed of a cylindrical body and an open top
 */

class MyPencilHolder extends THREE.Object3D {
    /**
     * 
     * @param {number} radius Pencil holder radius
     * @param {number} height Pencil holder height
     * @param {string|number} color Pencil holder color (hex or string)
     */
    constructor(radius = 0.1, height = 0.2, color = "#00FF00") {
        super();

        // Holder body
        const bodyGeometry = new THREE.CylinderGeometry(radius, radius, height, 32, 1, true);
        const bodyMaterial = new THREE.MeshPhongMaterial({ color , side: THREE.DoubleSide});
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = height / 2; // position the body above the ground
        this.add(body);

        // Bottom 
        const bottomGeometry = new THREE.CircleGeometry(radius, 32);
        const bottomMaterial = new THREE.MeshPhongMaterial({ color , side: THREE.DoubleSide});
        const bottom = new THREE.Mesh(bottomGeometry, bottomMaterial);
        bottom.rotation.x = -Math.PI / 2; // rotate to be horizontal
        bottom.position.y = 0; // position at the base
        this.add(bottom);

        // Fill with pencils inside
        const pencilCount = 5;
        for (let i = 0; i < pencilCount; i++) {
            const pencil = new MyPencil(0.25, 0.02, i % 2 == 0 ? "#FFFF00" : "#FF0000");
            const angle = (i / pencilCount) * Math.PI * 2;
            const pencilRadius = radius * 0.6; // position pencils slightly inside the holder
            pencil.rotateX(0.10);
            pencil.position.set(Math.cos(angle) * pencilRadius, height - 0.2, Math.sin(angle) * pencilRadius);
            this.add(pencil);
        }
    }
}

export { MyPencilHolder };
