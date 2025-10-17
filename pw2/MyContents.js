import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyCarp} from './MyCarp.js';
import { MyBubble } from './MyBubble.js';
import { MyRock } from './MyRock.js';
import { MyCoral } from './MyCoral.js';
import { MySeaPlant } from './MySeaPlant.js';
import { MySeaStar } from './MySeaStar.js';
import { MyJellyFish } from './MyJellyFish.js';
import { MyCrab } from './MyCrab.js';
import { MySchoolfOfFish } from './MySchoolOfFish.js';
import { MyRockGroup } from './MyRockGroup.js';
import { MyCoralGroup } from './MyCoralGroup.js';
//import {MyTriangle} from './MyTriangle.js';
import { MyCoralReef } from './MyCoralReef.js';
import { MyFloor } from './MyFloor.js';
import { MyWater } from './MyWater.js';
import { MySeaUrchin } from './MySeaUrchin.js';


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
        this.axisEnabled = false;
        this.app = app
    }

    // initializes the scene contents
    init() {
        this.initLights();
        this.initObjects();
        this.initTextures();
    }

    initLights() {

        const ambientLight = new THREE.AmbientLight(0x88aaff, 0.5);
        this.app.scene.add( ambientLight );

        // directional light to simulate sun from above
        const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
        directionalLight.position.set(10, 20, 10);
        this.app.scene.add(directionalLight);

    }

    initObjects() {
        // create once 
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this)
            //this.app.scene.add(this.axis)
            
        }

        this.app.scene.fog = new THREE.FogExp2(0x003366, 0.03);

        const floor = new MyFloor();
        this.app.scene.add(floor);

        const water = new MyWater();
        this.app.scene.add(water);


        //we can use groups to create some more complex geometry with groups of rocks and corals
        //we should use groups to aggregate fishes of the same species

        const seaPlant = new MySeaPlant(0.1,2,0.05, "#00ff00");
        this.app.scene.add(seaPlant);
        seaPlant.position.set(1,0,1);

        const seaStar = new MySeaStar(0.1,0.2,"#ff0000");
        this.app.scene.add(seaStar);
        seaStar.position.set(2,0.25,2);

        const jelyFish = new MyJellyFish(0.5, 1);
        this.app.scene.add(jelyFish);
        jelyFish.position.set(0,5,0);

        const crab = new MyCrab();
        this.app.scene.add(crab);
        crab.position.set(3,0.3,1);

        const carpBody = new MyCarp(1, 1, 1, 1, "#88ccff");
        this.app.scene.add(carpBody);

        this.bubbles = [];
        for (let i = 0; i < 10; i++) {
            const bubble = new MyBubble(0.10 + Math.random() * 0.08, 1); 
            this.app.scene.add(bubble);
            this.bubbles.push(bubble);
        }
       
        const fishGroup = new MySchoolfOfFish(10, 0.5, 1,0.2, "Carp", 1,1,1,1);
        this.app.scene.add(fishGroup);
        fishGroup.position.set(-10,1,-10);

        const rockGroup = new MyRockGroup(100, 0.1, 1, 0.5, ["#4c4747", "#292727", "#8c8989"], false);
        this.app.scene.add(rockGroup)
        rockGroup.position.set(10,0,-10);

        const coral = new MyCoral();
        const coralReef1 = new MyCoralReef(5, "fanCoral");
        coralReef1.position.y = 0;
        this.app.scene.add(coralReef1);

        const coralReef2 = new MyCoralReef();
        coralReef2.position.y = 0;
        this.app.scene.add(coralReef2);

        const seaUrchin = new MySeaUrchin();
        seaUrchin.position.set(4, 0.3, 4);
        this.app.scene.add(seaUrchin);


    }

    initTextures() {
        
    }

    update(delta) {
        if (!delta) return;
        for (const b of this.bubbles) b.update(delta);
    }

    setWireframeMode(enabled) {
        this.app.scene.traverse((child) => {
            if (child.isMesh && child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach((mat) => (mat.wireframe = enabled));
                } else {
                    child.material.wireframe = enabled;
                }
            }
        });
    }

    toggleAxis(enabled) {
        this.axisEnabled = enabled;

        // If axis doesn't exist yet, create it
        if (!this.axis && enabled) {
            this.axis = new MyAxis(this);
        }

        if (enabled) {
            this.app.scene.add(this.axis);
        } else {
            if (this.axis) {
                this.app.scene.remove(this.axis);
            }
        }
    }
}

export { MyContents };