import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyTable } from './MyTable.js';
import {MyLamp} from './MyLamp.js';
import { MyPencil } from './MyPencil.js';
import { MyBook } from './MyBook.js';
import { MyGlobe } from './MyGlobe.js';
import { MyChair } from './MyChair.js';
import { MyPencilHolder } from './MyPencilHolder.js';


/**
 *  This class contains the contents of out application
 */
class MyContents  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app) {
        this.app = app
        this.axis = null

        // box related attributes
        this.boxMesh = null
        this.boxMeshSize = 1.0
        this.boxEnabled = true
        this.lastBoxEnabled = null
        this.boxDisplacement = new THREE.Vector3(0,2,0)

        this.spotlightEnabled = true;
        this.intensity = 15;
        this.lightDistance = 14;
        this.angle = 30 * Math.PI / 180;
        this.penumbra = 0;
        this.decay = 0;

        // plane related attributes

        //Change plane diffuse and specular color to 50% gray and shiness to 100
        this.diffusePlaneColor = "#808080"
        this.specularPlaneColor = "#808080"
        this.planeShininess = 100
        this.planeMaterial = new THREE.MeshPhongMaterial({ color: this.diffusePlaneColor, 
            specular: this.specularPlaneColor, emissive: "#000000", shininess: this.planeShininess })


