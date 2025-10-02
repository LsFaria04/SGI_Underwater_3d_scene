import * as THREE from 'three';

/**
 * This class represents a window 
 */
class MyExitSign extends THREE.Object3D {
    /**
     * 
     * @param {number} width Sign width
     * @param {number} height Sign height
     */
    constructor(width = 1, height = 0.5, exitSignTexture) {
        super();

        const frameMaterial = new THREE.MeshPhongMaterial({ color: "#ffffff"});
        const frameWidth = 0.05;
        const frameDepth = 0.1;
        
        // frame horizontal
        const frameHorizontalGeometry = new THREE.BoxGeometry(width + frameWidth * 2, frameWidth, frameDepth);
        const frameHorizontal1 = new THREE.Mesh(frameHorizontalGeometry, frameMaterial);
        this.add(frameHorizontal1);

        const frameHorizontalGeometry2 = new THREE.BoxGeometry(width + frameWidth * 2, frameWidth, frameDepth);
        const frameHorizontal2 = new THREE.Mesh(frameHorizontalGeometry2, frameMaterial);
        frameHorizontal2.position.y = frameWidth + height;
        this.add(frameHorizontal2);

        //frame vertical
        const frameVerticalGeometry = new THREE.BoxGeometry(frameWidth, height, frameDepth);
        const frameVertical1 = new THREE.Mesh(frameVerticalGeometry, frameMaterial);
        frameVertical1.position.y = height / 2 + frameWidth / 2;
        frameVertical1.position.x = - width / 2 - frameWidth / 2;
        this.add(frameVertical1);

        const frameVertical2 = new THREE.Mesh(frameVerticalGeometry, frameMaterial);
        frameVertical2.position.y = height / 2 + frameWidth / 2;
        frameVertical2.position.x = width / 2 + frameWidth / 2;
        this.add(frameVertical2);
        
        // Sign
        const exitTexture = exitSignTexture;
        const signMaterial = new THREE.MeshPhongMaterial({map:exitTexture, color: 0xffffff,  emissive: 0x222222, emissiveMap:exitTexture, emissiveIntensity: 20});
        const signGeometry = new THREE.PlaneGeometry(width, height);
        const sign = new THREE.Mesh(signGeometry, signMaterial);
        sign.position.y = height / 2 + frameWidth / 2;
        sign.position.z = frameDepth / 2;
        this.add(sign);

    }
}

export { MyExitSign };
