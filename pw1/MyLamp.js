import * as THREE from 'three';

/**
 * This class represents a lamp composed of a base, a support and a top
 */
class MyLamp extends THREE.Object3D {
    /**
     * 
     * @param {number} width Lamp width
     * @param {number} height Lamp height
     * @param {string|number} color Lamp color (hex or string)
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
        const topGeometry = new THREE.CylinderGeometry(width / 2 * 0.4, width / 2 , height * 0.45, 32, 1, true);
        const topMaterial = new THREE.MeshPhongMaterial({ color: colorTop, side: THREE.DoubleSide });
        const lampTop = new THREE.Mesh(topGeometry, topMaterial);
        lampTop.position.y = height * 0.45 / 2 + height * 0.65;

        this.add(lampTop);

        // Lamp bulb
        const bulbRadius = width * 0.15;
        const bulbGeometry = new THREE.SphereGeometry(bulbRadius, 32, 32);
        const bulbMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xffffcc,    
            emissive: 0xffffaa, 
            emissiveIntensity: 0.8,
            shininess: 100
        });
        const bulb = new THREE.Mesh(bulbGeometry, bulbMaterial);

        bulb.position.y = height * 0.65 + (height * 0.45) / 4;
        this.add(bulb);

        const bulbLight = new THREE.PointLight(0xffffcc, 1, 3); 
        bulbLight.position.copy(bulb.position);
        this.add(bulbLight);
                
            
    }
}

export { MyLamp };