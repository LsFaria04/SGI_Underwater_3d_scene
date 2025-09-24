import * as THREE from 'three';

/**
 * This class represents a pencil composed of a tip and body
 */
class MyPencil extends THREE.Object3D {
    /**
     * 
     * @param {number} width Pencil width
     * @param {number} height Pencil height
     * @param {string|number} color Pencil color (hex or string)
     */
    constructor(length = 0.2, width = 0.02, color = "#f6ff00") {
        super();

        // Pencil Body

        const bodyGeometry = new THREE.CylinderGeometry(width / 2, width / 2, length * 0.8, 6 ); 
        const bodyMaterial = new THREE.MeshPhongMaterial({ color});
        const pencilBody= new THREE.Mesh(bodyGeometry, bodyMaterial);
        pencilBody.position.y = length * 0.8 / 2;
        this.add(pencilBody);

    
        // Pencil Tip
        const tipGeometry = new THREE.ConeGeometry(width / 2, length * 0.2, 6);
        const tipMaterial = new THREE.MeshPhongMaterial({ color: "#000000"});
        const pencilTip = new THREE.Mesh(tipGeometry, tipMaterial);
       pencilTip.position.y = length * 0.2 / 2 + length * 0.8;
        this.add(pencilTip);
        
            
    }
}

export { MyPencil };