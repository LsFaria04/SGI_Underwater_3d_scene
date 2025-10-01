import * as THREE from 'three';

/**
 * This class represents a painting 
 */
class MyPainting extends THREE.Object3D {
    /**
     * 
     * @param {number} width Painting width
     * @param {number} height Painting height
     * @param {THREE.Texture} photoTexture The photo to include in the painting
     */
    constructor(width = 0.5, height = 2, photoTexture) {
        super();

        const frameMaterial = new THREE.MeshPhongMaterial({ color: "#ffffff" });

        // frame horizontal
        const frameHorizontalGeometry = new THREE.BoxGeometry(width + 0.1, 0.1, 0.1);
        const frameHorizontal1 = new THREE.Mesh(frameHorizontalGeometry, frameMaterial);
        this.add(frameHorizontal1);

        const frameHorizontal2 = new THREE.Mesh(frameHorizontalGeometry, frameMaterial);
        frameHorizontal2.position.y = frameHorizontal1.position.y + height;
        this.add(frameHorizontal2);

        //frame vertical
        const frameVerticalGeometry = new THREE.BoxGeometry(0.1, height, 0.1);
        const frameVertical1 = new THREE.Mesh(frameVerticalGeometry, frameMaterial);
        frameVertical1.position.y = height / 2;
        frameVertical1.position.x = - width / 2;
        this.add(frameVertical1);

        const frameVertical2 = new THREE.Mesh(frameVerticalGeometry, frameMaterial);
        frameVertical2.position.y = height / 2;
        frameVertical2.position.x = width / 2;
        this.add(frameVertical2);
        
        // photo
        const photoMaterial = new THREE.MeshPhongMaterial({map:photoTexture});
        const photoGeometry = new THREE.PlaneGeometry(width, height);
        const photo = new THREE.Mesh(photoGeometry, photoMaterial);
        photo.position.y = height / 2;
        this.add(photo);
        /*
        const backrestHeight = height * 5;
        const backrestGeometry = new THREE.BoxGeometry(width, backrestHeight, height);
        const backrestMaterial = seatMaterial;
        const backrest = new THREE.Mesh(backrestGeometry, backrestMaterial);
        backrest.position.set(0, legHeight + backrestHeight / 2, depth / 2 - height / 2); // backrest at back of seat
        this.add(backrest);
        */

    }
}

export { MyPainting };
