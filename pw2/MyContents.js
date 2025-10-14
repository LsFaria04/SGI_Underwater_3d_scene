import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyCarp} from './MyCarp.js';
import { MyBubble } from './MyBubble.js';
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

        const floorGeometry = new THREE.PlaneGeometry(50, 50);
        const floorMaterial = new THREE.MeshPhongMaterial({color: "#ffffff", shininess: 5, specular: "#ffffff"});
        this.floor = new THREE.Mesh(floorGeometry, floorMaterial);
        this.floor.rotation.x = -Math.PI / 2;
        this.app.scene.add(this.floor);

        //we can use groups to create some more complex geometry with groups of rocks and corals
        //we should use groups to aggregate fishes of the same species

        const rock = new MyRock(1,1,1,"#4c4747");
        rock.rotation.x = Math.PI / 2;
        this.floor.add(rock);

        const waterGeometry = new THREE.BoxGeometry(50, 20, 50);
        const waterMaterial = new THREE.MeshPhongMaterial({
            color: 0x336688,   
            transparent: true,
            opacity: 0.3,      
            side: THREE.BackSide, 
        });
        const water = new THREE.Mesh(waterGeometry, waterMaterial);
        water.position.set(0, 10.01, 0); 
        this.app.scene.add(water);


        const carpBody = new MyCarp(10,10, "#88ccff");
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