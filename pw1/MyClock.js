import * as THREE from 'three';

/**
 * This class represents a clock
 */
class MyClock extends THREE.Object3D {
    /**
     * 
     * @param {number} radius Clock width
     * @param {number} depth clock depth
     * @param {string} frameColor Color of the frame
     * @param {string} hansdColor Color of the clock hands frame
     */
    constructor(radius = 0.5, depth = 0.1, frameColor = "#ffffff", handsColor = "#000000") {
        super();

        //clock body
        const frameMaterial = new THREE.MeshPhongMaterial({ color: frameColor});
        const clockTexture = new THREE.TextureLoader().load('./textures/clock.jpeg');
        const frontMaterial = new THREE.MeshPhongMaterial({ map: clockTexture });
        const materials = [frameMaterial, frontMaterial, frameMaterial]; // Order: side, top, bottom
        const clockGeometry = new THREE.CylinderGeometry(radius, radius, depth);
        const clockMesh = new THREE.Mesh(clockGeometry, materials);
        this.add(clockMesh);

        //clock hands
        const handMaterial = new THREE.MeshPhongMaterial({color: handsColor});
        const hourHandGeometry = new THREE.BoxGeometry(radius * 0.4, 0.01,0.04);
        const hourhand = new THREE.Mesh(hourHandGeometry, handMaterial);
        hourhand.rotation.y = Math.PI / 2;
        hourhand.position.y = depth / 2 + 0.02;
        hourhand.position.z = radius * 0.4 / 2

        const minuteHandGeometry = new THREE.BoxGeometry(radius * 0.6, 0.01,0.04);
        const minutehand = new THREE.Mesh(minuteHandGeometry, handMaterial);
        minutehand.position.y = depth / 2 + 0.02;
        minutehand.position.x = radius * 0.6 / 2

        this.add(hourhand);
        this.add(minutehand);


    }
}

export { MyClock };
