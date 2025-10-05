import * as THREE from 'three';

/**
 * This class represents a door 
 */
class MyDoor extends THREE.Object3D {
    /**
     * 
     * @param {number} width Door width
     * @param {number} height Door height
     * @param {number} frameWidth Door frame width
     * @param {THREE.Texture} doorTexture Texture of the door
     * @param {string} frameColor Color of the painting frame
     */
    constructor(width = 0.5, height = 2, frameWidth = 0.2,  doorTexture, frameColor = "#ffffff") {
        super();

        const frameMaterial = new THREE.MeshPhongMaterial({ color: frameColor});

        // frame horizontal
        //the bottom frame has a bigger depth
        const frameHorizontalGeometry = new THREE.BoxGeometry(width + frameWidth, frameWidth, 0.4);
        const frameHorizontal1 = new THREE.Mesh(frameHorizontalGeometry, frameMaterial);
        frameHorizontal1.position.z = 0.2;
        this.add(frameHorizontal1);

        const frameHorizontalGeometry2 = new THREE.BoxGeometry(width + frameWidth, frameWidth, 0.2);
        const frameHorizontal2 = new THREE.Mesh(frameHorizontalGeometry2, frameMaterial);
        frameHorizontal2.position.y = frameHorizontal1.position.y + height;
        this.add(frameHorizontal2);

        //frame vertical
        const frameVerticalGeometry = new THREE.BoxGeometry(frameWidth, height, 0.2);
        const frameVertical1 = new THREE.Mesh(frameVerticalGeometry, frameMaterial);
        frameVertical1.position.y = height / 2;
        frameVertical1.position.x = - width / 2;
        this.add(frameVertical1);

        const frameVertical2 = new THREE.Mesh(frameVerticalGeometry, frameMaterial);
        frameVertical2.position.y = height / 2;
        frameVertical2.position.x = width / 2;
        this.add(frameVertical2);
        
        // door Texture
        const textureMaterial = new THREE.MeshPhongMaterial({map:doorTexture});
        const textureGeometry = new THREE.PlaneGeometry(width, height);
        const texture = new THREE.Mesh(textureGeometry, textureMaterial);
        texture.position.y = height / 2;
        this.add(texture);

        //door handle
        const handleMaterial = new THREE.MeshPhongMaterial({color: "#606060", specular: "#ffffff", shininess: 50});
        const handleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.5);
        const doorhandle = new THREE.Mesh(handleGeometry, handleMaterial);
        doorhandle.position.y = height / 2;
        doorhandle.position.x = - width / 2 + width * 0.1 + 0.25 ;
        doorhandle.position.z = 0.25;
        doorhandle.rotation.z = Math.PI / 2;

        const handle2Geometry = new THREE.CylinderGeometry(0.05, 0.05, 0.2);
        const doorhandle2 = new THREE.Mesh(handle2Geometry, handleMaterial);
        doorhandle2.position.y = height / 2;
        doorhandle2.position.x = - width / 2 + width * 0.1 + 0.05;
        doorhandle2.position.z = 0.15;
        doorhandle2.rotation.x = Math.PI / 2;

        this.add(doorhandle);
        this.add(doorhandle2);

        

    }
}

export { MyDoor };
