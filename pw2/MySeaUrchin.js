import * as THREE from 'three';

class MySeaUrchin extends THREE.Object3D {
    constructor(radius = 0.1, spikeLength = 0.5, numSpikes = 100, color = 0x000000) {
        super();
        this.radius = radius;
        this.spikeLength = spikeLength;
        this.numSpikes = numSpikes;
        this.color = color;
        this.init();
    }

    init() {
        const bodyGeom = new THREE.SphereGeometry(this.radius, 12, 12);
        const bodyMat = new THREE.MeshStandardMaterial({ color: this.color });
        const bodyMesh = new THREE.Mesh(bodyGeom, bodyMat);
        this.add(bodyMesh);

        const spikeGeom = new THREE.ConeGeometry(0.02, this.spikeLength, 4);
        const spikeMat = new THREE.MeshStandardMaterial({ color: this.color });
        const spikes = new THREE.InstancedMesh(spikeGeom, spikeMat, this.numSpikes);

        const spike = new THREE.Object3D();

        for (let i = 0; i < this.numSpikes; i++) {

            // random distribution
            const theta = Math.random() * 2 * Math.PI;
            const phi = Math.acos(2 * Math.random() - 1);

            const x = this.radius * Math.sin(phi) * Math.cos(theta);
            const y = this.radius * Math.sin(phi) * Math.sin(theta);
            const z = this.radius * Math.cos(phi);

            spike.position.set(x, y, z);

            const dir = new THREE.Vector3(x, y, z).normalize();
            const axis = new THREE.Vector3(0, 1, 0);
            spike.quaternion.setFromUnitVectors(axis, dir);

            spike.updateMatrix();
            spikes.setMatrixAt(i, spike.matrix);
        }
        this.add(spikes);
    }
}

export { MySeaUrchin };
