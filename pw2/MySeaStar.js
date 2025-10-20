import * as THREE from 'three';
/**
 * TThis class represents a sea star
 */
class MySeaStar extends THREE.Object3D {
    /**
     * 
     * @param {*} radius Radius of the sea star
     * @param {*} height Height of the sea star
     * @param {*} color  Color of the sea star
     * @param {*} starTexture  Texture of the sea star
     */
    constructor(radius = 0.1, height = 0.2, color = "#ff0000", starTexture, LOD){
        super();

        this.radius = radius;
        this.height = height;
        this.color = color;
        this.starTexture = starTexture;

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
        //Just a simple box geometry

        const starGeometry = new THREE.BoxGeometry(this.height * 2, this.height, this.height * 2);
        const starMaterial = new THREE.MeshPhongMaterial({color: this.color, map: this.starTexture ? this.starTexture : null});
        const star = new THREE.Mesh(starGeometry, starMaterial);
        this.add(star);
    }

    initMediumLOD(){

        //No arm tip and less detail in the arms and body

        //star geometry
        const starArmGeometry = new THREE.CylinderGeometry(this.radius, this.radius / 3, this.height, 5,5);
        const starBodyGeometry = new THREE.CylinderGeometry(this.radius /2, this.radius / 2, this.radius * 2, 5,5);

        //star arm 
        const starMaterial = new THREE.MeshPhongMaterial({color: this.color, map: this.starTexture ? this.starTexture : null});
        const starArm = new THREE.Mesh(starArmGeometry, starMaterial);


        //star body
        const starBody = new THREE.Mesh(starBodyGeometry, starMaterial);

        //creates a group with the star arm and tip
        const arm = new THREE.Group();
        arm.add(starArm);


        arm.rotation.x = Math.PI / 2;
        arm.position.z = -(this.height / 2 + this.radius / 3);

        //clone the original group to form the other arms
        for(let i = 0; i < 5; i++){
            const arm2 = arm.clone();
            arm2.rotation.x = Math.PI / 2;
            arm2.position.z = -(this.height / 2 + this.radius / 3);

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

    initHighLOD(){
        //star geometry
        const starArmGeometry = new THREE.CylinderGeometry(this.radius, this.radius / 3, this.height);
        const armTipGeometry = new THREE.SphereGeometry(this.radius /3 ,8, 8, Math.PI, Math.PI );
        const starBodyGeometry = new THREE.CylinderGeometry(this.radius /2, this.radius / 2, this.radius * 2, 5);

        //star arm 
        const starMaterial = new THREE.MeshPhongMaterial({color: this.color, map: this.starTexture ? this.starTexture : null});
        const starArm = new THREE.Mesh(starArmGeometry, starMaterial);

        //star arm tip
        const starTip = new THREE.Mesh(armTipGeometry, starMaterial);
        starTip.rotation.x = -Math.PI / 2;
        starTip.position.y = -this.height / 2;

        //star body
        const starBody = new THREE.Mesh(starBodyGeometry, starMaterial);

        //creates a group with the star arm and tip
        const arm = new THREE.Group();
        arm.add(starArm);
        arm.add(starTip);


        arm.rotation.x = Math.PI / 2;
        arm.position.z = -(this.height / 2 + this.radius / 3);

        //clone the original group to form the other arms
        for(let i = 0; i < 5; i++){
            const arm2 = arm.clone();
            arm2.rotation.x = Math.PI / 2;
            arm2.position.z = -(this.height / 2 + this.radius / 3);

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