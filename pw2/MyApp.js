
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
        this.contents == null

        this.clock = new THREE.Clock();

        // free-fly camera
        this.move = { forward: false, backward: false, left: false, right: false, up: false, down: false };
        this.pitch = 0; // rotation around X (look up/down)
        this.yaw = 0;   // rotation around Y (look left/right)
        this.mouseSensitivity = 0.002;
        this.speed = 10;
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

        // Append Renderer to DOM
        document.getElementById("canvas").appendChild( this.renderer.domElement);

        // input listeners
        window.addEventListener('keydown', (e) => this.onKeyChange(e, true));
        window.addEventListener('keyup', (e) => this.onKeyChange(e, false));
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));

        // manage window resizes
        window.addEventListener('resize', this.onResize.bind(this), false );
    }

    /**
     * initializes all the cameras
     */
    initCameras() {
        
        const aspect = window.innerWidth / window.innerHeight;

        // Aquarium view
        const aquariumCam = new THREE.PerspectiveCamera( 110, aspect, 1, 500);
        aquariumCam.position.set(0,10,20);
        this.cameras['Aquarium View'] = aquariumCam;

        // Underwater view
        const underwaterCam = new THREE.PerspectiveCamera( 90, aspect, 1, 500);
        underwaterCam.position.set(3,5,10);
        this.cameras['UnderWater'] = underwaterCam;

        // Free-Fly view
        const freeFlyCam = new THREE.PerspectiveCamera( 90, aspect, 1, 500);
        freeFlyCam.position.set(3,5,10);
        this.cameras['Free-Fly'] = freeFlyCam;
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
        if (this.activeCameraName === 'Free-Fly' || this.activeCameraName === 'Aquarium View') {
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

            // are the controls yet?
            if (this.controls === null) {
                // Orbit controls allow the camera to orbit around a target.
                this.controls = new OrbitControls( this.activeCamera, this.renderer.domElement );
                this.controls.enableZoom = true;
                this.controls.update();
            }
            else {
                this.controls.object = this.activeCamera
            }

            if (this.activeCameraName === 'Aquarium View') {
                this.controls.enabled = false;
                this.controls.enableZoom = false;
                this.controls.enablePan = false;
                this.controls.enableRotate = false;
            }
        }
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

        // free-fly camera movement
        if (this.activeCameraName === 'Free-Fly') {
            this.updateFreeFlyMovement(delta);
        }

        // required if controls.enableDamping or controls.autoRotate are set to true
        if (this.controls) this.controls.update();

        // render the scene
        this.renderer.render(this.scene, this.activeCamera);

        // subsequent async calls to the render loop
        requestAnimationFrame( this.render.bind(this) );

        this.lastCameraName = this.activeCameraName
        this.stats.end()
    }

    // free-fly camera movement logic
    updateFreeFlyMovement(delta) {
        const camera = this.activeCamera;
        const speed = this.speed * delta;

        camera.rotation.order = 'YXZ';
        camera.rotation.y = this.yaw;  
        camera.rotation.x = this.pitch;

        const forward = new THREE.Vector3(0, 0, -1).applyEuler(camera.rotation);
        const right = new THREE.Vector3(forward.z, 0, -forward.x).normalize();
        const up = new THREE.Vector3(0, 1, 0);

        // Apply movement
        if (this.move.forward) camera.position.addScaledVector(forward, speed);
        if (this.move.backward) camera.position.addScaledVector(forward, -speed);
        if (this.move.left) camera.position.addScaledVector(right, -speed);
        if (this.move.right) camera.position.addScaledVector(right, speed);
        if (this.move.up) camera.position.addScaledVector(up, speed);
        if (this.move.down) camera.position.addScaledVector(up, -speed);
    };

    // handle keyboard input
    onKeyChange(e, isPressed) {
        switch (e.code) {
            case 'KeyW': this.move.forward = isPressed; break;
            case 'KeyS': this.move.backward = isPressed; break;
            case 'KeyA': this.move.left = isPressed; break;
            case 'KeyD': this.move.right = isPressed; break;
            case 'Space': this.move.up = isPressed; break;
            case 'ShiftLeft': this.move.down = isPressed; break;
        }
    }
}


export { MyApp };