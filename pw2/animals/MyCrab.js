import * as THREE from 'three';
import { MeshBVHHelper } from '../index.module.js';

/**
 * This class represents a crab
 */
class MyCrab extends THREE.LOD {
     /**
     * 
     * @param {number} width Crab width
     * @param {number} height Crab height (not including the eyes)
     * @param {number} depth Crab body depth
     * @param {*} color Crab body color
     * @param {*} crabTexture Texture applied to the crab's body
     */
    constructor(width = 0.2, height = 0.2,depth = 0.1,  color = "#FF0000", crabTexture){
        super();
        
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.color = color;
        this.crabTexture = crabTexture;
        this.helpers = [];

        this.init();   
    }

    /**
     * Method to add a BVH helper to a mesh for visualization.
     * @param {THREE.Mesh} mesh 
     */
    addBVHHelper(mesh) {
        const helper = new MeshBVHHelper(mesh);
        helper.visible = false;
        mesh.add(helper);        // attach helper INSIDE the mesh hierarchy
        this.helpers.push(helper);
    }

    init(){

        //1.Detailed Crab (Level 0) - Distance 0
        this.detailedCrab = this.initHighLOD();
        this.addLevel(this.detailedCrab, 0);

        //2.Medium detailed Crab (Level 1) - Distance 5
        this.mediumCrab = this.initMediumLOD();
        this.addLevel(this.mediumCrab, 5);

        //3. Simple detailed crab (Level 2) - Distance 20
        this.lowCrab = this.initLowLOD();
        this.addLevel(this.lowCrab, 20);

        this.box = new THREE.Box3().setFromObject(this, true);
        this.boxHelper = new THREE.Box3Helper(this.box, 0xff0000);
        this.boxHelper.visible = false;
        this.boxHelper.layers.set(1);
        this.add(this.boxHelper);

        
    }

    /**
     *  Low detail crab model
     * @returns {THREE.Object3D} Low detail crab model
     */
    initLowLOD() {
        const crab = new THREE.Object3D();

        // Only the body is visible in low detail
        const crabMaterial = new THREE.MeshPhongMaterial({
            color: this.color,
            map: this.crabTexture ? this.crabTexture : null
        });

        // Body
        const bodyGeometry = new THREE.BoxGeometry(
            this.width,
            this.height,
            this.depth
        );
        const body = new THREE.Mesh(bodyGeometry, crabMaterial);

        body.rotation.x = Math.PI / 2;
        body.position.y = this.height / 2;

        crab.add(body);

        bodyGeometry.computeBoundsTree();
        this.addBVHHelper(body);  

        return crab;
    }

