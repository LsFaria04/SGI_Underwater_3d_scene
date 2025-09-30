import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { MyApp } from './MyApp.js';
import { MyContents } from './MyContents.js';

/**
    This class customizes the gui interface for the app
*/
class MyGuiInterface  {

    /**
     * 
     * @param {MyApp} app The application object 
     */
    constructor(app) {
        this.app = app
        this.datgui =  new GUI();
        this.contents = null
    }

    /**
     * Set the contents object
     * @param {MyContents} contents the contents objects 
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


        // add a folder to the gui interface for the box
        const boxFolder = this.datgui.addFolder( 'Box' );
        // note that we are using a property from the contents object 
        boxFolder.add(this.contents, 'boxMeshSize', 0, 10).name("size").onChange( () => { this.contents.rebuildBox() } );
        boxFolder.add(this.contents, 'boxEnabled', true).name("enabled");
        boxFolder.add(this.contents.boxDisplacement, 'x', -5, 5)
        boxFolder.add(this.contents.boxDisplacement, 'y', -5, 5)
        boxFolder.add(this.contents.boxDisplacement, 'z', -5, 5)
        boxFolder.open()
        
        const data = {  
            'diffuse color': this.contents.diffusePlaneColor,
            'specular color': this.contents.specularPlaneColor,
            'spotlight color': '#ffffff'
        };

        // adds a folder to the gui interface for the plane
        const planeFolder = this.datgui.addFolder( 'Plane' );
        planeFolder.addColor( data, 'diffuse color' ).onChange( (value) => { this.contents.updateDiffusePlaneColor(value) } );
        planeFolder.addColor( data, 'specular color' ).onChange( (value) => { this.contents.updateSpecularPlaneColor(value) } );
        planeFolder.add(this.contents, 'planeShininess', 0, 1000).name("shininess").onChange( (value) => { this.contents.updatePlaneShininess(value) } );
        planeFolder.open();

        // adds a folder to the gui interface for the camera
        const cameraFolder = this.datgui.addFolder('Camera')
        cameraFolder.add(this.app, 'activeCameraName', [ 'Perspective', 'Perspective2', 'Left', 'Right', 'Top', 'Front' , 'Back' ] ).name("active camera");
        // note that we are using a property from the app 
        cameraFolder.add(this.app.activeCamera.position, 'x', 0, 10).name("x coord")
        cameraFolder.open()

        const lampLight = this.datgui.addFolder('lampLight');
        lampLight.add(this.contents, 'lampEnabled').name("enabled").onChange( (value) => { this.contents.toggleLampLight(value) } );

        const wallFolder = this.datgui.addFolder("Wall");
        wallFolder.add(this.contents, "wrapMode", ["Repeat", "Clamp to Edge"]).name("Wrap Mode").onChange((value) =>{this.contents.updateWallWrap(value)})
        wallFolder.open();

        const lightFolder = this.datgui.addFolder('SpotLight')
        lightFolder.add(this.contents, 'spotlightEnabled', true).name("enabled").onChange( (value) => { this.contents.toggleSpotlight(value) } );
        lightFolder.addColor( data, 'spotlight color' ).onChange( (value) => { this.contents.updateSpotlightColor(value) } );
        lightFolder.add(this.contents.spotlight, 'intensity', 0, 1000).name("intensity");
        lightFolder.add(this.contents.spotlight, 'distance', 0, 100).name("distance");
        const initialAngleRad = (this.contents.spotlight && this.contents.spotlight.angle !== undefined) ? this.contents.spotlight.angle : (this.contents.angle !== undefined ? this.contents.angle : 0);
        const angleObj = { angleDeg: Math.ceil(initialAngleRad * 180 / Math.PI) };
        lightFolder.add(angleObj, 'angleDeg', 0, 90).name('angle (deg)').onChange((deg) => {
            const rad = deg * Math.PI / 180;
            
            if (this.contents.spotlight) this.contents.spotlight.angle = rad;
            this.contents.angle = rad;
        });
        lightFolder.add(this.contents.spotlight, 'penumbra', 0, 1).name("penumbra");
        lightFolder.add(this.contents.spotlight, 'decay', 0, 2).name("decay");
        lightFolder.add(this.contents.spotlight.position, 'y', -20, 20).name("y coord");
        lightFolder.add(this.contents.spotlight.target.position, 'x', -20, 20).name("x coord target");
        lightFolder.add(this.contents.spotlight.target.position, 'y', -20, 20).name("y coord target");
        lightFolder.add(this.contents.spotlight.target.position, 'z', -20, 20).name("z coord target");
        lightFolder.open();

    }
}

export { MyGuiInterface };