import * as THREE from 'three';
/**
 * This class represents the water in the aquarium
 */
class MyWater extends THREE.Mesh {
    /**
     * 
     * @param {*} floorSize Size of the floor
     * @param {*} height Height of water
     */
    constructor(floorSize = 50, height = 20) {
        const geometry = new THREE.BoxGeometry(floorSize * 4, height * 2, floorSize * 4);
        const material = new THREE.MeshPhongMaterial({
            color: 0x336688,
            transparent: true,
            opacity: 0.2,
            side: THREE.BackSide,
        });
        super(geometry, material);
        this.position.set(0, 0, 0);
    }
}

export { MyWater };
