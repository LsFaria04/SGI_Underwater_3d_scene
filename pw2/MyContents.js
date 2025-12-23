import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import {MyBubbleParticles} from './particles/MyBubbleParticles.js';
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
import { MyKeyFrameAnimation } from './animations/MyKeyframeAnimation.js';
import { MySubmarine } from './objects/MySubmarine.js';
import { MyMarineSnow } from './particles/MyMarineSnow.js';
import { MeshBVHHelper } from './index.module.js';
import { GLTFLoader } from '../lib/jsm/loaders/GLTFLoader.js';
import { floorHeightPosition, generateRandom, getRandomInt } from './utils.js';
import { SandPuffSystem } from './particles/MySandPuffParticles.js';
import { LavaSimpleMovement } from './shaders/LavaSimpleMovement.js';


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
        this.raycaster = new THREE.Raycaster();
        this.raycaster.firstHitOnly = true;
        this.object = null;

        this.lodObjects = [];

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

        //Ambient light of the scene
        const ambientLight = new THREE.AmbientLight(0x88aaff, 0.1);
        this.app.scene.add( ambientLight );

        // directional light to simulate sun from above
        const directionalLight = new THREE.DirectionalLight(0x88aaff, 0.3);
        directionalLight.position.set(10, 20, 10);
        directionalLight.castShadow = true;

        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024; 

        directionalLight.shadow.camera.left = -40;
        directionalLight.shadow.camera.right = 40;
        directionalLight.shadow.camera.top = 40;
        directionalLight.shadow.camera.bottom = -40;
        directionalLight.shadow.camera.near = 1;
        directionalLight.shadow.camera.far = 100;

        directionalLight.shadow.bias = -0.0005;
       
        this.app.scene.add(directionalLight);

        //volcano light
        //The light is moved to the correct position after the volcano is loaded
        this.volvanoLight = new THREE.PointLight(0xCf1020, 5);
        this.app.scene.add(this.volvanoLight);

    }

    initObjects() {
        // create once 
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this)
        }

        //Sand sea floor
        this.floor = new MyFloor(200, 128, this.sandTexture);
        this.app.scene.add(this.floor);

        // ----------------------------- STATIC OBJECTS ----------------------------------------

        // Sign with 2D Shark
        this.sign = new MySign(1.5, 0.05, 1.5, 1, 0.05, 0x8b5a2b, 0xdeb887, "BEWARE OF THE SHARK", this.videoTexture);
        this.sign.position.set(0,floorHeightPosition(0, 15),15);
        this.sign.scale.set(2,2,2);
        this.app.scene.add(this.sign); 
        //Shark in the sign
        const twoDShark = new My2DShark();
        twoDShark.scale.set(0.2, 0.2, 0.2);
        twoDShark.position.set(-0.8, 0.5, this.sign.board.geometry.parameters.depth / 2 + 0.01); //slightly in front of the board
        this.sign.board.add(twoDShark);

        this.signBoat = new MySign(1.5, 0.05, 2, 1, 0.05, "#8b5a2b", "#deb887", "SUNKEN BOAT. CAUTION!");
        this.signBoat.position.set(-4,floorHeightPosition(-4, -3),-3);
        this.signBoat.scale.set(0.5,0.5,0.5);
        this.signBoat.rotateY(THREE.MathUtils.degToRad(-90))
        this.app.scene.add(this.signBoat); 

        this.signVolcano = new MySign(1.5, 0.05, 2, 1, 0.05, "#8b5a2b", "#deb887", "DANGER! LAVA!");
        this.signVolcano.position.set(20,floorHeightPosition(20, -2),-2);
        this.signVolcano.scale.set(0.5,0.5,0.5);
        this.signVolcano.rotateY(THREE.MathUtils.degToRad(90))
        this.app.scene.add(this.signVolcano);

        //rock position and size [x, z, number of rocks]
        this.rockGroups = [];
        const rockPosSize = [
            //Rock groups inside the scene
            [15, -15, 4], [-10, -10, 6], [5, 8, 2],
            [-12, 15, 5], [-1, 15, 1], [4, 4, 3],
            [-10, 4, 8], [5, -4, 3], [15, 15, 6],
            [20, 5, 10], [-20, -6, 10], [0, -20, 4],

            //rock groups that are ouside the scene for scenery
             [-30, -15, 4], [-25, 0, 5], [-20, 5, 10],
            [-30, -15, 4], [-35, 3, 20], [-30, -20, 3],
        ];
        for(let i = 0; i < rockPosSize.length; i++){
            const pos = rockPosSize[i];
            const rockGroup = new MyRockGroup(pos[2],pos[0], pos[1], 0.1, 1, 0.5, ["#615949", "#292727", "#8c8989"], false, [this.rockTexture]);
            this.rockGroups.push(rockGroup);
            this.app.scene.add(rockGroup);
        }

        // ----------------------------- OBJECTS WITH MOVEMENT ---------------------------------

        this.submarine = new MySubmarine(this.videoTexture);
        this.submarine.position.set(5,4,5);
        this.app.scene.add(this.submarine);
        this.app.scene.add(this.submarine.boxHelper);

        //Coral reef radius, position, type, number of corals [numb, x, z, type, radius]
        this.corals = [];
        const coralsPosSize = [
            [4, -8, 0, "fanCoral", 4], [4,8, 1, "branchingCoral", 4],
            [10, 10, -11, "fanCoral", 8], [10,-8, -20, "branchingCoral", 6],
            [20, 10, 20, "fanCoral", 6], [10,-15, 0, "branchingCoral", 6],
        ];

        for(let i = 0; i < coralsPosSize.length; i++){
            const pos = coralsPosSize[i];
            const reef = new MyCoralReef(pos[0], pos[1], pos[2], pos[3], pos[4], 4, this.coralTexture);
            this.corals.push(reef);
            this.app.scene.add(reef);
        }

        //plant position and size [x, z, number of plants]
        const plantGroupsPosSize = [
            [-20, -1, 10], [-4, 9, 50], [10,5, 10],

            //sea plants ousid the scene
            [-30, 15, 10], [-4, -30, 10], [25,0, 20],

        ];
        this.seaPlantGroups = [];
        for(let i = 0; i < plantGroupsPosSize.length; i++){
            const pos = plantGroupsPosSize[i];
            const seaPlantGroup = new MySeaPlantGroup(pos[2], pos[0], pos[1], 0.2, 1, 0.1, ["#3a6c3a", "#5b6c3a","#6e783e", "#44cf25"], true);

            this.app.scene.add(seaPlantGroup);
            this.seaPlantGroups.push(seaPlantGroup);
        }

        // ----------------------------- STATIC ANIMALS ----------------------------------------

        this.seaUrchins = [];
        const seaUrchinsPosSize = [
            //near volcano
            [12, floorHeightPosition(12,2) + 0.2, 2],[14, floorHeightPosition(14,4) + 0.2, 4],
            [20, floorHeightPosition(20,2) + 0.2, 2],[19, floorHeightPosition(19,0) + 0.2, 0],
        ];
        for(let i = 0; i < seaUrchinsPosSize.length; i++){
            const pos = seaUrchinsPosSize[i];
            const urchin = new MySeaUrchin(generateRandom(0.05, 0.2), generateRandom(0.1,0.8), 100, "#000000");
            urchin.position.set(pos[0], pos[1], pos[2]);
            this.seaUrchins.push(urchin);
            this.app.scene.add(urchin);
        }

        this.seaStars = [];
        const seaStarsPosSize = [
            [4,floorHeightPosition(4,2),2]
        ];
        const seaStarColors = ["#a73c3c", "#b97106", "#ffc400", "#ff003c"];
        for(let i = 0; i < seaStarsPosSize.length; i++){
            const pos = seaStarsPosSize[i];
            const color = seaStarColors[getRandomInt(0, seaStarColors.length - 1)]
            const seaStar = new MySeaStar(generateRandom(0.05, 0.2), generateRandom(0.1,0.5), color, undefined);
            seaStar.position.set(pos[0], pos[1], pos[2]);
            this.seaStars.push(seaStar);
            this.app.scene.add(seaStar);
        }

        this.crabs = [];
        const crabPosSize = [
            [5,floorHeightPosition(5,1),1]
        ];
        const crabColors = ["#a73c3c", "#b97106", "#72420b", "#ff003c"];
        for(let i = 0; i < crabPosSize.length; i++){
            const pos = crabPosSize[i];
            const color = crabColors[getRandomInt(0, crabColors.length - 1)]
            const crab = new MyCrab(0.2,0.2,0.1, color, null);
            const crabScale = generateRandom(0.5, 2);
            crab.scale.set(crabScale, crabScale, crabScale);
            crab.position.set(pos[0], pos[1], pos[2]);
            this.crabs.push(crab);
            this.app.scene.add(crab);
        }

        // ---------------------------- ANIMALS WITH MOVEMENT ----------------------------------

        this.swordFish = new MySwordFish(1,3,1,1.5,"#545f7f", this.fishTexture1);
        this.swordFish.position.set(0,3,0);
        this.app.scene.add(this.swordFish);
        
        this.turtle = new MyTurtle(0.5, 0.15,  0x228B22,  0x556B2F, this.turtleTexture);
        this.turtle.position.set(8, 7 , 1);
        this.app.scene.add(this.turtle);

        this.jellyfishes = [];
        const jellyfishPosSize = [
            //Above the boat
            [0,4,0], [1.5,4,0], [0,5,1.5],

            //Left back
            [-20, 4, -20], [-21,  3, -21], [-19, 5, -20]
        ];
        for(let i = 0; i < jellyfishPosSize.length; i++){
            const pos = jellyfishPosSize[i];
            const jellyfish = new MyJellyFish(0.5, 1);
            const jellyScale = generateRandom(0.5, 2);
            jellyfish.scale.set(jellyScale, jellyScale, jellyScale);
            jellyfish.position.set(pos[0], pos[1], pos[2]);
            this.jellyfishes.push(jellyfish);
            this.app.scene.add(jellyfish);
        }

        
        this.shark = new MyShark(1, "#2244aa", this.sharkTexture);
        this.shark.position.set(-8, 10, 0);
        this.shark.scale.set(-1, 1,1);
        this.app.scene.add(this.shark);

        //carps position and size [x, y, z, number of carps]
        this.fishesFlockingParams = {
            separation: 1.0,
            alignment: 1.0,
            cohesion: 1.0,
            maxSpeed: 2.0
        }
        const carpsGroupsPosSize = [[-10, 1, -10, 25], [10, 1, 5, 5]];
        this.fishGroups = [];
        for(let i = 0; i < carpsGroupsPosSize.length; i++){
            const pos = carpsGroupsPosSize[i];
            const fishGroup = new MySchoolfOfFish(pos[3], 1, 1,0.2, "Carp", 1,1, this.fishTexture1, this.fishesFlockingParams);
            this.app.scene.add(fishGroup);
            this.fishGroups.push(fishGroup);
            fishGroup.position.set(pos[0],pos[1],pos[2]);
        }

        // ---------------------------- ANIMATIONS ---------------------------------------------

        this.animationShark = new MyKeyFrameAnimation(this.shark, "random", 15, 100, 100, Math.PI / 2);
        this.animationSwordFish = new MyKeyFrameAnimation(this.swordFish, "circle", 10, 50, 60, Math.PI / 2);
        this.animationTurtle = new MyKeyFrameAnimation(this.turtle, "random", 10, 100, 100, 0);

        // ----------------------------- PARTICLES AND EFFECTS ---------------------------------

        const water = new MyWater(50, 20);
        this.app.scene.add(water);

        this.app.scene.fog = new THREE.FogExp2(0x003366, 0.03);

        this.sandPuff = new SandPuffSystem(this.app.scene, 5000);

        this.marineSnow = new MyMarineSnow([0.1], ["#FFFFFF"], [this.snowTexture1], 0.01);
        this.marineSnow.position.set(0,10,0);
        this.app.scene.add(this.marineSnow);

        this.volcanoBubbles = new MyBubbleParticles([
        { x: 14, z: -1 }
        ],
        200,
        this.bubbleTexture,
        { sourceY: 1.8, surfaceY: 20, spawnAreaX: 0.4, spawnAreaZ: 0.4, spawnRate: 70 }
        );

        this.app.scene.add(this.volcanoBubbles.points);

        

        this.coralBubbles = [];
        for(const reef of this.corals){
            for(const coral of reef.corals){
                const coralPos = new THREE.Vector3();
            coral.getWorldPosition(coralPos);
            
            const bubbleSystem = new MyBubbleParticles(
                [{ x: coralPos.x, z: coralPos.z }],
                50, 
                this.bubbleTexture,
                { 
                    sourceY: coralPos.y + 0.5,
                    surfaceY: 20, 
                    spawnAreaX: 0.3, 
                    spawnAreaZ: 0.3, 
                    spawnRate: 0.5,
                    speedFactor: 0.5
                }
            );
                this.app.scene.add(bubbleSystem.points);
                this.coralBubbles.push(bubbleSystem);
            }
        }

        // ---------------------------------- IMPORTED MODELS ---------------------------------------

        const loader = new GLTFLoader(); //Used to import objects in the GLTF format that were not moddeled by us 
        // Load the boat model
        loader.load('objects/malletts_bay_old_tour_boat/scene.gltf', (gltf) => {

            this.boat = gltf.scene
            this.boat.scale.set(0.1, 0.1, 0.1);
            this.boat.position.set(0,3,0);
            this.boat.traverse((child) => {
                if (child.isMesh && child.material) {
                    child.material.emissive.set(0x000000);
                    child.material.emissiveIntensity = 0;
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            this.boat.helpers = [];
            this.boat.traverse((child) => {
            if (child.isMesh) {
                child.geometry.computeBoundsTree();
                const helper = new MeshBVHHelper(child);
                helper.visible = false;
                child.add(helper);
                this.boat.helpers.push(helper);
                
            }
            });
            this.boat.box = new THREE.Box3().setFromObject(this.boat, true);
            this.boat.boxHelper = new THREE.Box3Helper(this.boat.box, 0xff0000);
            this.boat.boxHelper.visible = false;
            this.app.scene.add(this.boat.boxHelper);

            this.app.scene.add(this.boat);
        }, undefined, (error) => {
            console.error(error);
        });

        // Load the volcano model
        this.volcanoGroup = new THREE.Group();
        const volcanoPosition = [13, floorHeightPosition(13,7) - 0.6, 7]
        loader.load('objects/volcano/scene.gltf', (gltf) => {

            this.volcano = gltf.scene
            this.volcano.scale.set(0.1, 0.1, 0.1);
            this.volcano.position.set(volcanoPosition[0],volcanoPosition[1],volcanoPosition[2]);
            this.volcano.traverse((child) => {
                if (child.isMesh && child.material) {
                    child.material.emissive.set(0x000000);
                    child.material.emissiveIntensity = 0;
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            this.volcano.helpers = [];
            this.volcano.traverse((child) => {
            if (child.isMesh) {
                child.geometry.computeBoundsTree();
                const helper = new MeshBVHHelper(child);
                helper.visible = false;
                child.add(helper);
                this.volcano.helpers.push(helper);
                
            }
            });
            this.volcano.box = new THREE.Box3().setFromObject(this.volcano, true);
            this.volcano.boxHelper = new THREE.Box3Helper(this.volcano.box, 0xff0000);
            this.volcano.boxHelper.visible = false;
            this.app.scene.add(this.volcano.boxHelper);
            this.volcanoGroup.add(this.volcano);

            //this.app.scene.add(this.volcano);
        }, undefined, (error) => {
            console.error(error);
        });

        //move the volcano light to the volvano position
        this.volvanoLight.position.set(volcanoPosition[0] + 1, 2,volcanoPosition[2] - 8)

        // Add lava plane above volcano
        const lavaGeometry = new THREE.PlaneGeometry(1, 1);
        const lavaMaterial = new THREE.ShaderMaterial({
            uniforms: THREE.UniformsUtils.clone(LavaSimpleMovement.uniforms),
            vertexShader: LavaSimpleMovement.vertexShader,
            fragmentShader: LavaSimpleMovement.fragmentShader,
            side: THREE.DoubleSide
        });
        lavaMaterial.uniforms.lavaTexture.value = this.lavaTexture1;
        this.lavaPlane = new THREE.Mesh(lavaGeometry, lavaMaterial);
        this.lavaPlane.rotation.x = -Math.PI / 2;
        this.lavaPlane.position.set(14, 1.4, -1);

        this.volcanoGroup.add(this.volvanoLight);
        this.volcanoGroup.add(this.lavaPlane);
        
        this.app.scene.add(this.volcanoGroup);

        // ------------------------------- CREATE COLLISION AVOIDANCE HELPERS ------------------------------
        //Add enemies of the fish to send for the update
        this.enemies = [] //reset the enemie
        this.enemies.push(this.swordFish);
        this.enemies.push(...this.jellyfishes);
        this.enemies.push(this.shark);
        this.enemies.push(this.submarine);

        //Add objects that the fish can not collide
        this.collisionObjects = [];
        this.collisionObjects.push(this.sign);
        this.collisionObjects.push(this.signBoat);
        this.collisionObjects.push(this.signVolcano);
        this.collisionObjects.push(this.turtle);
        for(const rockGroup of this.rockGroups){
            for(const rock of rockGroup.rocks){
                this.collisionObjects.push(rock)
            }
        }
        for (const reef of this.corals){
            for(const coral of reef.corals){
                this.collisionObjects.push(coral);
            }
        }
        this.boatIncluded = false;
        this.volcanoIncluded = false;
    }


    initTextures() {
        //Rocks textures

        //Rock PBR
        const loader = new THREE.TextureLoader();
        this.albedoRock = loader.load('./textures/ocean-rock-bl/ocean-rock_albedo_512x512.png');
        this.normalRock = loader.load('./textures/ocean-rock-bl/ocean-rock_normal-ogl_512x512.png');
        this.roughnessRock = loader.load('./textures/ocean-rock-bl/ocean-rock_roughness_512x512.png');
        this.metalnessRock = loader.load('./textures/ocean-rock-bl/ocean-rock_metallic_512x512.png');
        this.displacementRock = loader.load("./textures/ocean-rock-bl/ocean-rock_height_512x512.png");
        this.ambientOcclusionRock = loader.load("./textures/ocean-rock-bl/ocean-rock_ao_512x512.png");
        //Mips map for the rock texture
        this.albedoRock.generateMipmaps = true;
        this.normalRock.generateMipmaps = true;
        this.roughnessRock.generateMipmaps = true;
        this.metalnessRock.generateMipmaps = true;
        this.displacementRock.generateMipmaps = true;
        this.ambientOcclusionRock.generateMipmaps = true;
        this.rockTexture = {
                ao: this.ambientOcclusionRock,
                albedo: this.albedoRock,
                displacement: this.displacementRock,
                normal: this.normalRock,
                roughness: this.roughnessRock,
                metallic: this.metalnessRock
        }

        // Get max anisotropy supported by GPU
        const maxAnisotropy = this.app.renderer.capabilities.getMaxAnisotropy();

        //Sand PBR
        this.albedoSand = loader.load('./textures/wavy-sand-bl/wavy-sand_albedo_1024x1024.png');
        this.normalSand = loader.load('./textures/wavy-sand-bl/wavy-sand_normal-ogl_1024x1024.png');
        this.roughnessSand = loader.load('./textures/wavy-sand-bl/wavy-sand_roughness_1024x1024.png');
        this.metalnessSand = loader.load('./textures/wavy-sand-bl/wavy-sand_metallic_1024x1024.png');
        this.displacementSand = loader.load("./textures/wavy-sand-bl/wavy-sand_height_1024x1024.png");
        this.ambientOcclusionSand = loader.load("./textures/wavy-sand-bl/wavy-sand_ao_1024x1024.png");
        //use anisotropy filter for the sand
        this.albedoSand.anisotropy = maxAnisotropy;
        this.normalSand.anisotropy = maxAnisotropy;
        this.roughnessSand.anisotropy = maxAnisotropy;
        this.metalnessSand.anisotropy = maxAnisotropy;
        this.displacementSand.anisotropy = maxAnisotropy;
        this.ambientOcclusionSand.anisotropy = maxAnisotropy;
        //ensure mip maps are generated
        this.albedoSand.generateMipmaps = true;
        this.normalSand.generateMipmaps = true;
        this.roughnessSand.generateMipmaps = true;
        this.metalnessSand.generateMipmaps = true;
        this.displacementSand.generateMipmaps = true;
        this.ambientOcclusionSand.generateMipmaps = true;
        this.sandTexture = {
                ao: this.ambientOcclusionSand,
                albedo: this.albedoSand,
                displacement: this.displacementSand,
                normal: this.normalSand,
                roughness: this.roughnessSand,
                metallic: this.metalnessSand
        }

        //coral texture pbr
        this.albedoCoral = loader.load('./textures/coral1-bl/coral1_albedo_512x512.png');
        this.normalCoral = loader.load('./textures/coral1-bl/coral1_normal-ogl_511x511.png');
        this.roughnessCoral = loader.load('./textures/coral1-bl/coral1_roughness_512x512.png');
        this.metalnessCoral = loader.load('./textures/coral1-bl/coral1_metallic_512x512.png');
        this.displacementCoral = loader.load("./textures/coral1-bl/coral1_height_511x511.png");
        this.ambientOcclusionCoral = loader.load("./textures/coral1-bl/coral1_ao_512x512.png");
        //Mip map for the coral texture
        this.albedoCoral.generateMipmaps = true;
        this.normalCoral.generateMipmaps = true;
        this.roughnessCoral.generateMipmaps = true;
        this.metalnessCoral.generateMipmaps = true;
        this.displacementCoral.generateMipmaps = true;
        this.ambientOcclusionCoral.generateMipmaps = true;
         this.coralTexture = {
                ao: this.ambientOcclusionCoral,
                albedo: this.albedoCoral,
                displacement: this.displacementCoral,
                normal: this.normalCoral,
                roughness: this.roughnessCoral,
                metallic: this.metalnessCoral
        }

        this.fishTexture1 = new THREE.TextureLoader().load("./textures/fish.jpg");
        this.fishTexture1.generateMipmaps = true;

        this.sharkTexture = new THREE.TextureLoader().load("./textures/shark-skin.jpg");

        this.sharkTexture.minFilter = THREE.LinearMipmapLinearFilter;
        this.sharkTexture.magFilter = THREE.LinearFilter;
        this.sharkTexture.generateMipmaps = true;

        this.turtleTexture = new THREE.TextureLoader().load("./textures/turtle.jpg");
        this.turtleTexture.generateMipmaps = true;

        // Video texture
        this.video = document.createElement('video');
        this.video.src = "./textures/videos/jellyfishes.mp4";
        this.video.muted = true;
        this.video.loop = true;
        this.video.play();

        this.videoTexture = new THREE.VideoTexture(this.video);
        this.videoTexture.minFilter = THREE.LinearFilter;
        this.videoTexture.magFilter = THREE.LinearFilter;
        this.videoTexture.colorSpace = THREE.SRGBColorSpace;

        //Store the video element to control playback later if needed
        this.videoElement = this.video;

        // Marine Snow Textures
        this.snowTexture1 = new THREE.TextureLoader().load("./textures/marine-snow/snowflake1.png");
        this.snowTexture2 = new THREE.TextureLoader().load("./textures/marine-snow/snowflake2.png");
        this.bubbleTexture = new THREE.TextureLoader().load("./textures/bubble.png");

        // Lava Textures
        this.lavaTexture1 = new THREE.TextureLoader().load("./textures/lava/lavaText1.jpg");
        this.lavaTexture2 = new THREE.TextureLoader().load("./textures/lava/lavaText2.jpg");
    }

    update(delta) {
        if (!delta) return;
        this.collisionObjects = [];
        if (this.sign) this.collisionObjects.push(this.sign);
        if (this.turtle) this.collisionObjects.push(this.turtle);
        if (this.submarine) this.collisionObjects.push(this.submarine);
        if (this.boat) this.collisionObjects.push(this.boat);
        if (this.volcano) this.collisionObjects.push(this.volcano);
        if (this.rockGroups) {
            for (const rockGroup of this.rockGroups) {
                for (const rock of rockGroup.rocks) {
                    this.collisionObjects.push(rock);
                }
            }
        }
        if (this.coralReef1) {
            for (const coral of this.coralReef1.corals) {
                this.collisionObjects.push(coral);
            }
        }
        if (this.coralReef2) {
            for (const coral of this.coralReef2.corals) {
                this.collisionObjects.push(coral);
            }
        }
        if (this.floor) this.collisionObjects.push(this.floor);

        //UPDATE ALL OBJECTS WITH MOVEMENT -------------------

        if (this.seaweedUniforms) {
            this.seaweedUniforms.uTime.value += delta;
        }

        // update submarine model to follow submarine camera 
        if (this.submarine && this.app.activeCameraName === 'Submarine') {
            this.submarine.position.copy(this.app.activeCamera.position);
            this.submarine.rotation.copy(this.app.activeCamera.rotation);
        }
        //update the submarine position and light animation
        this.submarine.update(delta, this.collisionObjects);

        // Update coral Perlin noise animation
        for (const reef of this.corals){
            for(const coral of reef.corals){
                coral.userData.uniforms.uTime.value += delta;
            }
        }
        
        //update the animation in the sea plants
        for(const plantGroup of this.seaPlantGroups) plantGroup.update(delta);

        // Update lava shader animation
        if (this.lavaPlane && this.lavaPlane.material.uniforms) {
            this.lavaPlane.material.uniforms.time.value += delta;
        }



        // UPDATE ALL THE PARTICLE SYSTEMS -------------------------

        if (this.marineSnow) {
            this.marineSnow.update(delta);
        }
        this.volcanoBubbles.updateLOD(this.app.activeCamera.position);
        this.volcanoBubbles.update(delta);
        for (const bubbleSystem of this.coralBubbles) {
            bubbleSystem.updateLOD(this.app.activeCamera.position);
            bubbleSystem.update(delta);
        }
        this.sandPuff.update(delta);


       
        //UPDATE ALL THE DEDICATED ANIMATION SYSTEMS ---------------------------

        // Update keyframe animations
        this.animationShark.update(delta);
        this.animationSwordFish.update(delta);
        this.animationTurtle.update(delta);



        //CHECK IF IMPORTED MODELS ALREADY LOADED TO INCLUDED THEM IN THE COLLISION SYSTEM ------------

        //add the boat only if it is loaded and is not already in the collision objects
        if(this.boat && !this.boatIncluded){
             this.collisionObjects.push(this.boat);
             this.boatIncluded = true;
        }

        //add the volcano only if it is loaded and is not already in the collision objects
        if(this.volcano && !this.volcanoIncluded){
             this.collisionObjects.push(this.volcano);
             this.volcanoIncluded = true;
        }
       

        //UPDATE THE ANIMALS WITH MOVEMENT -------------------

        // Update all fish groups (carps) - skeletal animation
        for(const fishGroup of this.fishGroups) {
            fishGroup.update(delta, this.enemies, this.collisionObjects);
        }
        this.swordFish.update(delta);
        this.shark.update(delta);
        this.turtle.update(delta);
        
        //Update jellyfish animation
        for(const jellyfish of this.jellyfishes){
             jellyfish.updateAnimation(delta);
        }
       
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
        for( const reef of this.corals){
            reef.children.forEach(coral => bvhMeshes.push(coral));
        }
        for(const urchin of this.seaUrchins){
            bvhMeshes.push(urchin);
        }
        for(const seaStar of this.seaStars){
            bvhMeshes.push(seaStar);
        }
        for(const crab of this.crabs){
            bvhMeshes.push(crab);
        }

        bvhMeshes.push(this.shark);
        bvhMeshes.push(this.sign);
        bvhMeshes.push(this.signBoat);
        bvhMeshes.push(this.signVolcano);
        bvhMeshes.push(this.swordFish.lod);
        bvhMeshes.push(this.submarine);
        bvhMeshes.push(...this.jellyfishes);
        bvhMeshes.push(this.turtle);
        bvhMeshes.push(this.boat);
        bvhMeshes.push(this.volcano);


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
            //Mouse click on the sea floor 
            this.onMouseClickSandPuff(mousePos);
        }
    }

    onMouseClickSandPuff(mousePos){
        // 1. Setup Raycaster
        this.mouse.x = (mousePos.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(mousePos.clientY / window.innerHeight) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.app.activeCamera);

        const hits = this.raycaster.intersectObject(this.floor);

        if (hits.length > 0) {
            const hit = hits[0];

            this.sandPuff.spawn(hit.point, hit.face.normal, 5000);
        }

    }

    highlightObject(rootObject) {
        rootObject.traverse((child) => {
            if (child.isMesh && child.material) {
                
                if (!child.userData.isCloned) {
                    if (Array.isArray(child.material)) {
                        child.material = child.material.map(m => {
                            const cloned = m.clone();
                            // Preserve shader modifications
                            if (m.onBeforeCompile) {
                                cloned.onBeforeCompile = m.onBeforeCompile;
                                cloned.customProgramCacheKey = m.customProgramCacheKey;
                            }
                            if (m.userData.uniforms) {
                                cloned.userData.uniforms = m.userData.uniforms;
                            }
                            return cloned;
                        });
                    } else {
                        const originalMat = child.material;
                        child.material = originalMat.clone();
                        // Preserve shader modifications
                        if (originalMat.onBeforeCompile) {
                            child.material.onBeforeCompile = originalMat.onBeforeCompile;
                            child.material.customProgramCacheKey = originalMat.customProgramCacheKey;
                        }
                        if (originalMat.userData.uniforms) {
                            child.material.userData.uniforms = originalMat.userData.uniforms;
                        }
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
                    if (!child.userData.originalColor){
                    
                        child.userData.originalColor = child.material.color ? child.material.color.clone() : 0x000000;
                    } 
                    if(child.material.color)
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

    setBoxHelper(enable){


        for (const reef of this.corals){
            for(const helper of reef.helpers){
                helper.visible = enable;
            }
        }

        for(const fishGroup of this.fishGroups){
            for(const fish of fishGroup.fishes){
                fish.boxHelper.visible = enable;
            }
            
        }

        for(const rockGroup of this.rockGroups){
            for(const rock of rockGroup.rocks){
                rock.boxHelper.visible = enable;
            }
            
        }
        for(const plantgroup of this.seaPlantGroups){
            for(const plant of plantgroup.plants){
                plant.boxHelper.visible = enable;
            }
        }
        for(const urchin of this.seaUrchins){
            urchin.boxHelper.visible = enable;
        }
        for(const seaStar of this.seaStars){
            seaStar.boxHelper.visible = enable;
        }
        for(const crab of this.crabs){
            crab.boxHelper.visible = enable;
        }
        for(const jellyfish of this.jellyfishes){
            jellyfish.boxHelper.visible = enable;
        }
        

        this.boat.boxHelper.visible = enable;
        this.volcano.boxHelper.visible = enable;
        this.sign.boxHelper.visible = enable;
        this.signVolcano.boxHelper.visible = enable;
        this.signBoat.boxHelper.visible = enable;
        this.turtle.boxHelper.visible = enable;
        this.swordFish.boxHelper.visible = enable;
        this.shark.boxHelper.visible = enable;
        this.submarine.boxHelper.visible = enable;
    }

    setBVHMode(enable){
        //Used to set bvh in objects with movement to avoid wasting resources in updating the tree when the bvh is off
        for(const fishGroup of this.fishGroups){
            fishGroup.bvh = enable;
            for(const fish of fishGroup.fishes){
                fish.bvh = enable;
            }
        }
        for(const jellyfish of this.jellyfishes){
            jellyfish.bvh = enable;
        }
        this.shark.bvh = enable;
        this.swordFish.bvh = enable;
    }

    setBVHHelper(enable){
        for(const fishGroup of this.fishGroups){
            for(const fish of fishGroup.fishes){
                fish.helper.visible = enable;
            }
            
        }

        for(const rockGroup of this.rockGroups){
            for(const rock of rockGroup.rocks){
                for(const helper of rock.helpers){
                    helper.visible = enable;
                }
            }
        }

        this.shark.helper.visible = enable;

        for(const helper of this.swordFish.helpers){
            helper.visible = enable;
        }
        for(const jellyfish of this.jellyfishes){
            for(const helper of jellyfish.helpers){
                helper.visible = enable;
            }
        }
        
        for(const helper of this.submarine.helpers){
            helper.visible = enable;
        }

        for(const helper of this.sign.helpers){
            helper.visible = enable;
        }

        for(const helper of this.signBoat.helpers){
            helper.visible = enable;
        }

        for(const helper of this.signVolcano.helpers){
            helper.visible = enable;
        }

        for(const helper of this.turtle.helpers){
            helper.visible = enable;
        }

        for(const seaStar of this.seaStars){
            for(const helper of seaStar.helpers){
                helper.visible = enable;
            }
        }

        for(const crab of this.crabs){
            for(const helper of crab.helpers){
                helper.visible = enable;
            }
        }
        
        for(const helper of this.boat.helpers){
            helper.visible = enable;
        }

        for(const helper of this.volcano.helpers){
            helper.visible = enable;
        }


        for (const reef of this.corals){
            for(const helper of reef.helpers){
                helper.visible = enable;
            }
        }

        for (const urchin of this.seaUrchins){
            for(const helper of urchin.helpers){
                helper.visible = enable;
            }
        }

        for(const plantgroup of this.seaPlantGroups){
            for(const plant of plantgroup.plants){
                for(const helper of plant.helpers){
                    helper.visible = enable;
                }
            }
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