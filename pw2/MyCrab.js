import * as THREE from 'three';

class MyCrab extends THREE.Object3D {
    constructor(width = 0.2, height = 0.2,depth = 0.1,  color = "#FF0000", crabTexture){
        super();
        
        const crabMaterial = new THREE.MeshPhongMaterial({color: color, map: crabTexture ? crabTexture : null});

        //body
        const bodyGeometry = new THREE.SphereGeometry(1, 24, 24);
        const body = new THREE.Mesh(bodyGeometry, crabMaterial);
        body.rotation.x = Math.PI / 2;
        body.scale.y = height * 0.3;
        body.scale.x = depth;
        body.scale.z = width;
        body.rotation.x = Math.PI;
        body.position.y = height * 0.8;

        this.add(body);

        //legs
        const toplegGeometry = new THREE.CylinderGeometry(depth * 0.2, depth * 0.1, height * 0.8  / 2);
        const topleg = new THREE.Mesh(toplegGeometry, crabMaterial);
        const bottomlegGeometry = new THREE.ConeGeometry(depth * 0.1, height * 0.8  / 2);
        const bottomleg = new THREE.Mesh(bottomlegGeometry, crabMaterial);
        const legJointGeometry = new THREE.SphereGeometry(depth * 0.1, 8, 8);
        const legJoint = new THREE.Mesh(legJointGeometry, crabMaterial);
        
        bottomleg.rotation.x = THREE.MathUtils.degToRad(-135);
        bottomleg.position.y = -height * 0.8  / 2;
        bottomleg.position.z = -Math.sin(THREE.MathUtils.degToRad(45)) * (height * 0.8  / 4);

        legJoint.position.y = -height * 0.8  / 4 - (depth * 0.1 / 2);

        const leg = new THREE.Group();
        leg.add(topleg);
        leg.add(bottomleg);
        leg.add(legJoint);
        const legsGroup = new THREE.Group();
        legsGroup.add(leg);

        leg.position.y = height / 2;
        leg.position.z = width / 2 + depth * 0.2;
        
        leg.rotation.x = THREE.MathUtils.degToRad(-45);

        const spaceBetweenLegs = depth * 0.7 * 2 / 4;
        leg.position.x = depth * 0.7 - spaceBetweenLegs;

        //left legs
        for(let i = 2; i < 4; i++){
            const legCopy = leg.clone();
            legCopy.position.x = depth * 0.7 - spaceBetweenLegs * i;
            console.log(legCopy.position.x)
    
            legsGroup.add(legCopy);
        }

        this.add(legsGroup);

        //right legs
        const rightLegs = legsGroup.clone();
        rightLegs.scale.x = -1;
        rightLegs.scale.z = -1;
        this.add(rightLegs);

        //eyes
        const eyeGeometry = new THREE.SphereGeometry(width * 0.1, 8, 8);
        const eyeMaterial = new THREE.MeshPhongMaterial({color: "#000000"});
        const eyeBall = new THREE.Mesh(eyeGeometry, eyeMaterial);

        const eyeSupportGeometry = new THREE.CylinderGeometry(width * 0.05, width * 0.05, height * 0.3);
        const eyeSupport = new THREE.Mesh(eyeSupportGeometry, crabMaterial);

        eyeBall.position.y = height * 0.3 / 2 + width * 0.05 / 2;

        const eye = new THREE.Group();
        eye.add(eyeBall);
        eye.add(eyeSupport);

        eye.position.y = height + height * 0.3 / 2;
        eye.position.x = depth * 0.6;
        eye.position.z = width * 0.4;
        this.add(eye);
        

        const righteye = eye.clone();
        righteye.position.z *= -1;
        this.add(righteye);

        //claws
        const topClawGeometry = new THREE.CylinderGeometry(depth * 0.2, depth * 0.1, height * 0.8  / 2);
        const topClaw = new THREE.Mesh(topClawGeometry, crabMaterial);
        const bottomClawGeometry = new THREE.SphereGeometry(depth * 0.2, 8, 8); 
        const bottomClaw = new THREE.Mesh(bottomClawGeometry, crabMaterial);

        bottomClaw.position.y = - depth * 0.2 - depth * 0.2;

        const claw = new THREE.Group();
        claw.add(topClaw);
        claw.add(bottomClaw);

        claw.rotation.z = THREE.MathUtils.degToRad(90);
        claw.position.y = height - depth * 0.2;
        claw.position.x = depth * 1.1;
        claw.position.z = width * 0.4;

        this.add(claw);

        const rightClaw = claw.clone();
        rightClaw.position.z *= -1;

        this.add(rightClaw);

        
       
    }
}

export{MyCrab};