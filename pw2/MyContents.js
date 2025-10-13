import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyRock } from './MyRock.js';

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

        const floorGeometry = new THREE.PlaneGeometry(50, 50);
        const floorMaterial = new THREE.MeshPhongMaterial({color: "#ffffff", shininess: 2000, specular: "#ffffff"});
        this.floor = new THREE.Mesh(floorGeometry, floorMaterial);
        this.floor.rotation.x = -Math.PI / 2;
        this.app.scene.add(this.floor);

        //we can use groups to create some more complex geometry with groups of rocks and corals
        //we should use groups to aggregate fishes of the same species

        const rock = new MyRock(1,1,1,"#4c4747");
        rock.rotation.x = Math.PI / 2;
        this.floor.add(rock);

    }   

    update(){

    }
}

export { MyContents };