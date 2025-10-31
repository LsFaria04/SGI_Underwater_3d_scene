import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyBubble } from './MyBubble.js';
import { MySeaStar } from './MySeaStar.js';
import { MyJellyFish } from './MyJellyFish.js';
import { MyCrab } from './MyCrab.js';
import { MySchoolfOfFish } from './MySchoolOfFish.js';
import { MyRockGroup } from './MyRockGroup.js';
import { MyCoralReef } from './MyCoralReef.js';
import { MyFloor } from './MyFloor.js';
import { MyWater } from './MyWater.js';
import { MySeaUrchin } from './MySeaUrchin.js';
import { MyTurtle } from './MyTurtle.js';
import { MySeaPlantGroup } from './MySeaPlantsGroup.js';
import { My2DShark } from './My2DShark.js';
import { MySign } from './MySign.js';
import { MyShark } from './MyShark.js';
import { MySwordFish } from './MySwordFish.js';
import { MySeaPlant } from './MySeaPlant.js';
import { MyKeyFrameAnimation } from './MyKeyframeAnimation.js';


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
        this.initTextures();
        this.initObjects(); 
    }

    initLights() {

        const ambientLight = new THREE.AmbientLight(0x88aaff, 0.5);
        this.app.scene.add( ambientLight );

        // directional light to simulate sun from above
        const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
        directionalLight.position.set(10, 20, 10);
        directionalLight.castShadow = true;
        directionalLight.shadow.camera.left = -20;
        directionalLight.shadow.camera.right = 20;
        directionalLight.shadow.camera.top = 20;
        directionalLight.shadow.camera.bottom = -20;
        directionalLight.shadow.camera.near = 1;
        directionalLight.shadow.camera.far = 100;
       
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

        const floor = new MyFloor(50, 128, this.sandTexture);
        this.app.scene.add(floor);

        const water = new MyWater();
        this.app.scene.add(water);

        //plant position and size [x, z, number of plants]
        const plantGroupsPosSize = [[-20, -1, 100], [1, 8, 50], [10,5, 10]];
        this.seaPlantGroups = [];
        for(let i = 0; i < plantGroupsPosSize.length; i++){
            const pos = plantGroupsPosSize[i];
            const seaPlantGroup = new MySeaPlantGroup(pos[2], 0.2, 1, 0.1, ["#3a6c3a", "#5b6c3a","#6e783e" ], true);
            this.app.scene.add(seaPlantGroup);
            this.seaPlantGroups.push(seaPlantGroup);
            seaPlantGroup.position.set(pos[0],0,pos[1]);
        }
        

        const seaStarLOD = new THREE.LOD();
        const seaStar = new MySeaStar(0.1,0.2,"#ff0000", undefined, "H");
        const seaStarMid = new MySeaStar(0.1,0.2,"#ff0000", undefined, "M");
        const seaStarLow = new MySeaStar(0.1,0.2,"#ff0000", undefined, "L");
        seaStarLOD.addLevel(seaStar, 0);
        seaStarLOD.addLevel(seaStarMid, 5);
        seaStarLOD.addLevel(seaStarLow, 20);
        this.app.scene.add(seaStarLOD);
        seaStarLOD.position.set(2,0.25,2);

        const jelyFishLOD = new THREE.LOD();
        const jelyFish = new MyJellyFish(0.5, 1, undefined, undefined, "H");
        const jelyFishMedium = new MyJellyFish(0.5, 1, undefined, undefined, "M");
        const jelyFishLow = new MyJellyFish(0.5, 1, undefined, undefined, "L");
        jelyFishLOD.addLevel(jelyFish, 0);
        jelyFishLOD.addLevel(jelyFishMedium, 15);
        jelyFishLOD.addLevel(jelyFishLow, 30);
        this.app.scene.add(jelyFishLOD);
        jelyFishLOD.position.set(0,5,0);

        const crabLOD = new THREE.LOD();
        const crab = new MyCrab(0.2,0.2,0.1, "#FF0000", null, "L");
        const crabDetailed = new MyCrab(0.2,0.2,0.1, "#FF0000", null, "H");
        const crabMediumDetailed = new MyCrab(0.2,0.2,0.1, "#FF0000", null, "M");
        crabLOD.addLevel(crab, 20);
        crabLOD.addLevel(crabDetailed, 0);
        crabLOD.addLevel(crabMediumDetailed, 5);
        this.app.scene.add(crabLOD);
        crabLOD.position.set(3,0.3,1);

        this.bubbles = [];
        for (let i = 0; i < 10; i++) {
            const bubble = new MyBubble(0.10 + Math.random() * 0.08, 1); 
            this.app.scene.add(bubble);
            this.bubbles.push(bubble);
        }
        
        //carps position and size [x, y, z, number of carps]
        const carpsGroupsPosSize = [[-10, 1, -10, 10], [10, 1, 5, 5]];
        this.fishGroups = [];
        for(let i = 0; i < carpsGroupsPosSize.length; i++){
            const pos = carpsGroupsPosSize[i];
            const fishGroup = new MySchoolfOfFish(pos[3], 0.5, 1,0.2, "Carp", 1,1,1,1);
            this.app.scene.add(fishGroup);
            this.fishGroups.push(fishGroup);
            fishGroup.position.set(pos[0],pos[1],pos[2]);
        }

        

        //rock position and size [x, z, number of rocks]
        const rockPosSize = [[15, -15, 4], [-10, -10, 6], [5, 8, 2], [-12, 15, 10], [-1, 15, 1], [1, 4, 3], [-10, 4, 8], [3, -4, 3], [15, 15, 10], [20, 5, 10], [-20, -6, 10], [0, -20, 20]];
        for(let i = 0; i < rockPosSize.length; i++){
            const pos = rockPosSize[i];
            const rockGroup = new MyRockGroup(pos[2], 0.1, 1, 0.5, ["#4c4747", "#292727", "#8c8989"], true, [this.rockTexture, this.rockTexture2]);
            rockGroup.position.set(pos[0],0,pos[1]);
            this.app.scene.add(rockGroup);
        }
        

        const coralReef1 = new MyCoralReef(40, "fanCoral", 20, 4);
        coralReef1.position.y = 0;
        this.app.scene.add(coralReef1);

        const coralReef2 = new MyCoralReef(40, "branchingCoral", 20, 4);
        coralReef2.position.y = 0;
        this.app.scene.add(coralReef2);

        const urchinLOD = new THREE.LOD();
        const seaUrchin = new MySeaUrchin(0.1, 0.5, 100, "#000000", "L");
        const seaUrchinMid = new MySeaUrchin(0.1, 0.5, 100, "#000000", "M");
        const seaUrchinHigh = new MySeaUrchin(0.1, 0.5, 100, "#000000", "H");
        urchinLOD.addLevel(seaUrchin, 20);
        urchinLOD.addLevel(seaUrchinMid, 10);
        urchinLOD.addLevel(seaUrchinHigh, 0);
        urchinLOD.position.set(4, 0.3, 4);
        this.app.scene.add(urchinLOD);

        const turtle = new MyTurtle(0.5, 0.15);
        turtle.position.set(-4, 0.3, 4);
        this.app.scene.add(turtle);
        
        this.shark = new MyShark();
        this.shark.position.set(-8, 10, 0);
        this.app.scene.add(this.shark);

        const sign = new MySign();
        sign.position.set(0,0,15);
        sign.scale.set(2,2,2);
        this.app.scene.add(sign);

        const twoDShark = new My2DShark();
        twoDShark.scale.set(0.2, 0.2, 0.2);
        twoDShark.position.set(-0.8, 0.5, sign.board.geometry.parameters.depth / 2 + 0.01); //slightly in front of the board
        sign.board.add(twoDShark);

        this.swordFish = new MySwordFish(1,3,1,1.5,"#545f7f");
        this.swordFish.position.set(0,3,0);
        this.app.scene.add(this.swordFish);
        
        
        this.animationShark = new MyKeyFrameAnimation(this.shark, "random", 2,50, 30);
        this.animationSwordFish = new MyKeyFrameAnimation(this.swordFish, "circle", 10,50, 60);

        this.fishGroupsAnimations = []
        for (const fishGroup of this.fishGroups){
            this.fishGroupsAnimations.push(fishGroup.getAnimations());
        }

    }

    initTextures() {
        this.rockTexture = new THREE.TextureLoader().load("./textures/Rock1.jpeg");
        this.rockTexture2 = new THREE.TextureLoader().load("./textures/Rock2.jpg");

        this.sandTexture = new THREE.TextureLoader().load("./textures/sand.jpg");
    }

    update(delta) {
        if (!delta) return;
        for (const b of this.bubbles) b.update(delta);
        this.swordFish.update(delta);
        this.shark.update(delta);
        
        // Update all fish groups (carps) - skeletal animation
        for(const fishGroup of this.fishGroups) {
            fishGroup.update(delta);
        }
        
        //update the animation in the sea plants
        for(const plantGroup of this.seaPlantGroups) plantGroup.update(delta);

        // Update keyframe animations
        this.animationShark.update(delta);
        this.animationSwordFish.update(delta);
        
        for (const fishAnimations of this.fishGroupsAnimations) {
            for (const animation of fishAnimations) animation.update(delta);
        }

        // Update all LOD objects with the active camera
        this.app.scene.traverse((child) => {
            if (child instanceof THREE.LOD) {
                child.update(this.app.activeCamera);
            }
        });
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