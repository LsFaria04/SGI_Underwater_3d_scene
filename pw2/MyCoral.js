import * as THREE from 'three';

class MyCoral extends THREE.Object3D {
    constructor(radius = 1, height = 1, color = "#000000", coralTexture){
        super();
        
        const coralGeometry = new THREE.CylinderGeometry(radius, radius, height);
        const coralMaterial = new THREE.MeshPhongMaterial({color: color, map: coralTexture ? coralTexture : null});
        const coral = new THREE.Mesh(coralGeometry, coralMaterial);
        coral.position.y = height / 2;

        this.add(coral);
    }
}

export{ MyCoral};