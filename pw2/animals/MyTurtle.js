import * as THREE from 'three';
import { MeshBVHHelper } from '../index.module.js';

class MyTurtle extends THREE.Object3D {
    /**
     * 
     * @param {number} shellRadius Radius of the shell
     * @param {number} bodyRadius Radius of the head/legs
     * @param {string|number} colorShell Shell color
     * @param {string|number} colorBody Body color
     */
    constructor(shellRadius = 0.5, bodyRadius = 0.15, colorShell = 0x228B22, colorBody = 0x556B2F) {
        super();

        this.shellRadius = shellRadius;
        this.bodyRadius = bodyRadius;
        this.colorShell = colorShell;
        this.colorBody = colorBody;

        this.helpers = [];
        this.init();
    }

    init() {
        // Shell (slightly flattened sphere)
        const shellGeom = new THREE.SphereGeometry(this.shellRadius, 10, 8);
        shellGeom.scale(1, 0.6, 1); // flatten vertically
        const shellMat = new THREE.MeshStandardMaterial({ color: this.colorShell });
        const shellMesh = new THREE.Mesh(shellGeom, shellMat);
        this.add(shellMesh);
        shellGeom.computeBoundsTree();

        const helper = new MeshBVHHelper(shellMesh);
        helper.visible = false;
        this.add(helper);
        this.helpers.push(helper);

        // Head
        const headGeom = new THREE.SphereGeometry(this.bodyRadius, 16, 8);
        const headMat = new THREE.MeshStandardMaterial({ color: this.colorBody });
        const headMesh = new THREE.Mesh(headGeom, headMat);
        headMesh.position.set(0, 0, this.shellRadius + this.bodyRadius * 0.5);
        this.add(headMesh);
        headGeom.computeBoundsTree();

        const helper2 = new MeshBVHHelper(headMesh);
        helper2.visible = false;
        this.add(helper2);
        this.helpers.push(helper2);

        // Tail
        const tailGeom = new THREE.SphereGeometry(this.bodyRadius * 0.5, 8, 8);
        tailGeom.scale(1, 0.5, 1); // flatten vertically
        const tailMesh = new THREE.Mesh(tailGeom, headMat);
        tailMesh.position.set(0, 0, -this.shellRadius - this.bodyRadius * 0.25);
        this.add(tailMesh);
        tailGeom.computeBoundsTree();

        const helper3 = new MeshBVHHelper(tailMesh);
        helper3.visible = false;
        this.add(helper3);
        this.helpers.push(helper3);

        // Legs
        const legGeom = new THREE.SphereGeometry(this.bodyRadius, 8, 8);
        legGeom.computeBoundsTree();
        legGeom.scale(1 + 1 * this.shellRadius, 0.5, 1 + 1 * this.shellRadius * 0.2); // flatten vertically
        const legPositions = [
            [ this.shellRadius * 0.7, -this.shellRadius * 0.6 * 0.7,  this.shellRadius * 0.7],
            [-this.shellRadius * 0.7, -this.shellRadius * 0.6 * 0.7,  this.shellRadius * 0.7],
            [ this.shellRadius * 0.7, -this.shellRadius * 0.6 * 0.7, -this.shellRadius * 0.7],
            [-this.shellRadius * 0.7, -this.shellRadius * 0.6 * 0.7, -this.shellRadius * 0.7],
        ];
        for (const pos of legPositions) {
            const legMesh = new THREE.Mesh(legGeom, headMat);
            legMesh.position.set(...pos);
            this.add(legMesh);
            

            const helper = new MeshBVHHelper(legMesh);
            helper.visible = false;
            this.add(helper);
            this.helpers.push(helper);
        }

        // Eyes
        const eyeGeom = new THREE.SphereGeometry(this.bodyRadius * 0.2, 8, 8);
        const eyeMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const leftEye = new THREE.Mesh(eyeGeom, eyeMat);
        const rightEye = new THREE.Mesh(eyeGeom, eyeMat);
        leftEye.position.set(-this.bodyRadius * 0.5, this.bodyRadius * 0.3, this.shellRadius + this.bodyRadius * 1.2);
        rightEye.position.set(this.bodyRadius * 0.5, this.bodyRadius * 0.3, this.shellRadius + this.bodyRadius * 1.2);
        this.add(leftEye);
        this.add(rightEye);

        eyeGeom.computeBoundsTree();

        const helper4 = new MeshBVHHelper(leftEye);
        helper4.visible = false;
        this.add(helper4);
        this.helpers.push(helper4);

        const helper5 = new MeshBVHHelper(rightEye);
        helper5.visible = false;
        this.add(helper5);
        this.helpers.push(helper5);
    }
}

export { MyTurtle };
