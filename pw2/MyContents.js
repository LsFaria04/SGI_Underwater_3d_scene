import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyCarp} from './MyCarp.js';
import { MyBubble } from './MyBubble.js';

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

        const ambientLight = new THREE.AmbientLight(0x6688aa, 0.6); // soft blue light
        this.app.scene.add( ambientLight );

        // directional light to simulate sun from above
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
        directionalLight.position.set(5, 10, 5);
        this.app.scene.add(directionalLight);
    }

    initObjects() {
        // create once 
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this)
            this.app.scene.add(this.axis)
        }

        this.app.scene.fog = new THREE.FogExp2(0x003366, 0.12);

        const floorGeometry = new THREE.PlaneGeometry(50, 50);
        const floorMaterial = new THREE.MeshPhongMaterial({map: this.floorTexture, color: "998866  ", shininess: 2000, specular: "#ffffff"});
        this.planeMesh = new THREE.Mesh(floorGeometry, floorMaterial);
        this.planeMesh.rotation.x = -Math.PI / 2;
        this.planeMesh.position.y = -1.5;
        this.app.scene.add(this.planeMesh);

        const waterGeometry = new THREE.BoxGeometry(50, 20, 50);
        const waterMaterial = new THREE.MeshPhongMaterial({
            color: 0x336688,   
            transparent: true,
            opacity: 0.3,      
            side: THREE.BackSide, 
        });
        const water = new THREE.Mesh(waterGeometry, waterMaterial);
        water.position.set(0, 3, 0); 
        this.app.scene.add(water);


        const carpBody = new MyCarp(10,10, "0x88ccff");
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