import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyBubble } from './objects/MyBubble.js';
import { MySeaStar } from './animals/MySeaStar.js';
import { MyJellyFish } from './animals/MyJellyFish.js';
import { MyCrab } from './animals/MyCrab.js';
import { MySchoolfOfFish } from './animals/MySchoolOfFish.js';
import { MyRockGroup } from './objects/MyRockGroup.js';
import { MyCoralReef } from './objects/MyCoralReef.js';
import { MyFloor } from './objects/MyFloor.js';
import { MyWater } from './objects/MyWater.js';
import { MySeaUrchin } from './animals/MySeaUrchin.js';
import { MyTurtle } from './animals/MyTurtle.js';
import { MySeaPlantGroup } from './objects/MySeaPlantsGroup.js';
import { My2DShark } from './animals/My2DShark.js';
import { MySign } from './objects/MySign.js';
import { MyShark } from './animals/MyShark.js';
import { MySwordFish } from './animals/MySwordFish.js';
import { MySeaPlant } from './objects/MySeaPlant.js';
import { MyKeyFrameAnimation } from './animations/MyKeyframeAnimation.js';
import { MySubmarine } from './objects/MySubmarine.js';
import { acceleratedRaycast } from './index.module.js';


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

        // Picking
        this.mouse = new THREE.Vector2();
        console.log(this.mouse)
        this.raycaster = new THREE.Raycaster();
        this.raycaster.firstHitOnly = true;
        this.object = null;

        this.onMouseClick = this.onMouseClick.bind(this);
        window.addEventListener('click', this.onMouseClick);
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
        directionalLight.shadow.camera.left = -40;
        directionalLight.shadow.camera.right = 40;
        directionalLight.shadow.camera.top = 40;
        directionalLight.shadow.camera.bottom = -40;
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
        

        this.seaStarLOD = new THREE.LOD();
        this.seaStar = new MySeaStar(0.1,0.2,"#ff0000", undefined, "H");
        const seaStarMid = new MySeaStar(0.1,0.2,"#ff0000", undefined, "M");
        const seaStarLow = new MySeaStar(0.1,0.2,"#ff0000", undefined, "L");
        this.seaStarLOD.addLevel(this.seaStar, 0);
        this.seaStarLOD.addLevel(seaStarMid, 5);
        this.seaStarLOD.addLevel(seaStarLow, 20);
        this.app.scene.add(this.seaStarLOD);
        this.seaStarLOD.position.set(2,0.25,2);


        
        this.crabLOD = new THREE.LOD();
        this.crab = new MyCrab(0.2,0.2,0.1, "#FF0000", null, "L");
        const crabDetailed = new MyCrab(0.2,0.2,0.1, "#FF0000", null, "H");
        const crabMediumDetailed = new MyCrab(0.2,0.2,0.1, "#FF0000", null, "M");
        this.crabLOD.addLevel(this.crab, 20);
        this.crabLOD.addLevel(crabDetailed, 0);
        this.crabLOD.addLevel(crabMediumDetailed, 5);
        this.app.scene.add(this.crabLOD);
        this.crabLOD.position.set(3,0.3,1);

        this.bubbles = [];
        for (let i = 0; i < 10; i++) {
            const bubble = new MyBubble(0.10 + Math.random() * 0.08, 1); 
            this.app.scene.add(bubble);
            this.bubbles.push(bubble);
        }
        
        //carps position and size [x, y, z, number of carps]
        this.fishesFlockingParams = {
            separation: 1.0,
            alignment: 1.0,
            cohesion: 1.0,
            maxSpeed: 2.0
        }
        const carpsGroupsPosSize = [[-10, 1, -10, 100], [10, 1, 5, 5]];
        this.fishGroups = [];
        for(let i = 0; i < carpsGroupsPosSize.length; i++){
            const pos = carpsGroupsPosSize[i];
            const fishGroup = new MySchoolfOfFish(pos[3], 1, 1,0.2, "Carp", 1,1, this.fishTexture1, this.fishesFlockingParams);
            this.app.scene.add(fishGroup);
            this.fishGroups.push(fishGroup);
            fishGroup.position.set(pos[0],pos[1],pos[2]);
        }

        

        //rock position and size [x, z, number of rocks]
        this.rockGroups = [];
        const rockPosSize = [[15, -15, 4], [-10, -10, 6], [5, 8, 2], [-12, 15, 10], [-1, 15, 1], [1, 4, 3], [-10, 4, 8], [3, -4, 3], [15, 15, 10], [20, 5, 10], [-20, -6, 10], [0, -20, 20]];
        for(let i = 0; i < rockPosSize.length; i++){
            const pos = rockPosSize[i];
            const rockGroup = new MyRockGroup(pos[2], 0.1, 1, 0.5, ["#4c4747", "#292727", "#8c8989"], true, [this.rockTexture, this.rockTexture2]);
            this.rockGroups.push(rockGroup);
            rockGroup.position.set(pos[0],0,pos[1]);
            this.app.scene.add(rockGroup);
        }
        

        this.coralReef1 = new MyCoralReef(40, "fanCoral", 20, 4);
        this.coralReef1.position.y = 0;
        this.app.scene.add(this.coralReef1);

        this.coralReef2 = new MyCoralReef(40, "branchingCoral", 20, 4);
        this.coralReef2.position.y = 0;
        this.app.scene.add(this.coralReef2);

        this.seaUrchinLOD = new THREE.LOD();
        this.seaUrchin = new MySeaUrchin(0.1, 0.5, 100, "#000000", "L");
        const seaUrchinMid = new MySeaUrchin(0.1, 0.5, 100, "#000000", "M");
        const seaUrchinHigh = new MySeaUrchin(0.1, 0.5, 100, "#000000", "H");
        this.seaUrchinLOD.addLevel(this.seaUrchin, 20);
        this.seaUrchinLOD.addLevel(seaUrchinMid, 10);
        this.seaUrchinLOD.addLevel(seaUrchinHigh, 0);
        this.seaUrchinLOD.position.set(4, 0.3, 4);
        this.app.scene.add(this.seaUrchinLOD);

        this.turtle = new MyTurtle(0.5, 0.15);
        this.turtle.position.set(-4, 0.3, 4);
        this.app.scene.add(this.turtle);

        this.jellyfishLOD = new THREE.LOD();
        this.jellyfish = new MyJellyFish(0.5, 1, undefined, undefined, "H");
        this.jellyfishMedium = new MyJellyFish(0.5, 1, undefined, undefined, "M");
        this.jellyfishLow = new MyJellyFish(0.5, 1, undefined, undefined, "L");
        this.jellyfishLOD.addLevel(this.jellyfish, 0);
        this.jellyfishLOD.addLevel(this.jellyfishMedium, 15);
        this.jellyfishLOD.addLevel(this.jellyfishLow, 30);
        this.app.scene.add(this.jellyfishLOD);
        this.jellyfishLOD.position.set(0,5,0);
        
        this.shark = new MyShark();
        this.shark.position.set(-8, 10, 0);
        this.app.scene.add(this.shark);

        this.sign = new MySign();
        this.sign.position.set(0,0,15);
        this.sign.scale.set(2,2,2);
        this.app.scene.add(this.sign); 

        const twoDShark = new My2DShark();
        twoDShark.scale.set(0.2, 0.2, 0.2);
        twoDShark.position.set(-0.8, 0.5, this.sign.board.geometry.parameters.depth / 2 + 0.01); //slightly in front of the board
        this.sign.board.add(twoDShark);

        this.swordFish = new MySwordFish(1,3,1,1.5,"#545f7f");
        this.swordFish.position.set(0,3,0);
        this.app.scene.add(this.swordFish); 

        this.submarine = new MySubmarine();
        this.submarine.position.set(5,4,5);
        this.app.scene.add(this.submarine);


        this.animationShark = new MyKeyFrameAnimation(this.shark, "random", 2, 50, 30);
        this.animationSwordFish = new MyKeyFrameAnimation(this.swordFish, "circle", 10, 50, 60);
    }

    onMouseClick(mousePos) {
        // 1. Setup Raycaster
        this.mouse.x = (mousePos.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(mousePos.clientY / window.innerHeight) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.app.activeCamera);

        // 2. Build List
        const bvhMeshes = [];
        for (const school of this.fishGroups) {
            school.fishes.forEach(fish => bvhMeshes.push(fish));
        }
        for (const rocks of this.rockGroups) {
            rocks.rocks.forEach(rock => bvhMeshes.push(rock));
        }
        for (const seaPlantGroup of this.seaPlantGroups) {
            seaPlantGroup.children.forEach(plant => {
                bvhMeshes.push(plant);
            });
        }
        this.coralReef1.children.forEach(coral => bvhMeshes.push(coral));
        this.coralReef2.children.forEach(coral => bvhMeshes.push(coral));
        bvhMeshes.push(this.shark);
        bvhMeshes.push(this.sign);
        bvhMeshes.push(this.swordFish.lod);
        bvhMeshes.push(this.submarine);
        bvhMeshes.push(this.jellyfish);
        bvhMeshes.push(this.seaUrchinLOD);
        bvhMeshes.push(this.turtle);
        bvhMeshes.push(this.crabLOD);
        bvhMeshes.push(this.seaStarLOD);


        // 3. Intersect
        const intersects = this.raycaster.intersectObjects(bvhMeshes, true);

        if (intersects.length > 0) {
            const hit = intersects[0].object;

            // Walk up from the clicked mesh until we find the object registered in bvhMeshes
            let selectedObject = hit;
            while (selectedObject.parent && !bvhMeshes.includes(selectedObject)) {
                selectedObject = selectedObject.parent;
            }
            
            // Case A: Same object
            if (this.currentSelection === selectedObject) {
                return; 
            }

            // Case B: New object
            if (this.currentSelection) {
                this.restoreObject(this.currentSelection);
            }

            this.currentSelection = selectedObject;

            this.highlightObject(this.currentSelection);

        } else {
            if (this.currentSelection) {
                this.restoreObject(this.currentSelection);
                this.currentSelection = null;
            }
        }
    }

    highlightObject(rootObject) {
        rootObject.traverse((child) => {
            if (child.isMesh && child.material) {
                
                if (!child.userData.isCloned) {
                    if (Array.isArray(child.material)) {

                        child.material = child.material.map(m => m.clone());
                    } else {
    
                        child.material = child.material.clone();
                    }
                    child.userData.isCloned = true;
                }

                if (Array.isArray(child.material)) {
                    if (!child.userData.originalColors) child.userData.originalColors = [];
                    child.material.forEach((mat, i) => {
                        if (!child.userData.originalColors[i]) child.userData.originalColors[i] = mat.color.clone();
                        mat.color.set(0xff0000);
                    });
                } else {
                    if (!child.userData.originalColor) child.userData.originalColor = child.material.color.clone();
                    child.material.color.set(0xff0000);
                }
            }
        });
    }

    restoreObject(rootObject) {
        rootObject.traverse((child) => {
            if (child.isMesh && child.material) {
                if (Array.isArray(child.material) && child.userData.originalColors) {
                    child.material.forEach((mat, i) => {
                        if (child.userData.originalColors[i]) mat.color.copy(child.userData.originalColors[i]);
                    });
                    delete child.userData.originalColors;
                } else if (child.material.color && child.userData.originalColor) {
                    child.material.color.copy(child.userData.originalColor);
                    delete child.userData.originalColor;
                }
            }
        });
    }

    initTextures() {
        this.rockTexture = new THREE.TextureLoader().load("./textures/Rock1.jpeg");
        this.rockTexture2 = new THREE.TextureLoader().load("./textures/Rock2.jpg");

        this.sandTexture = new THREE.TextureLoader().load("./textures/sand.jpg");

        this.fishTexture1 = new THREE.TextureLoader().load("./textures/Fish1.jpg");
    }

    update(delta) {
        if (!delta) return;

        // update submarine model to follow submarine camera 
        if (this.submarine && this.app.activeCameraName === 'Submarine') {
            this.submarine.position.copy(this.app.activeCamera.position);
            this.submarine.rotation.copy(this.app.activeCamera.rotation);

            // rotate submarine to match camera direction
            this.submarine.rotation.y += Math.PI / 2; 
        }

        

        for (const b of this.bubbles) b.update(delta);
        this.swordFish.update(delta);
        this.shark.update(delta);
        
        
        //update the animation in the sea plants
        for(const plantGroup of this.seaPlantGroups) plantGroup.update(delta);

        // Update keyframe animations
        this.animationShark.update(delta);
        this.animationSwordFish.update(delta);

        this.enemies = [] //reset the enemie
        this.enemies.push(this.swordFish);
        this.enemies.push(this.jellyfish);
        this.enemies.push(this.shark);
        this.enemies.push(this.submarine);

        this.colisionObjects = [];
        this.colisionObjects.push(this.sign)

        // Update all fish groups (carps) - skeletal animation
        for(const fishGroup of this.fishGroups) {
            fishGroup.update(delta, this.enemies, this.colisionObjects);
        }
        

        this.submarine.update(delta);

        this.jellyfish.update(delta);

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

    setBVHMode(enable){
        for(const fishGroup of this.fishGroups){
            fishGroup.bvh = enable;
            for(const fish of fishGroup.fishes){
                fish.bvh = enable;
            }
            this.shark.bvh = enable;
            this.swordFish.bvh = enable;
            this.jellyfish.bvh = enable;
            this.sign.bvh = enable;
        }
    }

    /**
     * Updates the flooking params after an update is made in the UI
     */
    updateSchoolsOfFish(){
        for(const schoolOfFish of this.fishGroups){
            schoolOfFish.updateFlockingParams(this.fishesFlockingParams);
        }
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