import * as THREE from 'three';

class MySeaStar extends THREE.Object3D {
    constructor(radius = 0.1, height = 0.2, color = "#ff0000", starTexture){
        super();
        
        //star geometry
        const starArmGeometry = new THREE.CylinderGeometry(radius, radius / 3, height);
        const armTipGeometry = new THREE.SphereGeometry(radius /3 ,8, 8, Math.PI, Math.PI );
        const starBodyGeometry = new THREE.CylinderGeometry(radius /2, radius / 2, radius * 2, 5);

        //star arm 
        const starMaterial = new THREE.MeshPhongMaterial({color: color, map: starTexture ? starTexture : null});
        const starArm = new THREE.Mesh(starArmGeometry, starMaterial);

        //star arm tip
        const starTip = new THREE.Mesh(armTipGeometry, starMaterial);
        starTip.rotation.x = -Math.PI / 2;
        starTip.position.y = -height / 2;

        //star body
        const starBody = new THREE.Mesh(starBodyGeometry, starMaterial);

        //creates a group with the star arm and tip
        const arm = new THREE.Group();
        arm.add(starArm);
        arm.add(starTip);


        arm.rotation.x = Math.PI / 2;
        arm.position.z = -(height / 2 + radius / 3);

        //clone the original group to form the other arms
        for(let i = 0; i < 5; i++){
            const arm2 = arm.clone();
            arm2.rotation.x = Math.PI / 2;
            arm2.position.z = -(height / 2 + radius / 3);

            //pivot to help rotate with a given point
            const pivot = new THREE.Group();
            pivot.position.set(0,0,0)
            pivot.add(arm2);
            this.add(pivot);
            pivot.rotation.y = THREE.MathUtils.degToRad( i * 72);
           
        }
        
        this.add(arm);
        this.add(starBody);
        
    }
}

export{ MySeaStar};