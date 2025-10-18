import * as THREE from 'three';

class MyTurtle extends THREE.Object3D {
    /**
     * 
     * @param {number} shellRadius Radius of the shell
     * @param {number} bodyRadius Radius of the head/legs
     * @param {string|number} colorShell Shell color
     * @param {string|number} colorBody Body color
     */
    constructor(shellRadius = 1, bodyRadius = 0.3, colorShell = 0x228B22, colorBody = 0x556B2F) {
        super();

        this.shellRadius = shellRadius;
        this.bodyRadius = bodyRadius;
        this.colorShell = colorShell;
        this.colorBody = colorBody;

        this.init();
    }

    init() {
        // Shell (slightly flattened sphere)
        const shellGeom = new THREE.SphereGeometry(this.shellRadius, 32, 8);
        shellGeom.scale(1, 0.6, 1); // flatten vertically
        const shellMat = new THREE.MeshStandardMaterial({ color: this.colorShell });
        const shellMesh = new THREE.Mesh(shellGeom, shellMat);
        this.add(shellMesh);

        // Head
        const headGeom = new THREE.SphereGeometry(this.bodyRadius, 16, 8);
        const headMat = new THREE.MeshStandardMaterial({ color: this.colorBody });
        const headMesh = new THREE.Mesh(headGeom, headMat);
        headMesh.position.set(0, 0, this.shellRadius + this.bodyRadius * 0.5);
        this.add(headMesh);

        // Tail
        const tailGeom = new THREE.SphereGeometry(this.bodyRadius * 0.5, 8, 8);
        const tailMesh = new THREE.Mesh(tailGeom, headMat);
        tailMesh.position.set(0, 0, -this.shellRadius - this.bodyRadius * 0.25);
        this.add(tailMesh);

        // Legs
        const legGeom = new THREE.SphereGeometry(this.bodyRadius, 8, 8);
        const legPositions = [
            [ this.shellRadius * 0.7, -0.3,  this.shellRadius * 0.4],
            [-this.shellRadius * 0.7, -0.3,  this.shellRadius * 0.4],
            [ this.shellRadius * 0.7, -0.3, -this.shellRadius * 0.4],
            [-this.shellRadius * 0.7, -0.3, -this.shellRadius * 0.4],
        ];
        for (const pos of legPositions) {
            const legMesh = new THREE.Mesh(legGeom, headMat);
            legMesh.position.set(...pos);
            this.add(legMesh);
        }

        // Eyes
        const eyeGeom = new THREE.SphereGeometry(this.bodyRadius * 0.2, 8, 8);
        const eyeMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const leftEye = new THREE.Mesh(eyeGeom, eyeMat);
        const rightEye = new THREE.Mesh(eyeGeom, eyeMat);
        leftEye.position.set(-this.bodyRadius * 0.5, this.bodyRadius * 0.3, this.shellRadius + this.bodyRadius * 0.5);
        rightEye.position.set(this.bodyRadius * 0.5, this.bodyRadius * 0.3, this.shellRadius + this.bodyRadius * 0.5);
        this.add(leftEye);
        this.add(rightEye);
    }
}

export { MyTurtle };
