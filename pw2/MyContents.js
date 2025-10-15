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


    const floorSize = 50;
    const floorSegments = 128;
    const floorGeometry = new THREE.PlaneGeometry(floorSize, floorSize, floorSegments, floorSegments);

    const positions = floorGeometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const z = positions.getY(i); 
        const height = 0.4 * Math.sin(x * 0.3) * Math.cos(z * 0.3) + (Math.random() - 0.5) * 0.1;
        positions.setZ(i, height); 
    }
    positions.needsUpdate = true;
    floorGeometry.computeVertexNormals();

    const floorMaterial = new THREE.MeshPhongMaterial({
        color: 0xC2B280,   // sand color
        shininess: 8,
        specular: 0x222222,
    });

    this.floor = new THREE.Mesh(floorGeometry, floorMaterial);
    this.floor.rotation.x = -Math.PI / 2;
    this.floor.receiveShadow = true;
    this.app.scene.add(this.floor);


        //we can use groups to create some more complex geometry with groups of rocks and corals
        //we should use groups to aggregate fishes of the same species

        const rock = new MyRock(0.5,0.5,0.5,"#4c4747");
        //this.app.scene.add(rock);

        const seaPlant = new MySeaPlant(0.1,2,0.05, "#00ff00");
        this.app.scene.add(seaPlant);
        seaPlant.position.set(1,0,1);

        const seaStar = new MySeaStar(0.1,0.2,"#ff0000");
        this.app.scene.add(seaStar);
        seaStar.position.set(2,0,2);

        const waterGeometry = new THREE.BoxGeometry(floorSize * 4, 20, floorSize * 4);
        const jelyFish = new MyJellyFish(0.5, 1);
        this.app.scene.add(jelyFish);
        jelyFish.position.set(0,5,0);

        const crab = new MyCrab();
        this.app.scene.add(crab);
        crab.position.set(3,0,1);

        const waterMaterial = new THREE.MeshPhongMaterial({
            color: 0x336688,   
            transparent: true,
            opacity: 0.3,      
            side: THREE.BackSide, 
        });
        const water = new THREE.Mesh(waterGeometry, waterMaterial);
        water.position.set(0, 9.5, 0); 
        this.app.scene.add(water);


        const carpBody = new MyCarp(1, 1, 1, 1, "#88ccff");
        this.app.scene.add(carpBody);

        this.bubbles = [];
        for (let i = 0; i < 10; i++) {
            const bubble = new MyBubble(0.10 + Math.random() * 0.08, 1); 
            this.app.scene.add(bubble);
            this.bubbles.push(bubble);
        }
        console.log(carpBody.length)
        const fishGroup = new MySchoolfOfFish(10, 0.5, 1,0.2, "Carp", 1,1,1,1);
        this.app.scene.add(fishGroup);
        fishGroup.position.set(-10,1,-10);

        const rockGroup = new MyRockGroup(10, 0.01, 1, 0.01, ["#4c4747", "#292727", "#8c8989"]);
        this.app.scene.add(rockGroup)
        rockGroup.position.set(10,0,-10);

        /* Triangle Example with texture 
        
        const texture = new THREE.TextureLoader().load('./textures/uv_grid_opengl.jpg' ); 
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        const material = new THREE.MeshBasicMaterial( { map:texture } );

        //Triangle 1
        const triangleGeo1 = new MyTriangle(0, 0, 0, 1, 0, 0, 0, 1, 0);
        const mesh1 = new THREE.Mesh(triangleGeo1, material);
        mesh1.scale.set(3,3,1);
        mesh1.position.set(-3, 0,0);

        this.app.scene.add(mesh1);

        */
        const coral = new MyCoral();
        const coralMesh = coral.createObject(4); // Pass a complexity value (1–6)
        coralMesh.position.y = 0;
        coralMesh.position.x = 1;
        this.app.scene.add(coralMesh); 

        const coralReef = new MyCoralReef();
        coralReef.position.y = 0;
        this.app.scene.add(coralReef);


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