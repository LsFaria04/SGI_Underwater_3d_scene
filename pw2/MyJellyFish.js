import * as THREE from 'three';
/**
 * This class represents a jellyFish
 */
class MyJellyFish extends THREE.Object3D {
    /**
     * 
     * @param {*} radius Jellyfish body radius
     * @param {*} height JellyFish Height 
     * @param {*} color  JellyFish color
     * @param {*} jellyFishTexture JellyFish Texture
     */
    constructor(radius = 1, height = 2, color = "#0000FF", jellyFishTexture, LOD){
        super();

        this.radius = radius;
        this.height = height;
        this.color = color;
        this.jellyFishTexture = jellyFishTexture;
        

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
        //Simplified format using boxes instead of spheres and cylinders

        const jellyFishMaterial = new THREE.MeshPhongMaterial({color: this.color, map: this.jellyFishTexture || null, transparent: true, opacity: 0.6, shininess: 100});

        //head
        const headGeometry = new THREE.BoxGeometry(this.radius, this.radius, this.radius);
        const head = new THREE.Mesh(headGeometry, jellyFishMaterial);
        
        this.add(head);

        head.position.y = this.height - this.radius;

        //tentacles
        const tentacleGeometry = new THREE.BoxGeometry(this.radius * 0.1, this.height - this.radius, this.radius * 0.1);
        const tentacle = new THREE.Mesh(tentacleGeometry, jellyFishMaterial);
        tentacle.position.y = (this.height - this.radius) / 2;
        tentacle.position.z = 0;
        tentacle.position.x = this.radius * 0.6;
        
        const tentacles = new THREE.Group();
        tentacles.add(tentacle);

        //creates three copies of the tentacles
        let anglestep = 360 / 5;
        let angle = anglestep;
        for(let i = 0; i < 5; i++){
            const copyTentacle = tentacle.clone();
            copyTentacle.position.set(Math.cos(THREE.MathUtils.degToRad(angle + (anglestep * i))) * this.radius * 0.6,(this.height - this.radius) / 2 , Math.sin(THREE.MathUtils.degToRad(angle + (anglestep * i))) * this.radius * 0.6);
            tentacles.add(copyTentacle);
        }

        this.add(tentacles);
    
    }

    initMediumLOD(){
        //Less segments in the spheres and cylinders for medium detail. No transperency also

        const jellyFishMaterial = new THREE.MeshPhongMaterial({color: this.color, map: this.jellyFishTexture || null});

        //head
        const headGeometry = new THREE.SphereGeometry(this.radius, 5, 5, Math.PI, Math.PI);
        const headTop = new THREE.Mesh(headGeometry, jellyFishMaterial);
        headTop.rotation.x = Math.PI / 2;

        const headBottomGeometry = new THREE.CircleGeometry(this.radius, 5);
        const headBottom = new THREE.Mesh(headBottomGeometry, jellyFishMaterial);
        headBottom.rotation.x = Math.PI / 2;
        
        const head = new THREE.Group();
        head.add(headTop);
        head.add(headBottom);
        this.add(head);

        head.position.y = this.height - this.radius;

        //tentacles
        const tentacleGeometry = new THREE.CylinderGeometry(this.radius * 0.1, this.radius * 0.1, this.height - this.radius, 4);
        const tentacle = new THREE.Mesh(tentacleGeometry, jellyFishMaterial);
        tentacle.position.y = (this.height - this.radius) / 2;
        tentacle.position.z = 0;
        tentacle.position.x = this.radius * 0.6;
        
        const tentacles = new THREE.Group();
        tentacles.add(tentacle);

        //creates three copies of the tentacles
        let anglestep = 360 / 5;
        let angle = anglestep;
        for(let i = 0; i < 5; i++){
            const copyTentacle = tentacle.clone();
            copyTentacle.position.set(Math.cos(THREE.MathUtils.degToRad(angle + (anglestep * i))) * this.radius * 0.6,(this.height - this.radius) / 2 , Math.sin(THREE.MathUtils.degToRad(angle + (anglestep * i))) * this.radius * 0.6);
            tentacles.add(copyTentacle);
        }

        this.add(tentacles);
    
    }

    initHighLOD(){
        const jellyFishMaterial = new THREE.MeshPhongMaterial({color: this.color, map: this.jellyFishTexture || null, transparent: true, opacity: 0.6, shininess: 100});

        //head
        const headGeometry = new THREE.SphereGeometry(this.radius, 16, 12, Math.PI, Math.PI);
        const headTop = new THREE.Mesh(headGeometry, jellyFishMaterial);
        headTop.rotation.x = Math.PI / 2;

        const headBottomGeometry = new THREE.CircleGeometry(this.radius, 16);
        const headBottom = new THREE.Mesh(headBottomGeometry, jellyFishMaterial);
        headBottom.rotation.x = Math.PI / 2;
        
        const head = new THREE.Group();
        head.add(headTop);
        head.add(headBottom);
        this.add(head);

        head.position.y = this.height - this.radius;

        //tentacles
        const tentacleGeometry = new THREE.CylinderGeometry(this.radius * 0.1, this.radius * 0.1, this.height - this.radius, 8);
        const tentacle = new THREE.Mesh(tentacleGeometry, jellyFishMaterial);
        tentacle.position.y = (this.height - this.radius) / 2;
        tentacle.position.z = 0;
        tentacle.position.x = this.radius * 0.6;
        
        const tentacles = new THREE.Group();
        tentacles.add(tentacle);

        //creates three copies of the tentacles
        let anglestep = 360 / 5;
        let angle = anglestep;
        for(let i = 0; i < 5; i++){
            const copyTentacle = tentacle.clone();
            copyTentacle.position.set(Math.cos(THREE.MathUtils.degToRad(angle + (anglestep * i))) * this.radius * 0.6,(this.height - this.radius) / 2 , Math.sin(THREE.MathUtils.degToRad(angle + (anglestep * i))) * this.radius * 0.6);
            tentacles.add(copyTentacle);
        }

        this.add(tentacles);
    }
}

export{MyJellyFish};