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
    constructor(radius = 1, height = 2, color = "#0000FF", jellyFishTexture){
        super();
        
        const jellyFishMaterial = new THREE.MeshPhongMaterial({color: color, map: jellyFishTexture || null, transparent: true, opacity: 0.6, shininess: 100});

        //head
        const headGeometry = new THREE.SphereGeometry(radius, 16, 12, Math.PI, Math.PI);
        const headTop = new THREE.Mesh(headGeometry, jellyFishMaterial);
        headTop.rotation.x = Math.PI / 2;

        const headBottomGeometry = new THREE.CircleGeometry(radius, 16);
        const headBottom = new THREE.Mesh(headBottomGeometry, jellyFishMaterial);
        headBottom.rotation.x = Math.PI / 2;
        
        const head = new THREE.Group();
        head.add(headTop);
        head.add(headBottom);
        this.add(head);

        head.position.y = height - radius;

        //tentacles
        const tentacleGeometry = new THREE.CylinderGeometry(radius * 0.1, radius * 0.1, height - radius, 8);
        const tentacle = new THREE.Mesh(tentacleGeometry, jellyFishMaterial);
        tentacle.position.y = (height - radius) / 2;
        tentacle.position.z = 0;
        tentacle.position.x = radius * 0.6;
        
        const tentacles = new THREE.Group();
        tentacles.add(tentacle);

        //creates three copies of the tentacles
        let anglestep = 360 / 5;
        let angle = anglestep;
        for(let i = 0; i < 5; i++){
            const copyTentacle = tentacle.clone();
            copyTentacle.position.set(Math.cos(THREE.MathUtils.degToRad(angle + (anglestep * i))) * radius * 0.6,(height - radius) / 2 , Math.sin(THREE.MathUtils.degToRad(angle + (anglestep * i))) * radius * 0.6);
            tentacles.add(copyTentacle);
        }

        this.add(tentacles);
    }
}

export{MyJellyFish};