        this.spotlight = null
        this.directionalLight = null
    this.spotlightHelper = null
        
    }

    /**
     * builds the box mesh with material assigned
     */
    buildBox() {    
        let boxMaterial = new THREE.MeshPhongMaterial({ color: "#ffff77", 
        specular: "#000000", emissive: "#000000", shininess: 90 })

        // Create a Cube Mesh with basic material
        let box = new THREE.BoxGeometry(  this.boxMeshSize,  this.boxMeshSize,  this.boxMeshSize );
        this.boxMesh = new THREE.Mesh( box, boxMaterial );
        
        this.boxMesh.position.y = this.boxDisplacement.y;
        this.boxMesh.rotateX(Math.PI * 30 / 180 );
        this.boxMesh.rotateX(Math.PI * 30 / 180 );
        this.boxMesh.scale.x = 3;
        this.boxMesh.scale.y = 2;
        this.boxMesh.scale.z = 1;
    }

    /**
     * initializes the contents
     */
    init() {
       
        // create once 
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this)
            this.app.scene.add(this.axis)
        }

        // add a point light on top of the model

        // Change position of light source from (0,20,0) to (0,-20,0)

        // 4.2 Comment code relative to point light and increase ambient light intensity to a value of 0x444444
        
        /*
        const pointLight = new THREE.PointLight( 0xffffff, 500, 0 );
        pointLight.position.set( 0, -20, 0 );
        this.app.scene.add( pointLight );

        // add a point light helper for the previous point light
        const sphereSize = 0.5;
        const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
        this.app.scene.add( pointLightHelper );
        */

        // create a directional light source
        const directionalLight = new THREE.DirectionalLight( 0xffffff, 1);
        directionalLight.position.set( 0, 10, 0);
        directionalLight.target.position.set(1,0,1);
        this.app.scene.add( directionalLight );
        this.directionalLight = directionalLight

        // add a directional light helper for the previous directional light

        const directionalLightHelper = new THREE.DirectionalLightHelper( directionalLight, 0.5);
        this.app.scene.add( directionalLightHelper );

        // create a spotlight light source
        
        const spotlight = new THREE.SpotLight( 0xffffff, this.intensity, this.lightDistance, this.angle, this.penumbra, this.decay);
        spotlight.position.set( 5, 10, 2);
        spotlight.target.position.set(1,0,1);
        this.app.scene.add( spotlight );
        this.app.scene.add( spotlight.target );
        this.spotlight = spotlight;

        //spotlight helper
        this.spotlightHelper = new THREE.SpotLightHelper( spotlight );
        this.app.scene.add( this.spotlightHelper );



        // add an ambient light and make it pure red
        const ambientLight = new THREE.AmbientLight( 0x444444 ); // soft white light
        this.app.scene.add( ambientLight );

        //this.buildBox()
        
        this.floorWidth = 10;
        this.floorHeight = 10;
        //create the texture that will be used in the floor
        let floorTexture = new THREE.TextureLoader().load("./textures/floor.png");
        floorTexture.wrapS = THREE.RepeatWrapping;
        floorTexture.wrapT = THREE.RepeatWrapping;
        //using proportions to make the floor texture repeat accordingly to the width and height of the floor
        floorTexture.repeat.set(this.floorWidth * 4 / 10,this.floorHeight * 4 / 10);

        // Create a Plane to use as the floor
        let plane = new THREE.PlaneGeometry(this.floorWidth, this.floorHeight);
        let material = new THREE.MeshPhongMaterial({map: floorTexture, color: "#ff0000"});
        this.planeMesh = new THREE.Mesh(plane, material);
        this.planeMesh.rotation.x = -Math.PI / 2;
        this.planeMesh.position.y = -0;
        this.app.scene.add(this.planeMesh);

        let wallMaterial = new THREE.MeshPhongMaterial({ color: "#ffffff" });
        let wallHeight = 10;
        let floorSize = 10;

        //back wall
        let wall1 = new THREE.Mesh(new THREE.PlaneGeometry(floorSize, wallHeight), wallMaterial);
        wall1.position.set(0, wallHeight/2, -floorSize/2);
        this.app.scene.add(wall1);

        //front wall
        let wall2 = new THREE.Mesh(new THREE.PlaneGeometry(floorSize, wallHeight), wallMaterial);
        wall2.position.set(0, wallHeight/2, floorSize/2);
        wall2.rotation.y = Math.PI;
        this.app.scene.add(wall2);

        //left wall
        let wall3 = new THREE.Mesh(new THREE.PlaneGeometry(floorSize, wallHeight), wallMaterial);
        wall3.position.set(-floorSize/2, wallHeight/2, 0);
        wall3.rotation.y = Math.PI/2;
        this.app.scene.add(wall3);
        
        //right wall
        let wall4 = new THREE.Mesh(new THREE.PlaneGeometry(floorSize, wallHeight), wallMaterial);
        wall4.position.set(floorSize/2, wallHeight/2, 0);
        wall4.rotation.y = -Math.PI/2;
        this.app.scene.add(wall4);

        //table
        const tableWidth = 4;
        const tableTopHeight = 0.2;
        const tableDepth = 2;
        const legRadius = 0.1;
        const legHeight = 1;
        let table = new MyTable(tableWidth, tableTopHeight, tableDepth, legRadius, legHeight);
        table.position.set(0, 0, 0);
        this.app.scene.add(table);

        const tableTopY = legHeight + tableTopHeight + 0.01;

        //lamp
        let lamp = new MyLamp(0.5, 0.6);
        lamp.position.set(1.3,tableTopY,-0.5);
        this.app.scene.add(lamp);

        //pencil
        const pencilLenght = 0.25;
        const pencilWidth = 0.02;
        let pencil = new MyPencil(pencilLenght, pencilWidth);
        pencil.position.set(-0.4,tableTopY + pencilWidth / 2,0.5);
        pencil.rotateX(- Math.PI / 2);
        this.app.scene.add(pencil);

        //book1
        const bookWidth = 0.4;
        const bookLength = 0.6;
        const bookThickness = 0.1;
        let book1 = new MyBook(bookLength,bookWidth, bookThickness);
        book1.position.set(-0.9, tableTopY + bookThickness / 2, 0.75);
        book1.rotateX(- Math.PI / 2);
        this.app.scene.add(book1);

        //book2
        let book2 = new MyBook(bookLength,bookWidth, bookThickness, "#ff0000");
        book2.position.set(0.6, tableTopY + bookThickness / 2, 0.75);
        book2.rotateX(- Math.PI / 2);
        this.app.scene.add(book2);

        //pencil2
        let pencil2 = new MyPencil(pencilLenght, pencilWidth);
        pencil2.position.set(1.15,tableTopY + pencilWidth / 2,0.5);
        pencil2.rotateX(- Math.PI / 2);
        this.app.scene.add(pencil2);

        //globe
        let globe = new MyGlobe(0.25, 0.1, 0.15, 0.05);
        globe.position.set(-1.3,tableTopY,-0.5);
        this.app.scene.add(globe);

        //chair number 1
        let chair1 = new MyChair(1, 0.2, 1, 0.05, 0.5, "#8B4513");
        chair1.position.set(-0.75,-0,1.5);   
        this.app.scene.add(chair1);

        //chair number 2
        let chair2 = new MyChair(1, 0.2, 1, 0.05, 0.5, "#8B4513");
        chair2.position.set(0.75,-0,1.5);   
        this.app.scene.add(chair2);

        //pencil holder
        let pencilHolder = new MyPencilHolder(0.10, 0.25, "#00FF00");
        pencilHolder.position.set(-0.7,tableTopY,-0.5);
        this.app.scene.add(pencilHolder);
    }
    
    /**
     * updates the diffuse plane color and the material
     * @param {THREE.Color} value 
     */
    updateDiffusePlaneColor(value) {
        this.diffusePlaneColor = value
        this.planeMaterial.color.set(this.diffusePlaneColor)
    }
    /**
     * updates the specular plane color and the material
     * @param {THREE.Color} value 
     */
    updateSpecularPlaneColor(value) {
        this.specularPlaneColor = value
        this.planeMaterial.specular.set(this.specularPlaneColor)
    }
    /**
     * updates the plane shininess and the material
     * @param {number} value 
     */
    updatePlaneShininess(value) {
        this.planeShininess = value
        this.planeMaterial.shininess = this.planeShininess
    }
    
    /**
     * rebuilds the box mesh if required
     * this method is called from the gui interface
     */
    rebuildBox() {
        // remove boxMesh if exists
        if (this.boxMesh !== undefined && this.boxMesh !== null) {  
            this.app.scene.remove(this.boxMesh)
        }
        this.buildBox();
        this.lastBoxEnabled = null
    }

    updateSpotlightColor(value) {
        if (this.spotlight) this.spotlight.color.set(value)
    }

    toggleSpotlight(value) {
        if (this.spotlight) {
            this.spotlight.visible = value;
            this.spotlightEnabled = value;
            if (this.spotlightHelper) this.spotlightHelper.visible = value;
            if (this.spotlight.target) this.spotlight.target.visible = value;
        }
    }
    /**
     * updates the box mesh if required
     * this method is called from the render method of the app
     * updates are trigered by boxEnabled property changes
     */
    updateBoxIfRequired() {
        /*
        if (this.boxEnabled !== this.lastBoxEnabled) {
            this.lastBoxEnabled = this.boxEnabled
            if (this.boxEnabled) {
                this.app.scene.add(this.boxMesh)
            }
            else {
                this.app.scene.remove(this.boxMesh)
            }
        }*/
    }

    /**
     * updates the contents
     * this method is called from the render method of the app
     * 
     */
    update() {
        // check if box mesh needs to be updated
        this.updateBoxIfRequired()

        // update spotlight helper to follow the light's position/target
        if (this.spotlightHelper) this.spotlightHelper.update();

        // sets the box mesh position based on the displacement vector
        /*
        this.boxMesh.position.x = this.boxDisplacement.x
        this.boxMesh.position.y = this.boxDisplacement.y
        this.boxMesh.position.z = this.boxDisplacement.z
        */
        
    }

}

export { MyContents };