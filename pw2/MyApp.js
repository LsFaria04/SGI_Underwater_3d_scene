import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { MyContents } from './MyContents.js';
import Stats from 'three/addons/libs/stats.module.js'
import { MyInterface } from './MyInterface.js';
import {
	computeBoundsTree, disposeBoundsTree,
	computeBatchedBoundsTree, disposeBatchedBoundsTree, acceleratedRaycast,
} from './index.module.js';

import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { TintShader } from './shaders/TintShader.js';
import { CrosshairShader } from './shaders/CrosshairShader.js';
import { TextureOverlayShader } from './shaders/TextureOverlayShader.js';
import { CircularClipShader } from './shaders/CircularClipShader.js';
import { SpritesheetHUDShader } from './shaders/SpritesheetHUDShader.js';
import { floorHeightPosition } from './utils.js';


/**
 * This class contains the application object
 */
class MyApp  {
    /**
     * the constructor
     */
    constructor() {
        this.scene = null
        this.stats = null

        // camera related attributes
        this.activeCamera = null
        this.activeCameraName = null
        this.lastCameraName = null
        this.cameras = []
        this.frustumSize = 20

        // other attributes
        this.renderer = null
        this.controls = null
        this.gui = null
        this.axis = null
        this.contents = null

        //postprocessing attributes
        this.postprocessing = {
            underwater: null,
            submarine: null
        };

        this.clock = new THREE.Clock();

        // submarine camera
        this.move = { 
            forward: false,   // W - increase forward speed
            backward: false,  // S - decrease forward speed  
            left: false,      // A - rotate left
            right: false,     // D - rotate right
            up: false,        // P - increase vertical speed
            down: false       // L - decrease vertical speed
        };
        
        // submarine speeds
        this.forwardSpeed = 8;  
        this.verticalSpeed = 3; 
        this.rotationSpeed = 2; 

        //camera bounds (under water camera)
        this.bounds = {
            minX: -30,
            minY:  0,
            minZ: -30,
            maxX: 30,
            maxY: 30,
            maxZ: 30,
        }
    }
    
    /**
     * initializes the application
     */
    init() {
                
        // Create an empty scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0x101010 );

        this.stats = new Stats()
        this.stats.showPanel(1) // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild(this.stats.dom)

        this.initCameras();
        this.setActiveCamera('UnderWater');
        // Create a renderer with Antialiasing
        this.renderer = new THREE.WebGLRenderer({antialias:true});
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setClearColor("#000000");

        // Configure renderer size
        this.renderer.setSize( window.innerWidth, window.innerHeight );

        //initialize the shadows
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Append Renderer to DOM
        document.getElementById("canvas").appendChild( this.renderer.domElement);

        // input listeners
        window.addEventListener('keydown', (e) => this.onKeyChange(e, true));
        window.addEventListener('keyup', (e) => this.onKeyChange(e, false));
        //window.addEventListener('mousemove', (e) => this.onMouseMove(e));

        // manage window resizes
        window.addEventListener('resize', this.onResize.bind(this), false );

        //added function to the prototypes to use the bvh

        // Attach BVH helpers to Three.js prototypes
        THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
        THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
        THREE.Mesh.prototype.raycast = acceleratedRaycast;

        THREE.BatchedMesh.prototype.computeBoundsTree = computeBatchedBoundsTree;
        THREE.BatchedMesh.prototype.disposeBoundsTree = disposeBatchedBoundsTree;
        THREE.BatchedMesh.prototype.raycast = acceleratedRaycast;

        //initialize the postprocessing effect
        this.initPostProcessing();
    }

    /**
     * initializes all the cameras
     */
    initCameras() {
        
        const aspect = window.innerWidth / window.innerHeight;

        // Aquarium view
        const aquariumCam = new THREE.PerspectiveCamera(110, aspect, 1, 500);
        aquariumCam.position.set(0,10,20);
        aquariumCam.layers.enableAll();
        this.cameras['Aquarium View'] = aquariumCam;

        // Underwater view
        const underwaterCam = new THREE.PerspectiveCamera(90, aspect, 1, 500);
        underwaterCam.position.set(3,5,10);
        underwaterCam.layers.enableAll();
        this.cameras['UnderWater'] = underwaterCam;

        // Submarine view
        const freeFlyCam = new THREE.PerspectiveCamera(75, aspect, 1, 500);
        freeFlyCam.position.set(5,4,5);
        freeFlyCam.layers.enable(0);
        freeFlyCam.layers.enable(1);
        this.cameras['Submarine'] = freeFlyCam;
    }

