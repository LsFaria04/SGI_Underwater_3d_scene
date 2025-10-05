import * as THREE from 'three';

/**
 * This class represents a painting 
 */
class MyPainting extends THREE.Object3D {
    /**
     * 
     * @param {number} width Painting width
     * @param {number} height Painting height
     * @param {number} frameWidth Painting frame width
     * @param {THREE.Texture} photoTexture The photo to include in the painting
     * @param {string} frameColor Color of the painting frame
     */
    constructor(width = 0.5, height = 2, frameWidth = 0.1,  photoTexture, frameColor = "#ffffff") {
        super();

        const frameMaterial = new THREE.MeshPhongMaterial({ color: frameColor});

        // frame horizontal
        const frameHorizontalGeometry = new THREE.BoxGeometry(width + frameWidth, frameWidth, 0.1);
        const frameHorizontal1 = new THREE.Mesh(frameHorizontalGeometry, frameMaterial);
        this.add(frameHorizontal1);

        const frameHorizontal2 = new THREE.Mesh(frameHorizontalGeometry, frameMaterial);
        frameHorizontal2.position.y = frameHorizontal1.position.y + height;
        this.add(frameHorizontal2);

        //frame vertical
        const frameVerticalGeometry = new THREE.BoxGeometry(frameWidth, height, 0.1);
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

        //inserts a spotlight into the painting
        const spotlight = new THREE.SpotLight( 0xffffff, 2);
        spotlight.position.set( 0, height, frameWidth/ 2);
        spotlight.target.position.set( 0, 0, 0);
        spotlight.angle = Math.PI / 3; 
        spotlight.penumbra = 0.8;          
        spotlight.decay = 0.5;              
        spotlight.distance = height * 2; 
        this.add( spotlight );
        this.add( spotlight.target );
    }
}

export { MyPainting };
