
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { MyContents } from './MyContents.js';
import Stats from 'three/addons/libs/stats.module.js'
import { MyInterface } from './MyInterface.js';

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
    }

    /**
     * initializes all the cameras
     */
    initCameras() {
        
        const aspect = window.innerWidth / window.innerHeight;

        // Aquarium view
        const aquariumCam = new THREE.PerspectiveCamera(110, aspect, 1, 500);
        aquariumCam.position.set(0,10,20);
        this.cameras['Aquarium View'] = aquariumCam;

        // Underwater view
        const underwaterCam = new THREE.PerspectiveCamera(90, aspect, 1, 500);
        underwaterCam.position.set(3,5,10);
        this.cameras['UnderWater'] = underwaterCam;

        // Submarine view
        const freeFlyCam = new THREE.PerspectiveCamera(75, aspect, 1, 500);
        freeFlyCam.position.set(5,4,5);
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
    }

    /**
     * the window resize handler
     */
    onResize() {
        if (this.activeCamera !== undefined && this.activeCamera !== null) {
            this.activeCamera.aspect = window.innerWidth / window.innerHeight;
            this.activeCamera.updateProjectionMatrix();
            this.renderer.setSize( window.innerWidth, window.innerHeight );
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
    * the main render function. Called in a requestAnimationFrame loop
    */
    render () {
        this.stats.begin()
        this.updateCameraIfRequired()

        const delta = this.clock.getDelta();
        if (this.contents) this.contents.update(delta);


        // update the animation if contents were provided
        if (this.activeCamera !== undefined && this.activeCamera !== null) {
            this.contents.update(delta);    
        }

        // submarine camera movement
        if (this.activeCameraName === 'Submarine') {
            this.updateSubmarineMovement(delta);
        }

        // required if controls.enableDamping or controls.autoRotate are set to true
        if (this.controls && this.activeCameraName !== 'Submarine') {
            this.controls.update();
        }

        // render the scene
        this.renderer.render(this.scene, this.activeCamera);

        // subsequent async calls to the render loop
        requestAnimationFrame( this.render.bind(this) );

        this.lastCameraName = this.activeCameraName
        this.stats.end()
    }

    // handle keyboard input
    onKeyChange(e, isPressed) {
        switch (e.code) {
            case 'KeyW': this.move.forward = isPressed; break;
            case 'KeyS': this.move.backward = isPressed; break;
            case 'KeyA': this.move.left = isPressed; break;
            case 'KeyD': this.move.right = isPressed; break;
            case 'KeyP': this.move.up = isPressed; break;
            case 'KeyL': this.move.down = isPressed; break;
        }
    }
}


export { MyApp };