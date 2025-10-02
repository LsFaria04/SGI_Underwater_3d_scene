import * as THREE from 'three';

/**
 * This class represents a table composed of a tabletop and four legs
 */
class MyTable extends THREE.Object3D {
    /**
     * 
     * @param {number} width Table width
     * @param {number} height Table height
     * @param {number} depth Table depth
     * @param {number} legRadius Cylinder radius for legs
     * @param {number} legHeight Cylinder height for legs
     * @param {string|number} color Table color (hex or string)
     */
    constructor(width = 4, height = 0.2, depth = 2, legRadius = 0.1, legHeight = 1, woodTexture, color = "#8B4513") {
        super();

        //Table texture
        this.woodTexture = woodTexture;
        const tableTexture = this.woodTexture;
        tableTexture.wrapS = THREE.RepeatWrapping;
        tableTexture.wrapT = THREE.RepeatWrapping;
        tableTexture.repeat.set(width, height);
        // Tabletop
        const topGeometry = new THREE.BoxGeometry(width, height, depth);
        const topMaterial = new THREE.MeshPhongMaterial({ color: color, map: tableTexture });
        const tableTop = new THREE.Mesh(topGeometry, topMaterial);
        tableTop.position.y = legHeight + height / 2; // tabletop is on top of legs
        this.add(tableTop);

        // Legs
        const legGeometry = new THREE.CylinderGeometry(legRadius, legRadius, legHeight, 16);
        const legMaterial = new THREE.MeshPhongMaterial({color: "#3c3b3c", specular: "#ffffff", shininess: 20});

        const dxs = [-width/2 + legRadius, width/2 - legRadius];
        const dzs = [-depth/2 + legRadius, depth/2 - legRadius];

        for (let dx of dxs) {
            for (let dz of dzs) {
                const leg = new THREE.Mesh(legGeometry, legMaterial);
                leg.position.set(dx, legHeight / 2, dz); // legs are half-height above 0
                this.add(leg);
            }
        }
    }
}

export { MyTable };