    /**
     * sets the active camera by name
     * @param {String} cameraName 
     */
    setActiveCamera(cameraName) {   
        this.activeCameraName = cameraName
        this.activeCamera = this.cameras[this.activeCameraName]
    }

    /**
     * updates the active camera if required
     * this function is called in the render loop
     * when the active camera name changes
     * it updates the active camera and the controls
     */
    updateCameraIfRequired() {
        if (this.activeCameraName === 'Submarine' || this.activeCameraName === 'Aquarium View') {
            if (this.controls) this.controls.enabled = false;
        } 
        else {
            if (this.controls) this.controls.enabled = true;

            //check camera bounds
            const cam = this.cameras[this.activeCameraName];

            cam.position.x = THREE.MathUtils.clamp(cam.position.x, this.bounds.minX, this.bounds.maxX);
            cam.position.z = THREE.MathUtils.clamp(cam.position.z, this.bounds.minZ, this.bounds.maxZ);
            cam.position.y = THREE.MathUtils.clamp(cam.position.y, floorHeightPosition(cam.position.x, cam.position.z) + 1, this.bounds.maxY);

            
        }

        // camera changed?
        if (this.lastCameraName !== this.activeCameraName) {
            this.lastCameraName = this.activeCameraName;
            this.activeCamera = this.cameras[this.activeCameraName]
            document.getElementById("camera").innerHTML = this.activeCameraName
           
            // call on resize to update the camera aspect ratio
            // among other things
            this.onResize()

            if (this.controls === null) {
                // Orbit controls allow the camera to orbit around a target.
                this.controls = new OrbitControls( this.activeCamera, this.renderer.domElement );
            }
            else {
                this.controls.object = this.activeCamera
            }

            if (this.activeCameraName === 'Aquarium View') {
                this.controls.enabled = false;
                this.controls.enableZoom = false;
                this.controls.enablePan = false;
                this.controls.enableRotate = false;
            } else if (this.activeCameraName === 'Submarine') {
                this.controls.enabled = false;
                this.controls.enableZoom = false;
                this.controls.enablePan = false;
                this.controls.enableRotate = false;
            } else {
                this.controls.enabled = true;
                this.controls.enableZoom = true;
                this.controls.enableRotate = true;
                this.controls.enablePan = true;
            }
        }
        
        if (this.controls && this.controls.enabled) {
            this.controls.update();
        }
    }

    /**
     * updates the submarine camera movement
     * @param {number} delta time delta
     */
    updateSubmarineMovement(delta) {
        if (this.activeCameraName !== 'Submarine') return;
        
        const camera = this.activeCamera;

        if (this.move.left) {
            camera.rotation.y += this.rotationSpeed * delta;
        }
        if (this.move.right) {
            camera.rotation.y -= this.rotationSpeed * delta;
        }

        const forward = new THREE.Vector3();
        camera.getWorldDirection(forward);
        
        if (this.move.forward) {
            camera.position.add(forward.multiplyScalar(this.forwardSpeed * delta));
        }
        if (this.move.backward) {
            camera.position.add(forward.multiplyScalar(-this.forwardSpeed * delta));
        }
        
        if (this.move.up) {
            camera.position.y += this.verticalSpeed * delta;
        }
        if (this.move.down) {
            camera.position.y -= this.verticalSpeed * delta;
        }
        
        camera.position.y = Math.max(2, Math.min(20, camera.position.y));
        camera.position.x = Math.max(-30, Math.min(30, camera.position.x));
        camera.position.z = Math.max(-30, Math.min(30, camera.position.z));
    }

    /**
     * the window resize handler
     */
    onResize() {
        if (this.activeCamera !== undefined && this.activeCamera !== null) {
            this.activeCamera.aspect = window.innerWidth / window.innerHeight;
            this.activeCamera.updateProjectionMatrix();
            this.renderer.setSize( window.innerWidth, window.innerHeight );
            
            // update aspect ratio for shaders
            const aspect = window.innerWidth / window.innerHeight;
            if (this.circularClipPass) {
                this.circularClipPass.uniforms['aspect'].value = aspect;
            }
            if (this.crosshairPass) {
                this.crosshairPass.uniforms['aspect'].value = aspect;
            }
        }
    }
    
