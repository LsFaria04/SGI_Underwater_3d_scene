import * as THREE from 'three';

class MySubmarine extends THREE.Object3D {
    constructor() {
        super();

        // Main body (horizontal capsule)
        const bodyGeometry = new THREE.CapsuleGeometry(0.5, 3, 4, 8);
        const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x444444 });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.rotation.z = Math.PI / 2;
        this.add(body);

        // Hatch
        const hatchGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.3, 8);
        const hatchMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 });
        const hatch = new THREE.Mesh(hatchGeometry, hatchMaterial);
        hatch.position.set(0, 0.4, 0);
        this.add(hatch);

        // Periscope
        const verticalGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 8);
        const periscopeMaterial = new THREE.MeshPhongMaterial({ color: 0x666666 });
        const verticalPart = new THREE.Mesh(verticalGeometry, periscopeMaterial);
        verticalPart.position.y = 0.5;
        
        const horizontalGeometry = new THREE.CylinderGeometry(0.04, 0.04, 0.8, 8);
        const horizontalPart = new THREE.Mesh(horizontalGeometry, periscopeMaterial);
        horizontalPart.position.set(0.4, 1, 0);
        horizontalPart.rotation.z = Math.PI / 2;
        
        this.add(verticalPart);
        this.add(horizontalPart);

        // Set initial position
        this.position.set(0, 2, 0);
    }
}

export { MySubmarine };