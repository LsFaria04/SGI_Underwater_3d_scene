import * as THREE from 'three';

class MyBubble extends THREE.Object3D {
    /**
     * 
     * @param {number} radius Bubble radius
     * @param {number} startY Bubble start Y position
     */

    constructor(radius = 0.5, startY = 0) {
        super();

        const bubbleMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.5,
            shininess: 100,
        }); 

        const bubbleGeometry = new THREE.SphereGeometry(radius, 16, 16);
        this.bubble = new THREE.Mesh(bubbleGeometry, bubbleMaterial);
        this.add(this.bubble);
        
        this.position.set(
            (Math.random() - 0.5) * 2, // random x
            startY,
            (Math.random() - 0.5) * 2  // random z
        );

        this.speed = 0.5 + Math.random() * 0.5; // upward speed
        this.startY = startY;
        this.maxY = 1.5; // surface level
    }

    update(delta) {
        if (!delta) return;

        this.position.y += this.speed * delta;

        // reset to bottom when reaching surface
        if (this.position.y > this.maxY) {
            this.position.y = this.startY;
            this.position.x = (Math.random() - 0.5) * 1.5;
            this.position.z = (Math.random() - 0.5) * 1.5;
        }
    }
}

export { MyBubble };