    /**
     * Medium detail crab model
     * @returns {THREE.Object3D} Medium detail crab model
     */
    initMediumLOD() {
        const crab = new THREE.Object3D();

        const crabMaterial = new THREE.MeshPhongMaterial({
            color: this.color,
            map: this.crabTexture ? this.crabTexture : null
        });

        // ===== BODY =====
        const bodyGeometry = new THREE.SphereGeometry(1, 5, 5);
        const body = new THREE.Mesh(bodyGeometry, crabMaterial);
        body.rotation.x = Math.PI / 2;
        body.scale.y = this.height * 0.3;
        body.scale.x = this.depth;
        body.scale.z = this.width;
        body.rotation.x = Math.PI;
        body.position.y = this.height * 0.8;

        bodyGeometry.computeBoundsTree();
        crab.add(body);

        // ===== LEGS (LEFT) =====
        const toplegGeometry = new THREE.CylinderGeometry(
            this.depth * 0.2,
            this.depth * 0.1,
            this.height * 0.8 / 2,
            5,
            2
        );
        const bottomlegGeometry = new THREE.ConeGeometry(
            this.depth * 0.1,
            this.height * 0.8 / 2,
            5,
            2
        );

        toplegGeometry.computeBoundsTree();
        bottomlegGeometry.computeBoundsTree();

        const topleg = new THREE.Mesh(toplegGeometry, crabMaterial);
        const bottomleg = new THREE.Mesh(bottomlegGeometry, crabMaterial);

        bottomleg.rotation.x = THREE.MathUtils.degToRad(-135);
        bottomleg.position.y = -this.height * 0.8 / 2;
        bottomleg.position.z =
            -Math.sin(THREE.MathUtils.degToRad(45)) * (this.height * 0.8 / 4);

        const leg = new THREE.Group();
        leg.add(topleg);
        leg.add(bottomleg);

        const legsGroup = new THREE.Group();
        legsGroup.add(leg);

        leg.position.y = this.height / 2;
        leg.position.z = this.width / 2 + this.depth * 0.2;
        leg.rotation.x = THREE.MathUtils.degToRad(-45);

        const spaceBetweenLegs = (this.depth * 0.7 * 2) / 4;
        leg.position.x = this.depth * 0.7 - spaceBetweenLegs;

        // left legs copies
        for (let i = 2; i < 4; i++) {
            const legCopy = leg.clone(true); // no helpers exist yet
            legCopy.position.x = this.depth * 0.7 - spaceBetweenLegs * i;
            legsGroup.add(legCopy);
        }

        crab.add(legsGroup);

        // ===== LEGS (RIGHT) =====
        const rightLegs = legsGroup.clone(true); // still safe, no helpers yet
        rightLegs.scale.x = -1;
        rightLegs.scale.z = -1;
        crab.add(rightLegs);

        // ===== EYES =====
        const eyeGeometry = new THREE.BoxGeometry(
            this.width * 0.15,
            this.width * 0.15,
            this.width * 0.15
        );
        const eyeMaterial = new THREE.MeshPhongMaterial({ color: "#000000" });
        const eyeBall = new THREE.Mesh(eyeGeometry, eyeMaterial);
        eyeGeometry.computeBoundsTree();

        const eyeSupportGeometry = new THREE.BoxGeometry(
            this.width * 0.05,
            this.height * 0.3,
            this.width * 0.05
        );
        const eyeSupport = new THREE.Mesh(eyeSupportGeometry, crabMaterial);
        eyeSupportGeometry.computeBoundsTree();

        eyeBall.position.y =
            (this.height * 0.3) / 2 + (this.width * 0.05) / 2;

        const eye = new THREE.Group();
        eye.add(eyeBall);
        eye.add(eyeSupport);

        eye.position.y = this.height + this.height * 0.3 / 2;
        eye.position.x = this.depth * 0.6;
        eye.position.z = this.width * 0.4;
        crab.add(eye);

        const righteye = eye.clone(true); // still no helpers
        righteye.position.z *= -1;
        crab.add(righteye);

        // ===== CLAWS (SIMPLE) =====
        const claw = new THREE.Group();

        const armGeom = new THREE.CylinderGeometry(
            this.depth * 0.1,
            this.depth * 0.15,
            this.height * 0.6,
            5,
            1
        );
        const arm = new THREE.Mesh(armGeom, crabMaterial);
        arm.rotation.z = Math.PI / 2;
        arm.position.x = this.height * 0.3;
        armGeom.computeBoundsTree();
        claw.add(arm);

        claw.position.set(
            this.depth * 1.1 - 0.02,
            this.height - this.depth * 0.2,
            this.width * 0.4
        );

        const rightClaw = claw.clone(true);
        rightClaw.position.z *= -1;

        crab.add(rightClaw);
        crab.add(claw);

        // ADD bvh helpers in the end
        crab.traverse(obj => {
            if (obj.isMesh) this.addBVHHelper(obj);
        });

        return crab;
    }