    /**
     * 
     * @param {MyContents} contents the contents object 
     */
    setContents(contents) {
        this.contents = contents;
    }

    /**
     * @param {MyInterface} contents the gui interface object
     */
    setGui(gui) {   
        this.gui = gui
    }

    /**
     * Initializes the postprocessing effects
     */
    initPostProcessing() {
        // Depth of Field effect
        this.postprocessing.underwater = this.createDOFComposer(
            this.cameras["UnderWater"],
            { focus: 8.0, aperture: 0.0004, maxblur: 0.01 }
        );

        this.initHUDCoordinates();

        const textureLoader = new THREE.TextureLoader();
        const scratchedGlassTexture = textureLoader.load('./textures/scratched_glass.jpeg', (tex) => {
            tex.minFilter = THREE.LinearFilter;
            tex.magFilter = THREE.LinearFilter;
            tex.generateMipmaps = false;
        });

        const crosshairTexture = textureLoader.load('./textures/crosshair.png', (tex) => {
            tex.minFilter = THREE.LinearFilter;
            tex.magFilter = THREE.LinearFilter;
            tex.generateMipmaps = false;
        });
        
        const tintPass = new ShaderPass(TintShader);
        
        const scratchedGlassPass = new ShaderPass(TextureOverlayShader);
        scratchedGlassPass.uniforms['tOverlay'].value = scratchedGlassTexture;
        scratchedGlassPass.uniforms['opacity'].value = 0.5;
        
        const crosshairPass = new ShaderPass(CrosshairShader);
        crosshairPass.uniforms['tCrosshair'].value = crosshairTexture;
        crosshairPass.uniforms['crosshairColor'].value = new THREE.Vector3(0.0, 1.0, 0.0);
        crosshairPass.uniforms['scale'].value = 1.1;
        crosshairPass.uniforms['aspect'].value = window.innerWidth / window.innerHeight;
        
        const hudPass = new ShaderPass(SpritesheetHUDShader);
        hudPass.uniforms['tSpritesheet'].value = this.hudTexture;
        hudPass.uniforms['hudColor'].value = new THREE.Vector3(0.0, 1.0, 0.0);
        
        const circularClipPass = new ShaderPass(CircularClipShader);
        circularClipPass.uniforms['radius'].value = 0.5;
        circularClipPass.uniforms['smoothness'].value = 0.02;
        circularClipPass.uniforms['aspect'].value = window.innerWidth / window.innerHeight;

        this.postprocessing.submarine = this.createDOFComposer(
            this.cameras["Submarine"],
            { focus: 10.0, aperture: 0.0008, maxblur: 0.015 },
            [ tintPass, scratchedGlassPass, crosshairPass, hudPass, circularClipPass ]
        );
        
        this.circularClipPass = circularClipPass;
        this.crosshairPass = crosshairPass;
        this.hudPass = hudPass;

    }
    
    /**
     * Initializes the HUD coordinates display using spritesheet
     */
    initHUDCoordinates() {
        const spritesheetTexture = new THREE.TextureLoader().load('./textures/numbers_spritesheet.png');
        spritesheetTexture.minFilter = THREE.NearestFilter;
        spritesheetTexture.magFilter = THREE.NearestFilter;
        
        this.hudCanvas = document.createElement('canvas');
        this.hudCanvas.width = 512;
        this.hudCanvas.height = 128;
        this.hudContext = this.hudCanvas.getContext('2d');
        
        this.hudTexture = new THREE.CanvasTexture(this.hudCanvas);
        this.hudTexture.minFilter = THREE.LinearFilter;
        this.hudTexture.magFilter = THREE.LinearFilter;
        
        this.spritesheetTexture = spritesheetTexture;
        this.spritesheetImage = null;
        
        const img = new Image();
        img.onload = () => {
            this.spritesheetImage = img;
        };
        img.src = './textures/numbers_spritesheet.png';
    }
    
