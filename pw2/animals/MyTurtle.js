import * as THREE from 'three';
import { MeshBVHHelper } from '../index.module.js';

class MyTurtle extends THREE.Object3D {

    constructor(
        shellRadius = 0.5,
        bodyRadius = 0.15,
        colorShell = 0x228B22,
        colorBody = 0x556B2F,
        texture
    ) {
        super();

        this.shellRadius = shellRadius;
        this.bodyRadius = bodyRadius;
        this.colorShell = colorShell;
        this.colorBody = colorBody;
        this.texture = texture;

        this.helpers = [];
        this.time = 0; // animation clock

        this.init();
    }

    // ---------------------------------------------------------
    // Add BVH helper to a mesh
    // ---------------------------------------------------------
    addBVHHelper(mesh) {
        const helper = new MeshBVHHelper(mesh);
        helper.visible = false;
        mesh.add(helper); // attach to mesh, not root
        this.helpers.push(helper);
    }

    // ---------------------------------------------------------
    // Build turtle
    // ---------------------------------------------------------
    init() {

        // ---------------- SHELL ----------------
        this.texture.wrapS = THREE.MirroredRepeatWrapping;
        this.texture.wrapT = THREE.MirroredRepeatWrapping;
        this.texture.repeat.set(
            2 * this.shellRadius / 0.5,
            2 * this.shellRadius / 0.5
        );

        const shellGeo = new THREE.SphereGeometry(this.shellRadius, 16, 12);
        shellGeo.scale(1, 0.5, 1);

        const shellMat = new THREE.MeshStandardMaterial({
            color: this.colorShell,
            map: this.texture
        });

        this.shell = new THREE.Mesh(shellGeo, shellMat);
        this.shell.castShadow = true;
        this.shell.receiveShadow = true;
        shellGeo.computeBoundsTree();
        this.add(this.shell);
        this.addBVHHelper(this.shell);


        // ---------------- HEAD ----------------
        const headGeo = new THREE.SphereGeometry(this.bodyRadius, 16, 12);
        const headMat = new THREE.MeshStandardMaterial({ color: this.colorBody });

        this.head = new THREE.Mesh(headGeo, headMat);
        this.head.scale.set(0.8, 1, 1.4);
        this.head.position.set(0, 0, this.shellRadius + this.bodyRadius * 0.5);
        this.head.castShadow = true;
        this.head.receiveShadow = true;
        headGeo.computeBoundsTree();
        this.add(this.head);
        this.addBVHHelper(this.head);


        // ---------------- LEGS ----------------
        const legGeo = new THREE.SphereGeometry(this.bodyRadius, 12, 10);
        legGeo.computeBoundsTree();

        const legPositions = [
            [ this.shellRadius * 0.7, -this.shellRadius * 0.3,  this.shellRadius * 0.7], // front right
            [-this.shellRadius * 0.7, -this.shellRadius * 0.3,  this.shellRadius * 0.7], // front left
            [ this.shellRadius * 0.7, -this.shellRadius * 0.3, -this.shellRadius * 0.7], // back right
            [-this.shellRadius * 0.7, -this.shellRadius * 0.3, -this.shellRadius * 0.7], // back left
        ];

        this.legs = [];

        for (let i = 0; i < 4; i++) {

            // Create a pivot at the hip joint
            const pivot = new THREE.Group();
            this.add(pivot);

            //Create the leg mesh
            const leg = new THREE.Mesh(legGeo, headMat);
            leg.castShadow = true;
            leg.receiveShadow = true;

            if (i < 2) {
                leg.scale.set(2, 0.4, 0.8); // front legs
            }
            else {
                leg.scale.set(1.2, 0.4, 0.8); // back legs
                leg.rotateY(THREE.MathUtils.DEG2RAD * 90);
            }      

            // Move the leg mesh so its top sits at the pivot
           leg.position.set(...legPositions[i]); // stays centered under pivot

            // Add mesh to pivot
            pivot.add(leg);
             
            // Add BVH helper to mesh
            this.addBVHHelper(leg);

            // Store pivot for animation
            this.legs.push(pivot);
        }



        // ---------------- EYES ----------------
        const eyeGeo = new THREE.SphereGeometry(this.bodyRadius * 0.1, 8, 8);
        eyeGeo.computeBoundsTree();

        const eyeMat = new THREE.MeshStandardMaterial({ color: 0xffffff });

        this.leftEye = new THREE.Mesh(eyeGeo, eyeMat);
        this.rightEye = new THREE.Mesh(eyeGeo, eyeMat);

        this.leftEye.position.set(-this.bodyRadius * 0.5, this.bodyRadius * 0.3, this.bodyRadius * 0.7);
        this.rightEye.position.set(this.bodyRadius * 0.5, this.bodyRadius * 0.3, this.bodyRadius * 0.7);

        this.head.add(this.leftEye);
        this.head.add(this.rightEye);

        this.addBVHHelper(this.leftEye);
        this.addBVHHelper(this.rightEye);


        // ---------------- BOUNDING BOX ----------------
        this.box = new THREE.Box3().setFromObject(this, true);
        this.boxHelper = new THREE.Box3Helper(this.box, 0xff0000);
        this.boxHelper.visible = false;
        this.boxHelper.layers.set(1);
        this.add(this.boxHelper);
    }

    // ---------------------------------------------------------
    // Animation update
    // ---------------------------------------------------------
    update(delta) {
        this.time += delta;

        // Head bobbing
        this.head.position.y = Math.sin(this.time * 1.5) * 0.05;

        // Shell sway
        this.shell.rotation.z = Math.sin(this.time * 1.5) * 0.05;

        for (let i = 0; i < this.legs.length; i++) {
            const pivot = this.legs[i];
            const phase = i % 2 === 0 ? 0 : Math.PI;
            pivot.rotation.z = Math.sin(this.time * 3 + phase) * 0.1;
        }


    }
}

export { MyTurtle };
