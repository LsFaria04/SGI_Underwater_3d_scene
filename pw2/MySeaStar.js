import * as THREE from 'three';

class MySeaStar extends THREE.Object3D {
    constructor(radius = 0.1, height = 0.2, color = "#ff0000", starTexture){
        super();
        
        //star geometry
        const starArmGeometry = new THREE.CylinderGeometry(radius, radius / 3, height);
        const armTipGeometry = new THREE.SphereGeometry(radius /3 ,32, 32, Math.PI, Math.PI );
        const starBodyGeometry = new THREE.SphereGeometry(radius);

        //star arm 
        const starMaterial = new THREE.MeshPhongMaterial({color: color, map: starTexture ? starTexture : null});
        const starArm = new THREE.Mesh(starArmGeometry, starMaterial);
        starArm.position.y = height / 2;

        //star arm tip
        const starTip = new THREE.Mesh(armTipGeometry, starMaterial);
        starTip.rotation.x = -Math.PI / 2;

        //star body
        const starBody = new THREE.Mesh(starBodyGeometry, starMaterial);
        starBody.position.y = height + radius / 2;

        //creates a group with the star arm and tip
        const arm = new THREE.Group();
        arm.add(starArm);
        arm.add(starTip);

        //clone the original group to form the other arms
        const arm2 = arm.clone();
        const arm3 = arm.clone();
        const arm4 = arm.clone();
        const arm5 = arm.clone();

        arm.rotation.x = Math.PI / 2;
        arm.position.z = radius / 2;

        arm2.rotation.x = Math.PI / 2;
        arm2.rotation.y = Math.PI * (360 / 5) / 180;
        arm2.rotation.z = radius /2;
        

        this.add(arm);
        this.add(arm2);
        this.add(starBody);
        
    }
}

export{ MySeaStar};