    /**
     * Updates HUD coordinates text
     */
    updateHUDCoordinates() {
        if (!this.hudContext || !this.spritesheetImage) return;
        
        const camera = this.cameras['Submarine'];
        const x = Math.round(camera.position.x * 10);
        const y = Math.round(camera.position.y * 10);
        const z = Math.round(camera.position.z * 10);
        
        this.hudContext.clearRect(0, 0, this.hudCanvas.width, this.hudCanvas.height);
        
        const text = `X:${x}Y:${y}Z:${z}`;
        const fontSize = 8; 
        const textWidth = text.length * fontSize * 0.6;
        const rightX = this.hudCanvas.width - textWidth - 180; // distance in pixels from right edge
        const bottomY = this.hudCanvas.height - 40; // distance in pixels from bottom
        
        this.drawSpritesheetText(text, rightX, bottomY, fontSize);
        
        this.hudTexture.needsUpdate = true;
    }
    
    /**
     * Draws text using spritesheet (assumes 0-9 digits in single row)
     * Shader will convert white to green
     */
    drawSpritesheetText(text, x, y, size) {
        if (!this.spritesheetImage) return;
        
        // Assume 10 digits (0-9) in a single row
        const charWidth = this.spritesheetImage.width / 10;
        const charHeight = this.spritesheetImage.height;

        const spacing = 0.8; // spacing factor between characters
        
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            let charIndex = -1;
            
            // Map characters to spritesheet indices (only digits 0-9)
            if (char >= '0' && char <= '9') {
                charIndex = parseInt(char);
            }
            
            if (charIndex >= 0 && charIndex < 10) {
                this.hudContext.drawImage(
                    this.spritesheetImage,
                    charIndex * charWidth, 0, charWidth, charHeight,
                    x + i * size * spacing, y,
                    size, size
                );
            }
        }
    }

    /**
     * Creates a DOF composer pipeline for a given camera
     */
    createDOFComposer(camera, dofSettings, extraPasses = []) {

        const composer = new EffectComposer(this.renderer);

        const renderPass = new RenderPass(this.scene, camera);
        composer.addPass(renderPass);

        const bokehPass = new BokehPass(this.scene, camera, dofSettings);
        composer.addPass(bokehPass);

        // additional effects (optional)
        for (const pass of extraPasses) composer.addPass(pass);

        composer.addPass(new OutputPass());

        return {
            composer,
            bokeh: bokehPass,
            camera
        };
    }


    /**
    * the main render function. Called in a requestAnimationFrame loop
    */
    render () {
        this.stats.begin()
        const delta = this.clock.getDelta();

        this.updateCameraIfRequired()
        if (this.contents) this.contents.update(delta);


        // submarine camera movement
        if (this.activeCameraName === 'Submarine') {
            // move submarine mesh
            if (this.contents && this.contents.submarine) {
                // pass collision objects for collision detection
                this.contents.submarine.update(delta, this.contents.collisionObjects);
                // move camera to follow submarine
                this.activeCamera.position.copy(this.contents.submarine.position);
                this.activeCamera.rotation.copy(this.contents.submarine.rotation);
                
            }
            this.updateHUDCoordinates();
        }

        // required if controls.enableDamping or controls.autoRotate are set to true
        if (this.controls && this.activeCameraName !== 'Submarine') {
            this.controls.update();
        }

        switch (this.activeCameraName) {
            case "UnderWater":
                this.postprocessing.underwater.composer.render()
                break;

            case "Submarine":
                this.postprocessing.submarine.composer.render();
                break;

            default:
                // No postprocessing
                this.renderer.render(this.scene, this.activeCamera);
                break;
        }
        

        // subsequent async calls to the render loop
        requestAnimationFrame( this.render.bind(this) );

        this.lastCameraName = this.activeCameraName
        this.stats.end()
    }

    // handle keyboard input
    onKeyChange(e, isPressed) {
        switch (e.code) {
            case 'KeyW': this.contents.submarine.setMoveState('forward', isPressed); break;
            case 'KeyS': this.contents.submarine.setMoveState('backward', isPressed); break;
            case 'KeyA': this.contents.submarine.setMoveState('left', isPressed); break;
            case 'KeyD': this.contents.submarine.setMoveState('right', isPressed); break;
            case 'KeyP': this.contents.submarine.setMoveState('up', isPressed); break;
            case 'KeyL': this.contents.submarine.setMoveState('down', isPressed); break;
        }
    }
}


export { MyApp };