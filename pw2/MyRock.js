import * as THREE from 'three';

/**
 * Rock texture
 */
class MyRock extends THREE.Object3D {
    /**
     * 
     * @param {*} width Rock width
     * @param {*} height Rock height
     * @param {*} depth Rock depth
     * @param {*} color Rock color
     * @param {*} rockTexture Rock texture
     */
    constructor(width = 1, height = 1, depth = 1, color = "#000000", rockTexture){
        super();

        this.width = width;
        this.height = height;
        this.depth = depth;
        this.rockTexture = rockTexture;
        
        const rockGeometry = new THREE.BoxGeometry(width, height, depth);
        const rockMaterial = new THREE.MeshPhongMaterial({color: color, map: rockTexture ? rockTexture : null});
        const rock = new THREE.Mesh(rockGeometry, rockMaterial);
        rock.position.y = height / 2;

        this.add(rock);
    }
}

export{ MyRock};