    /**
     * High detail crab model
     * @returns {THREE.Object3D} High detail crab model
     */
    initHighLOD() {
        const crab = new THREE.Object3D();

        const crabMaterial = new THREE.MeshPhongMaterial({
            color: this.color,
            map: this.crabTexture ? this.crabTexture : null
        });

        // ===== BODY =====
        const bodyGeometry = new THREE.SphereGeometry(1, 24, 24);
        const body = new THREE.Mesh(bodyGeometry, crabMaterial);
        body.rotation.x = Math.PI / 2;
        body.scale.y = this.height * 0.3;
        body.scale.x = this.depth;
        body.scale.z = this.width;
        body.rotation.x = Math.PI;
        body.position.y = this.height * 0.8;

        bodyGeometry.computeBoundsTree();
        crab.add(body);

        // ===== LEGS (LEFT) =====
        const toplegGeometry = new THREE.CylinderGeometry(
            this.depth * 0.2,
            this.depth * 0.1,
            this.height * 0.8 / 2
        );
        const bottomlegGeometry = new THREE.ConeGeometry(
            this.depth * 0.1,
            this.height * 0.8 / 2
        );
        const legJointGeometry = new THREE.SphereGeometry(this.depth * 0.1, 8, 8);

        toplegGeometry.computeBoundsTree();
        bottomlegGeometry.computeBoundsTree();
        legJointGeometry.computeBoundsTree();

        const topleg = new THREE.Mesh(toplegGeometry, crabMaterial);
        const bottomleg = new THREE.Mesh(bottomlegGeometry, crabMaterial);
        const legJoint = new THREE.Mesh(legJointGeometry, crabMaterial);

        bottomleg.rotation.x = THREE.MathUtils.degToRad(-135);
        bottomleg.position.y = -this.height * 0.8 / 2;
        bottomleg.position.z =
            -Math.sin(THREE.MathUtils.degToRad(45)) * (this.height * 0.8 / 4);

        legJoint.position.y =
            -this.height * 0.8 / 4 - this.depth * 0.1 / 2;

        const leg = new THREE.Group();
        leg.add(topleg);
        leg.add(bottomleg);
        leg.add(legJoint);

        const legsGroup = new THREE.Group();
        legsGroup.add(leg);

        leg.position.y = this.height / 2;
        leg.position.z = this.width / 2 + this.depth * 0.2;
        leg.rotation.x = THREE.MathUtils.degToRad(-45);

        const spaceBetweenLegs = (this.depth * 0.7 * 2) / 4;
        leg.position.x = this.depth * 0.7 - spaceBetweenLegs;

        // left legs copies
        for (let i = 2; i < 4; i++) {
            const legCopy = leg.clone(true);
            legCopy.position.x = this.depth * 0.7 - spaceBetweenLegs * i;
            legsGroup.add(legCopy);
        }

        crab.add(legsGroup);

        // ===== LEGS (RIGHT) =====
        const rightLegs = legsGroup.clone(true);
        rightLegs.scale.x = -1;
        rightLegs.scale.z = -1;
        crab.add(rightLegs);

        // ===== EYES =====
        const eyeGeometry = new THREE.SphereGeometry(this.width * 0.1, 8, 8);
        const eyeMaterial = new THREE.MeshPhongMaterial({ color: "#000000" });
        const eyeBall = new THREE.Mesh(eyeGeometry, eyeMaterial);
        eyeGeometry.computeBoundsTree();

        const eyeSupportGeometry = new THREE.CylinderGeometry(
            this.width * 0.05,
            this.width * 0.05,
            this.height * 0.3
        );
        const eyeSupport = new THREE.Mesh(eyeSupportGeometry, crabMaterial);
        eyeSupportGeometry.computeBoundsTree();

        eyeBall.position.y =
            (this.height * 0.3) / 2 + (this.width * 0.05) / 2;

        const eye = new THREE.Group();
        eye.add(eyeBall);
        eye.add(eyeSupport);

        eye.position.y = this.height + this.height * 0.3 / 2;
        eye.position.x = this.depth * 0.6;
        eye.position.z = this.width * 0.4;
        crab.add(eye);

        const righteye = eye.clone(true);
        righteye.position.z *= -1;
        crab.add(righteye);

        // ===== CLAWS =====
        const claw = new THREE.Group();

        const armGeom = new THREE.CylinderGeometry(
            this.depth * 0.1,
            this.depth * 0.15,
            this.height * 0.6,
            8
        );
        const arm = new THREE.Mesh(armGeom, crabMaterial);
        arm.rotation.z = Math.PI / 2;
        arm.position.x = this.height * 0.3;
        armGeom.computeBoundsTree();
        claw.add(arm);

        const hingeGeom = new THREE.SphereGeometry(this.depth * 0.12, 8, 8);
        const hinge = new THREE.Mesh(hingeGeom, crabMaterial);
        hinge.position.x = this.height * 0.6 - 0.005;
        hingeGeom.computeBoundsTree();
        claw.add(hinge);

        const upperGeom = new THREE.ConeGeometry(
            this.depth * 0.15,
            this.height * 0.4,
            8
        );
        const upperJaw = new THREE.Mesh(upperGeom, crabMaterial);
        upperJaw.rotation.z = Math.PI / 2 + Math.PI / 12;
        upperJaw.position.set(0, this.depth * 0.06, 0);
        upperGeom.computeBoundsTree();
        hinge.add(upperJaw);

        const lowerGeom = new THREE.ConeGeometry(
            this.depth * 0.12,
            this.height * 0.35,
            8
        );
        const lowerJaw = new THREE.Mesh(lowerGeom, crabMaterial);
        lowerJaw.rotation.z = Math.PI / 2 - Math.PI / 12;
        lowerJaw.position.set(0, -this.depth * 0.06, 0);
        lowerGeom.computeBoundsTree();
        hinge.add(lowerJaw);

        claw.position.set(
            this.depth * 1.1 - 0.02,
            this.height - this.depth * 0.2,
            this.width * 0.4
        );
        crab.add(claw);

        const rightClaw = claw.clone(true);
        rightClaw.position.z *= -1;
        crab.add(rightClaw);

        //Add all the BVH helpers in the end
        crab.traverse(obj => {
            if (obj.isMesh) this.addBVHHelper(obj);
        });

        return crab;
    }


}

export{MyCrab};