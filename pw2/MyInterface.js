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

        // flocking controls
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

        // BVH controls
        const bvhFolder = this.datgui.addFolder('BVH');
        const bvhParams = {bvh : false, bvhHelper: false}
        bvhFolder.add(bvhParams, 'bvh').name('BVH acceleration').onChange((value) =>{
             if (this.contents) this.contents.setBVHMode(value);
        })
        bvhFolder.add(bvhParams, 'bvhHelper').name('BVH helper').onChange((value) =>{
             if (this.contents) this.contents.setBVHHelper(value);
        })

        const boxFolder = this.datgui.addFolder('Bounding Box');
        const boxParams = {boxHelper: false};
        boxFolder.add(boxParams, "boxHelper").name("Bounding Box Helper").onChange((value =>{
            if(this.contents) this.contents.setBoxHelper(value);
        }))

        // submarine light controls
        const submarineFolder = this.datgui.addFolder('Submarine')

        const lightState = {
            frontLight: true,
            warningLight: true,
            frontIntensity: 20.0,
            warningIntensity: 1.5,
            frontLightColor: 0xffffcc,
            frontLightAttenuation: 3,
            warningFlashRate: 0.5
        };

        submarineFolder.add(lightState, 'frontLight')
        .name('Front Light')
        .onChange((value) => {
            if (this.contents.submarine) {
                this.contents.submarine.toggleFrontLight();
                // Update state to match new value
                lightState.frontLight = this.contents.submarine.frontLightEnabled;
            }
        });

        submarineFolder.add(lightState, 'warningLight')
            .name('Warning Light')
            .onChange((value) => {
                if (this.contents.submarine) {
                    this.contents.submarine.toggleWarningLight();
                    lightState.warningLight = this.contents.submarine.warningLightEnabled;
                }
            });

        submarineFolder.add(lightState, 'frontIntensity', 0, 50)
            .name('Front Light Intensity')
            .step(0.1)
            .onChange((value) => {
                if (this.contents.submarine) {
                    this.contents.submarine.setFrontLightIntensity(value);
                }
            });

        submarineFolder.add(lightState, 'warningIntensity', 0, 3)
            .name('Warn Light Intensity')
            .step(0.1)
            .onChange((value) => {
                if (this.contents.submarine) {
                    this.contents.submarine.setWarningLightIntensity(value);
                }
            });

        submarineFolder.addColor(lightState, 'frontLightColor')
            .name('Front Light Color')
            .onChange((value) => {
                if (this.contents.submarine) {
                    this.contents.submarine.setFrontLightColor(value);
                }
            });

        submarineFolder.add(lightState, 'frontLightAttenuation', 1, 10)
            .name('Front Light Attenuation')
            .step(0.1)
            .onChange((value) => {
                if (this.contents.submarine) {
                    this.contents.submarine.setFrontLightDecay(value);
                }
            });

        submarineFolder.add(lightState, 'warningFlashRate', 0.1, 2.0)
            .name('Warning Flash Rate')
            .step(0.1)
            .onChange((value) => {
                if (this.contents.submarine) {
                    this.contents.submarine.setWarningFlashRate(value);
                }
            });

        // Shield controls
        const shieldState = {
            shield: false,
            c: 1.0,
            p: 2.0,
            color: 0x00ffff
        };

        submarineFolder.add(shieldState, 'shield')
            .name('Shield')
            .onChange((value) => {
                if (this.contents.submarine) {
                    this.contents.submarine.toggleShield();
                    shieldState.shield = this.contents.submarine.shieldEnabled;
                }
            });

        submarineFolder.add(shieldState, 'c', 0, 1)
            .name('Shield C')
            .step(0.01)
            .onChange((value) => {
                if (this.contents.submarine) {
                    this.contents.submarine.setShieldC(value);
                }
            });

        submarineFolder.add(shieldState, 'p', 0, 10)
            .name('Shield P')
            .step(0.1)
            .onChange((value) => {
                if (this.contents.submarine) {
                    this.contents.submarine.setShieldP(value);
                }
            });

        submarineFolder.addColor(shieldState, 'color')
            .name('Shield Color')
            .onChange((value) => {
                if (this.contents.submarine) {
                    this.contents.submarine.setShieldColor(value);
                }
            });

        submarineFolder.open();
        

        //Depth of Field controls
        const DOF = {
            focus: 8.0,
            aperture: 0.0004,
            maxBlur: 0.01
        };
        const depthOfFieldFolder = this.datgui.addFolder(' Depth of Field');
        depthOfFieldFolder.add(DOF, "focus", 1, 20)
            .name('Focus')
            .step(0.5)
            .onChange((value) => {
                if(this.app){
                    this.app.postprocessing.submarine.bokeh.uniforms["focus"].value = value;
                    this.app.postprocessing.underwater.bokeh.uniforms["focus"].value = value;
                }

        });
        depthOfFieldFolder.add(DOF, "aperture", 0, 0.002)
            .name('Aperture')
            .step(0.0002)
            .onChange((value) => {
                if(this.app && this.app.postprocessing){
                    this.app.postprocessing.submarine.bokeh.uniforms["aperture"].value = value;
                    this.app.postprocessing.underwater.bokeh.uniforms["aperture"].value = value;
                }
        });
        depthOfFieldFolder.add(DOF, "maxBlur", 0, 0.01)
            .name('Max Blur')
            .step(0.001)
            .onChange((value) => {
                if(this.app && this.app.postprocessing){
                    this.app.postprocessing.submarine.bokeh.uniforms["maxblur"].value = value;
                    this.app.postprocessing.underwater.bokeh.uniforms["maxblur"].value = value;
                }
        });

        depthOfFieldFolder.open();

        const bubbleFolder = this.datgui.addFolder("Bubbles");

        const bubbleLODInfo = { status: this.contents.volcanoBubbles.getLODStatus() };
        bubbleFolder.add(bubbleLODInfo, "status").name("Bubble LOD Status").listen();

        const updateBubbleLODLabel = () => {
        bubbleLODInfo.status = this.contents.volcanoBubbles.getLODStatus();
        requestAnimationFrame(updateBubbleLODLabel);
        };
        updateBubbleLODLabel();
  

        bubbleFolder.open();

    }
}

export { MyInterface };