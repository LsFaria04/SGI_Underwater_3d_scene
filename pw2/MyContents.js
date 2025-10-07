import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
<<<<<<< HEAD
import { MyCarp} from './MyCarp.js';
=======
import { MyBubble } from './MyBubble.js';
>>>>>>> 5964d23092a06ee8edc7dea38be8f1beb5c7b41d

/**
 *  This class contains the contents of out application
 */
class MyContents  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app) {
        this.axis = null;
        this.app = app
    }

    // initializes the scene contents
    init() {
        this.initLights();
        this.initObjects();
        this.initTextures();
    }

    initLights() {

        // add an ambient light and make it pure red
        const ambientLight = new THREE.AmbientLight( 0xffffff, 2); // soft white light
        this.app.scene.add( ambientLight );
    }

    initObjects() {
        // create once 
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this)
            this.app.scene.add(this.axis)
        }

        const floorGeometry = new THREE.PlaneGeometry(10, 10);
        const floorMaterial = new THREE.MeshPhongMaterial({map: this.floorTexture, color: "#ad8554", shininess: 2000, specular: "#ffffff"});
        this.planeMesh = new THREE.Mesh(floorGeometry, floorMaterial);
        this.planeMesh.rotation.x = -Math.PI / 2;
        this.planeMesh.position.y = -0;
        this.app.scene.add(this.planeMesh);

        const carpBody = new MyCarp(10,10, "0xffffff");
        this.app.scene.add(carpBody);

        this.bubbles = [];
        for (let i = 0; i < 10; i++) {
            const bubble = new MyBubble(0.10 + Math.random() * 0.08, 1); 
            this.app.scene.add(bubble);
            this.bubbles.push(bubble);
        }

    }

    initTextures() {
        
    }

    update(delta) {
        if (!delta) return;
        for (const b of this.bubbles) b.update(delta);
    }
}

export { MyContents };