import * as THREE from 'three';
import { MeshBVHHelper } from '../index.module.js';
/**
 * This class represents a sea urchin
 */
class MySeaUrchin extends THREE.Object3D {
    /**
     * 
     * @param {*} radius Sea urchin body radius
     * @param {*} spikeLength Sea urchin spike lenght
     * @param {*} numSpikes Sea urchin number of spikes in the body
     * @param {*} color Sea urchin color
     */
    constructor(radius = 0.1, spikeLength = 0.5, numSpikes = 100, color = 0x000000, LOD) {
        super();
        this.radius = radius;
        this.spikeLength = spikeLength;
        this.numSpikes = numSpikes;
        this.color = color;
        this.helpers = [];

        switch(LOD){
            case "L":
                this.initLowLOD();
                break;
            case "M":
                this.initMediumLOD();
                break;
            case "H":
                this.initHighLOD();
                break;
            default:
                this.initLowLOD();
        }
    }
    
    initLowLOD() {
        //No spikes and boxy body
        
        const bodyGeom = new THREE.BoxGeometry(this.radius + this.spikeLength * 0.5, this.radius  + this.spikeLength * 0.5, this.radius  + this.spikeLength * 0.5);
        const bodyMat = new THREE.MeshStandardMaterial({ color: this.color });
        const bodyMesh = new THREE.Mesh(bodyGeom, bodyMat);
        this.add(bodyMesh);

        bodyGeom.computeBoundsTree();

        const helper = new MeshBVHHelper(bodyMesh);
        helper.visible = false;
        this.add(helper);
        this.helpers.push(helper);

    }

    initMediumLOD() {
        //lower number of spikes and less rounded body

        const bodyGeom = new THREE.SphereGeometry(this.radius, 5, 5);
        const bodyMat = new THREE.MeshStandardMaterial({ color: this.color });
        const bodyMesh = new THREE.Mesh(bodyGeom, bodyMat);
        this.add(bodyMesh);

        bodyGeom.computeBoundsTree();

        const helper = new MeshBVHHelper(bodyMesh);
        helper.visible = false;
        this.add(helper);
        this.helpers.push(helper);

        const spikeGeom = new THREE.ConeGeometry(0.02, this.spikeLength, 4, 1);
        const spikeMat = new THREE.MeshStandardMaterial({ color: this.color });
        const spikes = new THREE.InstancedMesh(spikeGeom, spikeMat, this.numSpikes);

        const spike = new THREE.Object3D();

        //Reduced number og spikes for medium LOD
        const mediumLODSpikeNumb = Math.round(this.numSpikes * 0.5);

        for (let i = 0; i < mediumLODSpikeNumb; i++) {

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

    initHighLOD() {
        const bodyGeom = new THREE.SphereGeometry(this.radius, 12, 12);
        const bodyMat = new THREE.MeshStandardMaterial({ color: this.color });
        const bodyMesh = new THREE.Mesh(bodyGeom, bodyMat);
        this.add(bodyMesh);

        bodyGeom.computeBoundsTree();

        const helper = new MeshBVHHelper(bodyMesh);
        helper.visible = false;
        this.add(helper);
        this.helpers.push(helper);

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
