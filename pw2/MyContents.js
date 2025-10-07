import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';

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
        const floorMaterial = new THREE.MeshPhongMaterial({map: this.floorTexture, color: "#ffffffff", shininess: 2000, specular: "#ffffff"});
        this.planeMesh = new THREE.Mesh(floorGeometry, floorMaterial);
        this.planeMesh.rotation.x = -Math.PI / 2;
        this.planeMesh.position.y = -0;
        this.app.scene.add(this.planeMesh);

    }   

    update(){

    }
}

export { MyContents };