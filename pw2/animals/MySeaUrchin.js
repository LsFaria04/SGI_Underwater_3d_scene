import * as THREE from 'three';
import { MeshBVHHelper } from '../index.module.js';

/**
 * This class represents a sea urchin
 */
class MySeaUrchin extends THREE.LOD {

    /**
     * 
     * @param {*} radius Radius of the sea urchin body
     * @param {*} spikeLength Lenght of the spikes
     * @param {*} numSpikes Number og spikes
     * @param {*} color color or the sea urchin
     */
    constructor(radius = 0.1, spikeLength = 0.5, numSpikes = 100, color = 0x000000) {
        super();

        this.radius = radius;
        this.spikeLength = spikeLength;
        this.numSpikes = numSpikes;
        this.color = color;
        this.helpers = [];

        this.init();
    }

    addBVHHelper(mesh) {
        const helper = new MeshBVHHelper(mesh);
        helper.visible = false;
        mesh.add(helper);
        this.helpers.push(helper);
    }

    init() {
        // High detail (LOD 0)
        const high = this.initHighLOD();
        this.addLevel(high, 0);

        // Medium detail (LOD 1)
        const medium = this.initMediumLOD();
        this.addLevel(medium, 5);

        // Low detail (LOD 2)
        const low = this.initLowLOD();
        this.addLevel(low, 20);
    }


    initLowLOD() {
        const urchin = new THREE.Object3D();

        const bodyGeom = new THREE.BoxGeometry(
            this.radius + this.spikeLength * 0.5,
            this.radius + this.spikeLength * 0.5,
            this.radius + this.spikeLength * 0.5
        );
        const bodyMat = new THREE.MeshStandardMaterial({ color: this.color });
        const bodyMesh = new THREE.Mesh(bodyGeom, bodyMat);

        bodyGeom.computeBoundsTree();
        urchin.add(bodyMesh);

        // Add helpers once
        urchin.traverse(obj => {
            if (obj.isMesh) this.addBVHHelper(obj);
        });

        return urchin;
    }


    initMediumLOD() {
        const urchin = new THREE.Object3D();

        const bodyGeom = new THREE.SphereGeometry(this.radius, 5, 5);
        const bodyMat = new THREE.MeshStandardMaterial({ color: this.color });
        const bodyMesh = new THREE.Mesh(bodyGeom, bodyMat);

        bodyGeom.computeBoundsTree();
        urchin.add(bodyMesh);

        // Spikes (reduced count)
        const spikeGeom = new THREE.ConeGeometry(0.02, this.spikeLength, 4, 1);
        const spikeMat = new THREE.MeshStandardMaterial({ color: this.color });

        const mediumCount = Math.round(this.numSpikes * 0.5);
        const spikes = new THREE.InstancedMesh(spikeGeom, spikeMat, mediumCount);

        const spike = new THREE.Object3D();

        for (let i = 0; i < mediumCount; i++) {
            const theta = Math.random() * 2 * Math.PI;
            const phi = Math.acos(2 * Math.random() - 1);

            const x = this.radius * Math.sin(phi) * Math.cos(theta);
            const y = this.radius * Math.sin(phi) * Math.sin(theta);
            const z = this.radius * Math.cos(phi);

            spike.position.set(x, y, z);

            const dir = new THREE.Vector3(x, y, z).normalize();
            spike.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);

            spike.updateMatrix();
            spikes.setMatrixAt(i, spike.matrix);
        }

        urchin.add(spikes);

        // Add helpers once
        urchin.traverse(obj => {
            if (obj.isMesh) this.addBVHHelper(obj);
        });

        return urchin;
    }

    initHighLOD() {
        const urchin = new THREE.Object3D();

        const bodyGeom = new THREE.SphereGeometry(this.radius, 12, 12);
        const bodyMat = new THREE.MeshStandardMaterial({ color: this.color });
        const bodyMesh = new THREE.Mesh(bodyGeom, bodyMat);

        bodyGeom.computeBoundsTree();
        urchin.add(bodyMesh);

        // Spikes (full count)
        const spikeGeom = new THREE.ConeGeometry(0.02, this.spikeLength, 4);
        const spikeMat = new THREE.MeshStandardMaterial({ color: this.color });

        const spikes = new THREE.InstancedMesh(spikeGeom, spikeMat, this.numSpikes);
        const spike = new THREE.Object3D();

        for (let i = 0; i < this.numSpikes; i++) {
            const theta = Math.random() * 2 * Math.PI;
            const phi = Math.acos(2 * Math.random() - 1);

            const x = this.radius * Math.sin(phi) * Math.cos(theta);
            const y = this.radius * Math.sin(phi) * Math.sin(theta);
            const z = this.radius * Math.cos(phi);

            spike.position.set(x, y, z);

            const dir = new THREE.Vector3(x, y, z).normalize();
            spike.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);

            spike.updateMatrix();
            spikes.setMatrixAt(i, spike.matrix);
        }

        urchin.add(spikes);

        // Add helpers once
        urchin.traverse(obj => {
            if (obj.isMesh) this.addBVHHelper(obj);
        });

        return urchin;
    }
}

export { MySeaUrchin };