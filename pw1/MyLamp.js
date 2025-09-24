import * as THREE from 'three';

/**
 * This class represents a table composed of a tabletop and four legs
 */
class MyLamp extends THREE.Object3D {
    /**
     * 
     * @param {number} width Lamp width
     * @param {number} height Lamp height
     * @param {string|number} color Table color (hex or string)
     */
    constructor(width = 1, height = 1, colorBase = "#2e1809", colorSupport = "#000000", colorTop = "#68584d") {
        super();

        // Lamp Base
        const baseGeometry = new THREE.CylinderGeometry(width / 2 * 0.8, width / 2 * 0.8, height * 0.1); 
        const baseMaterial = new THREE.MeshPhongMaterial({ color: colorBase });
        const lampBase= new THREE.Mesh(baseGeometry, baseMaterial);
        lampBase.position.y = height * 0.1 / 2;
        this.add(lampBase);

    
        // Lamp Support
        const supportGeometry = new THREE.CylinderGeometry(width / 2 * 0.2, width / 2 * 0.2, height * 0.55);
        const supportMaterial = new THREE.MeshPhongMaterial({ color: colorSupport });
        const lampSupport = new THREE.Mesh(supportGeometry, supportMaterial);
        lampSupport.position.y = height * 0.55 / 2 + height * 0.1;

        this.add(lampSupport);

        // Lamp top
        const topGeometry = new THREE.CylinderGeometry(width / 2 * 0.4, width / 2 , height * 0.45);
        const topMaterial = new THREE.MeshPhongMaterial({ color: colorTop });
        const lampTop = new THREE.Mesh(topGeometry, topMaterial);
        lampTop.position.y = height * 0.45 / 2 + height * 0.65;

        this.add(lampTop);
        
            
    }
}

export { MyLamp };