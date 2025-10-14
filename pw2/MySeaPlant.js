import * as THREE from 'three';

class MySeaPlant extends THREE.Object3D {
    constructor(width = 0.2, height = 1, depth = 0.05, color = "#000000", plantTexture){
        super();
        
        const plantGeometry = new THREE.BoxGeometry(width, height, depth);
        const plantMaterial = new THREE.MeshPhongMaterial({color: color, map: plantTexture ? plantTexture : null});
        const plant = new THREE.Mesh(plantGeometry, plantMaterial);
        plant.position.y = height / 2;

        this.add(plant);
    }
}

export{ MySeaPlant};