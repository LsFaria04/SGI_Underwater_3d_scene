import * as THREE from 'three';

/**
 * This class represents a window 
 */
class MyWindow extends THREE.Object3D {
    /**
     * 
     * @param {number} width Window width
     * @param {number} height Window height
     * @param {number} frameWidth Window frame width
     * @param {THREE.Texture} landscapeTexture The landscape visible in the window
     * @param {string} frameColor Color of the painting frame
     */
    constructor(width = 0.5, height = 2, frameWidth = 0.2,  landscapeTexture, frameColor = "#ffffff") {
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
        
        // landscape
        const landscapeMaterial = new THREE.MeshPhongMaterial({map:landscapeTexture, color: 0xffffff,  emissive: 0x222222});
        const landscapeGeometry = new THREE.PlaneGeometry(width, height);
        const landscape = new THREE.Mesh(landscapeGeometry, landscapeMaterial);
        landscape.position.y = height / 2;
        this.add(landscape);

    }
}

export { MyWindow };
