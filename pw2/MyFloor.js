import * as THREE from 'three';
/**
 * This class represents the sea floor
 */
class MyFloor extends THREE.Mesh {
    /**
     * 
     * @param {*} size Floor size
     * @param {*} segments Floor segments
     */
    constructor(size = 50, segments = 128) {
        const geometry = new THREE.PlaneGeometry(size, size, segments, segments);

        const positions = geometry.attributes.position;
        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const y = positions.getY(i);
            const height = 0.4 * Math.sin(x * 0.3) * Math.cos(y * 0.3) + (Math.random() - 0.5) * 0.1;
            positions.setZ(i, height);
        }
        positions.needsUpdate = true;
        geometry.computeVertexNormals();

        const material = new THREE.MeshPhongMaterial({
            color: 0xC2B280,   // sand color
            shininess: 8,
            specular: 0x222222
        });

        super(geometry, material);
        this.rotation.x = -Math.PI / 2;
        this.receiveShadow = true;
    }
}

export { MyFloor };
