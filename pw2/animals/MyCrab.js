import * as THREE from 'three';
import { MeshBVHHelper } from '../index.module.js';

/**
 * This class represents a crab
 */
class MyCrab extends THREE.Object3D {
     /**
     * 
     * @param {number} width Crab width
     * @param {number} height Crab height (not including the eyes)
     * @param {number} depth Crab body depth
     * @param {color} color Crab body color
     * @param {crabTexture} crabTexture Texture applied to the crab's body
     * @param {string} LOD LEvel of detail ("L", "M", "H") 
     */
    constructor(width = 0.2, height = 0.2,depth = 0.1,  color = "#FF0000", crabTexture, LOD){
        super();
        
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.color = color;
        this.crabTexture = crabTexture;
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

    initLowLOD(){
        //only the body is visible with low detail
        const crabMaterial = new THREE.MeshPhongMaterial({color: this.color, map: this.crabTexture ? this.crabTexture : null});

        //body
        const bodyGeometry = new THREE.BoxGeometry(this.width, this.height, this.depth);
        const body = new THREE.Mesh(bodyGeometry, crabMaterial);
        body.rotation.x = Math.PI / 2;
        body.position.y = this.height  / 2;

        this.add(body);

        bodyGeometry.computeBoundsTree();

        const helper = new MeshBVHHelper(body);
        helper.visible = false;
        this.add(helper);
        this.helpers.push(helper);
    }

    initMediumLOD(){
        //Medium details with no claws, simple eyes and less rounded body and legs

        const crabMaterial = new THREE.MeshPhongMaterial({color: this.color, map: this.crabTexture ? this.crabTexture : null});

        //body
        const bodyGeometry = new THREE.SphereGeometry(1, 5, 5);
        const body = new THREE.Mesh(bodyGeometry, crabMaterial);
        body.rotation.x = Math.PI / 2;
        body.scale.y = this.height * 0.3;
        body.scale.x = this.depth;
        body.scale.z = this.width;
        body.rotation.x = Math.PI;
        body.position.y = this.height * 0.8;

        this.add(body);

        bodyGeometry.computeBoundsTree();

        const helper = new MeshBVHHelper(body);
        helper.visible = false;
        this.add(helper);
        this.helpers.push(helper);

        //legs
        const toplegGeometry = new THREE.CylinderGeometry(this.depth * 0.2, this.depth * 0.1, this.height * 0.8  / 2, 5,2);
        const topleg = new THREE.Mesh(toplegGeometry, crabMaterial);
        const bottomlegGeometry = new THREE.ConeGeometry(this.depth * 0.1, this.height * 0.8  / 2, 5,2);
        const bottomleg = new THREE.Mesh(bottomlegGeometry, crabMaterial);

        toplegGeometry.computeBoundsTree();
        bottomlegGeometry.computeBoundsTree();

        const helper3 = new MeshBVHHelper(bottomleg);
        helper3.visible = false;
        this.add(helper3);
        this.helpers.push(helper3);
        const helper4 = new MeshBVHHelper(topleg);
        helper4.visible = false;
        this.add(helper4);
        this.helpers.push(helper4);
        
        bottomleg.rotation.x = THREE.MathUtils.degToRad(-135);
        bottomleg.position.y = -this.height * 0.8  / 2;
        bottomleg.position.z = -Math.sin(THREE.MathUtils.degToRad(45)) * (this.height * 0.8  / 4);

        const leg = new THREE.Group();
        leg.add(topleg);
        leg.add(bottomleg);
        const legsGroup = new THREE.Group();
        legsGroup.add(leg);

        leg.position.y = this.height / 2;
        leg.position.z = this.width / 2 + this.depth * 0.2;
        
        leg.rotation.x = THREE.MathUtils.degToRad(-45);

        const spaceBetweenLegs = this.depth * 0.7 * 2 / 4;
        leg.position.x = this.depth * 0.7 - spaceBetweenLegs;

        //left legs
        for(let i = 2; i < 4; i++){
            const legCopy = leg.clone();
            legCopy.position.x = this.depth * 0.7 - spaceBetweenLegs * i;
            legsGroup.add(legCopy);
        }

        this.add(legsGroup);

        //right legs
        const rightLegs = legsGroup.clone();
        rightLegs.scale.x = -1;
        rightLegs.scale.z = -1;
        this.add(rightLegs);

        //eyes
        const eyeGeometry = new THREE.BoxGeometry(this.width * 0.15, this.width * 0.15, this.width * 0.15);
        const eyeMaterial = new THREE.MeshPhongMaterial({color: "#000000"});
        const eyeBall = new THREE.Mesh(eyeGeometry, eyeMaterial);

        eyeGeometry.computeBoundsTree();

        const helper5 = new MeshBVHHelper(eyeBall);
        helper5.visible = false;
        this.add(helper5);
        this.helpers.push(helper5);

        const eyeSupportGeometry = new THREE.BoxGeometry(this.width * 0.05, this.height * 0.3, this.width * 0.05);
        const eyeSupport = new THREE.Mesh(eyeSupportGeometry, crabMaterial);

        eyeSupportGeometry.computeBoundsTree();
        
        const helper6 = new MeshBVHHelper(eyeSupport);
        helper6.visible = false;
        this.add(helper6);
        this.helpers.push(helper6);


        eyeBall.position.y = this.height * 0.3 / 2 + this.width * 0.05 / 2;

        const eye = new THREE.Group();
        eye.add(eyeBall);
        eye.add(eyeSupport);

        eye.position.y = this.height + this.height * 0.3 / 2;
        eye.position.x = this.depth * 0.6;
        eye.position.z = this.width * 0.4;
        this.add(eye);
        

        const righteye = eye.clone();
        righteye.position.z *= -1;
        this.add(righteye);

        const claw = new THREE.Group();

        const armGeom = new THREE.CylinderGeometry(this.depth * 0.1, this.depth * 0.15, this.height * 0.6, 5, 1);
        const arm = new THREE.Mesh(armGeom, crabMaterial);
        arm.rotation.z = Math.PI / 2;
        arm.position.x = this.height * 0.3;
        claw.add(arm);

        armGeom.computeBoundsTree();
        
        const helper7 = new MeshBVHHelper(arm);
        helper7.visible = false;
        this.add(helper7);
        this.helpers.push(helper7);

        claw.position.set(this.depth*1.1 - 0.02, this.height - this.depth*0.2, this.width*0.4);

        const rightClaw = claw.clone();
        rightClaw.position.z *= -1;

        this.add(rightClaw);
        this.add(claw);

    }

    initHighLOD(){
        const crabMaterial = new THREE.MeshPhongMaterial({color: this.color, map: this.crabTexture ? this.crabTexture : null});

        //body
        const bodyGeometry = new THREE.SphereGeometry(1, 24, 24);
        const body = new THREE.Mesh(bodyGeometry, crabMaterial);
        body.rotation.x = Math.PI / 2;
        body.scale.y = this.height * 0.3;
        body.scale.x = this.depth;
        body.scale.z = this.width;
        body.rotation.x = Math.PI;
        body.position.y = this.height * 0.8;

        this.add(body);

        bodyGeometry.computeBoundsTree();

        const helper = new MeshBVHHelper(body);
        helper.visible = false;
        this.add(helper);
        this.helpers.push(helper);

        //legs
        const toplegGeometry = new THREE.CylinderGeometry(this.depth * 0.2, this.depth * 0.1, this.height * 0.8  / 2);
        const topleg = new THREE.Mesh(toplegGeometry, crabMaterial);
        const bottomlegGeometry = new THREE.ConeGeometry(this.depth * 0.1, this.height * 0.8  / 2);
        const bottomleg = new THREE.Mesh(bottomlegGeometry, crabMaterial);
        const legJointGeometry = new THREE.SphereGeometry(this.depth * 0.1, 8, 8);
        const legJoint = new THREE.Mesh(legJointGeometry, crabMaterial);

        toplegGeometry.computeBoundsTree();
        bottomlegGeometry.computeBoundsTree();
        legJointGeometry.computeBoundsTree();

        const helper3 = new MeshBVHHelper(bottomleg);
        helper3.visible = false;
        this.add(helper3);
        this.helpers.push(helper3);
        const helper4 = new MeshBVHHelper(topleg);
        helper4.visible = false;
        this.add(helper4);
        this.helpers.push(helper4);
        const helper8 = new MeshBVHHelper(legJoint);
        helper8.visible = false;
        this.add(helper8);
        this.helpers.push(helper8);
        
        bottomleg.rotation.x = THREE.MathUtils.degToRad(-135);
        bottomleg.position.y = -this.height * 0.8  / 2;
        bottomleg.position.z = -Math.sin(THREE.MathUtils.degToRad(45)) * (this.height * 0.8  / 4);

        legJoint.position.y = -this.height * 0.8  / 4 - (this.depth * 0.1 / 2);

        const leg = new THREE.Group();
        leg.add(topleg);
        leg.add(bottomleg);
        leg.add(legJoint);
        const legsGroup = new THREE.Group();
        legsGroup.add(leg);

        leg.position.y = this.height / 2;
        leg.position.z = this.width / 2 + this.depth * 0.2;
        
        leg.rotation.x = THREE.MathUtils.degToRad(-45);

        const spaceBetweenLegs = this.depth * 0.7 * 2 / 4;
        leg.position.x = this.depth * 0.7 - spaceBetweenLegs;

        //left legs
        for(let i = 2; i < 4; i++){
            const legCopy = leg.clone();
            legCopy.position.x = this.depth * 0.7 - spaceBetweenLegs * i;
    
            legsGroup.add(legCopy);
        }

        this.add(legsGroup);

        //right legs
        const rightLegs = legsGroup.clone();
        rightLegs.scale.x = -1;
        rightLegs.scale.z = -1;
        this.add(rightLegs);

        //eyes
        const eyeGeometry = new THREE.SphereGeometry(this.width * 0.1, 8, 8);
        const eyeMaterial = new THREE.MeshPhongMaterial({color: "#000000"});
        const eyeBall = new THREE.Mesh(eyeGeometry, eyeMaterial);

        eyeGeometry.computeBoundsTree()

        const helper5 = new MeshBVHHelper(eyeBall);
        helper5.visible = false;
        this.add(helper5);
        this.helpers.push(helper5);


        const eyeSupportGeometry = new THREE.CylinderGeometry(this.width * 0.05, this.width * 0.05, this.height * 0.3);
        const eyeSupport = new THREE.Mesh(eyeSupportGeometry, crabMaterial);

        eyeSupportGeometry.computeBoundsTree();
        
        const helper6 = new MeshBVHHelper(eyeSupport);
        helper6.visible = false;
        this.add(helper6);
        this.helpers.push(helper6);

        eyeBall.position.y = this.height * 0.3 / 2 + this.width * 0.05 / 2;

        const eye = new THREE.Group();
        eye.add(eyeBall);
        eye.add(eyeSupport);

        eye.position.y = this.height + this.height * 0.3 / 2;
        eye.position.x = this.depth * 0.6;
        eye.position.z = this.width * 0.4;
        this.add(eye);
        

        const righteye = eye.clone();
        righteye.position.z *= -1;
        this.add(righteye);

        //claws
        const claw = new THREE.Group();

        const armGeom = new THREE.CylinderGeometry(this.depth * 0.1, this.depth * 0.15, this.height * 0.6, 8);
        const arm = new THREE.Mesh(armGeom, crabMaterial);
        arm.rotation.z = Math.PI / 2;
        arm.position.x = this.height * 0.3;
        claw.add(arm);

        armGeom.computeBoundsTree();
        
        const helper7 = new MeshBVHHelper(arm);
        helper7.visible = false;
        this.add(helper7);
        this.helpers.push(helper7);

        const hingeGeom = new THREE.SphereGeometry(this.depth * 0.12, 8, 8);
        const hinge = new THREE.Mesh(hingeGeom, crabMaterial);
        hinge.position.x = this.height * 0.6 - 0.005;
        claw.add(hinge);

        hingeGeom.computeBoundsTree();
        
        const helper9 = new MeshBVHHelper(hinge);
        helper9.visible = false;
        this.add(helper9);
        this.helpers.push(helper9);

        const upperGeom = new THREE.ConeGeometry(this.depth*0.15, this.height*0.4, 8);
        const upperJaw = new THREE.Mesh(upperGeom, crabMaterial);
        upperJaw.rotation.z = Math.PI / 2 + Math.PI / 12; 
        upperJaw.position.set(0, this.depth*0.06, 0);
        hinge.add(upperJaw);

        upperGeom.computeBoundsTree();
        
        const helper10 = new MeshBVHHelper(upperJaw);
        helper10.visible = false;
        this.add(helper10);
        this.helpers.push(helper10);

        const lowerGeom = new THREE.ConeGeometry(this.depth*0.12, this.height*0.35, 8);
        const lowerJaw = new THREE.Mesh(lowerGeom, crabMaterial);
        lowerJaw.rotation.z = Math.PI / 2 - Math.PI / 12;   
        lowerJaw.position.set(0, -this.depth*0.06, 0); 
        hinge.add(lowerJaw);

        lowerGeom.computeBoundsTree();
        
        const helper11 = new MeshBVHHelper(lowerJaw);
        helper11.visible = false;
        this.add(helper11);
        this.helpers.push(helper11);

        claw.position.set(this.depth*1.1 - 0.02, this.height - this.depth*0.2, this.width*0.4);

        this.add(claw);

        const rightClaw = claw.clone();
        rightClaw.position.z *= -1;

        this.add(rightClaw);
    }
}

export{MyCrab};