import * as THREE from 'three';

class MyWater extends THREE.Mesh {
    constructor(floorSize = 50, height = 20) {
        const geometry = new THREE.BoxGeometry(floorSize * 4, height, floorSize * 4);
        const material = new THREE.MeshPhongMaterial({
            color: 0x336688,
            transparent: true,
            opacity: 0.3,
            side: THREE.BackSide,
        });
        super(geometry, material);
        this.position.set(0, height / 2 - 0.5, 0);
    }
}

export { MyWater };
