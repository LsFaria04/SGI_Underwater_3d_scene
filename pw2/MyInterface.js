import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { MyApp } from './MyApp.js';
import { MyContents } from './MyContents.js';

/**
    This class customizes the gui interface for the app
*/
class MyInterface  {

    /**
     * 
     * @param {MyApp} app The application object 
     */
    constructor(app) {
        this.app = app
        this.datgui =  new GUI();
        this.scene = null
    }

    /**
     * Set the scene object
     * @param {MyContents} contents the scene objects 
     */
    setContents(contents) {
        this.contents = contents
    }

    /**
     * Initialize the gui interface
     */
    init() {
        const axisFolder = this.datgui.addFolder('Axis');
        axisFolder.add(this.contents, 'axisEnabled').name("enabled").onChange( (value) => { this.contents.toggleAxis(value) } );
        axisFolder.open();

        // adds a folder to the gui interface for the camera
        const cameraFolder = this.datgui.addFolder('Camera')
        cameraFolder.add(this.app, 'activeCameraName', [ 'Aquarium View', 'UnderWater', 'Submarine'] ).name("active camera");
        cameraFolder.open()

        const displayFolder = this.datgui.addFolder('Display')
        const params = { wireframe: false };
        displayFolder.add(params, 'wireframe').name('Wireframe Mode').onChange((value) => {
            if (this.contents) this.contents.setWireframeMode(value);
        });
        displayFolder.open();

        const flockingParams = {
            separation: 1.0,
            alignment: 1.0,
            cohesion: 1.0,
            maxSpeed: 2.0
        };
        const flockingFolder = this.datgui.addFolder('Flocking')
        flockingFolder.add(flockingParams, 'separation', 0, 5).step(0.1).onChange((value) =>{
            this.contents.fishesFlockingParams.separation = value;
            this.contents.updateSchoolsOfFish();
            
        });
        flockingFolder.add(flockingParams, 'alignment', 0, 5).step(0.1).onChange((value) =>{
            this.contents.fishesFlockingParams.alignment = value;
            this.contents.updateSchoolsOfFish();
        });
        flockingFolder.add(flockingParams, 'cohesion', 0, 5).step(0.1).onChange((value) =>{
            this.contents.fishesFlockingParams.cohesion = value;
            this.contents.updateSchoolsOfFish();
        });
        flockingFolder.add(flockingParams, 'maxSpeed', 0, 5).step(0.1).onChange((value) =>{
            this.contents.fishesFlockingParams.maxSpeed = value;
            this.contents.updateSchoolsOfFish();
        });
        flockingFolder.open();

        const bvhFolder = this.datgui.addFolder('BVH');
        const bvhParams = {bvh : false, bvhHelper: false}
        bvhFolder.add(bvhParams, 'bvh').name('BVH acceleration').onChange((value) =>{
             if (this.contents) this.contents.setBVHMode(value);
        })
        bvhFolder.add(bvhParams, 'bvhHelper').name('BVH helper').onChange((value) =>{
             if (this.contents) this.contents.setBVHHelper(value);
        })


    }
}

export { MyInterface };