import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyTable } from './MyTable.js';
import {MyLamp} from './MyLamp.js';
import { MyPencil } from './MyPencil.js';
import { MyBook } from './MyBook.js';
import { MyGlobe } from './MyGlobe.js';
import { MyChair } from './MyChair.js';
import { MyPencilHolder } from './MyPencilHolder.js';
import { MyPainting } from './MyPainting.js';
import { MyWindow } from './MyWindow.js';
import { MyBookshelf } from './MyBookshelf.js';
import { MyDoor } from './MyDoor.js';
import { MyExitSign } from './MyExitSign.js';
import { MyDiamond } from './MyDiamond.js';
import { MyRubber } from './MyRubber.js';

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
        this.axisEnabled = true;

        this.floorSize = 10;
        this.wallHeight = 5;

        //lamp
        this.lamp = null;
        this.lampEnabled = true;

        // box related attributes
        this.boxMesh = null
        this.boxMeshSize = 1.0
        this.boxEnabled = true
        this.lastBoxEnabled = null
        this.boxDisplacement = new THREE.Vector3(0,2,0);

        this.wrapMode = "Clamp To Edge";

        this.spotlightEnabled = true;
        this.intensity = 15;
        this.lightDistance = 14;
        this.angle = 15 * Math.PI / 180;
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

    // initializes the scene contents
    init() {
        this.initTextures();
        this.initObjects();
        this.initLights();
    }

    initLights() {


        // add a point light on top of the model

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
        /*
        const directionalLight = new THREE.DirectionalLight( 0xffffff, 1);
        directionalLight.position.set( 0, 10, 0);
        directionalLight.target.position.set(1,0,1);
        this.app.scene.add( directionalLight );
        this.directionalLight = directionalLight;
        */


        // add a directional light helper for the previous directional light

        //const directionalLightHelper = new THREE.DirectionalLightHelper( directionalLight, 0.5);
        //this.app.scene.add( directionalLightHelper );


        // create a spotlight light source
        
        /*
        const spotlight = new THREE.SpotLight( 0xffffff, this.intensity, this.lightDistance, this.angle, this.penumbra, this.decay);
        spotlight.position.set( 5, 10, 2);
        spotlight.target.position.set(1,0,1);
        this.app.scene.add( spotlight );
        this.app.scene.add( spotlight.target );
        this.spotlight = spotlight;

        //spotlight helper
        this.spotlightHelper = new THREE.SpotLightHelper( spotlight );
        this.app.scene.add( this.spotlightHelper );
        */


        // add an ambient light and make it pure red
        const ambientLight = new THREE.AmbientLight( 0xffffff, 0.1); // soft white light
        this.app.scene.add( ambientLight );

        
        //inserts a light behind the window (simulate the sun light)
        this.sunlight = new THREE.DirectionalLight(0xffffff,5); 
        this.sunlight.position.set(this.floorSize/2 + 0.5 , this.wallHeight/2 + 1, 0); 
        this.sunlight.target.position.set(0, 0, 0); 

        this.app.scene.add(this.sunlight);
        this.app.scene.add(this.sunlight.target);

        // Point light to simulate glow
        const exitLight = new THREE.PointLight(0x0BA14A, 1, 5);
        exitLight.position.set(0,this.doorHeight + this.signHeight / 2 + 0.2, this.floorSize / 2 - 0.1); // Place behind the sign
        this.app.scene.add(exitLight);
    }

    initTextures() {
        //floor texture
        //create the texture that will be used in the floor
        this.floorTexture = new THREE.TextureLoader().load("./textures/floor.png");
        this.floorTexture.wrapS = THREE.RepeatWrapping;
        this.floorTexture.wrapT = THREE.RepeatWrapping;
        //using proportions to make the floor texture repeat accordingly to the width and height of the floor
        this.floorTexture.repeat.set(this.floorSize * 10 / this.floorSize,this.floorSize * 10 / this.floorSize);

        // wall texture
        this.wallTexture = new THREE.TextureLoader().load("./textures/walltext.jpg");
        this.wallTexture.wrapS = THREE.RepeatWrapping;
        this.wallTexture.wrapT = THREE.RepeatWrapping;
        this.wallTexture.repeat.set(1, 1);

        // book textures
        this.blueBookTexture = new THREE.TextureLoader().load("./textures/seamless-book-cover.jpg");
        this.redBookTexture = new THREE.TextureLoader().load("./textures/grungy-front-book-cover.jpg");

        // painting textures
        this.paintingTextures = [
            new THREE.TextureLoader().load("./textures/Pedro.jpg"),
            new THREE.TextureLoader().load("./textures/Alex.jpg"),
            new THREE.TextureLoader().load("./textures/Lucas.jpg")
        ];

        // window landscape texture
        this.windowTexture = new THREE.TextureLoader().load("./textures/window_texture.jpg");

        // Rug texture
        this.rugTexture = new THREE.TextureLoader().load("./textures/rug.jpg");

        //Door texture
        this.doorTexture = new THREE.TextureLoader().load("./textures/door.jpg");

        // wood texture
        this.woodTexture = new THREE.TextureLoader().load("./textures/wood.jpg");

        // exit sign texture
        this.exitSignTexture = new THREE.TextureLoader().load("./textures/exit.jpeg");

        // globe texture
        this.earthTexture = new THREE.TextureLoader().load("./textures/earth.jpg");

    }

    initObjects() {
        // create once 
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this)
            this.app.scene.add(this.axis)
        }

        //this.buildBox()

        // -----Floor-----
        // Create a Plane to use as the floor
        const floorGeometry = new THREE.PlaneGeometry(this.floorSize, this.floorSize);
        const floorMaterial = new THREE.MeshPhongMaterial({map: this.floorTexture, color: "#ffffff"});
        this.planeMesh = new THREE.Mesh(floorGeometry, floorMaterial);
        this.planeMesh.rotation.x = -Math.PI / 2;
        this.planeMesh.position.y = -0;
        this.app.scene.add(this.planeMesh);

        // -----Walls-----
        const wallGeometry = new THREE.PlaneGeometry(this.floorSize, this.wallHeight);
        const wallMaterial = new THREE.MeshPhongMaterial({ color: "#ffffff" , shininess: 0, specular: "#000000"});
        
        //back wall
        this.wall1 = new THREE.Mesh(wallGeometry, new THREE.MeshPhongMaterial({ map: this.wallTexture }));
        this.wall1.position.set(0, this.wallHeight/2, -this.floorSize/2);
        this.app.scene.add(this.wall1);
        
        //front wall
        this.wall2 = new THREE.Mesh(wallGeometry, new THREE.MeshPhongMaterial({ map: this.wallTexture }));
        this.wall2.position.set(0, this.wallHeight/2, this.floorSize/2);
        this.wall2.rotation.y = Math.PI;
        this.app.scene.add(this.wall2);

        //left wall
        this.wall3 = new THREE.Mesh(wallGeometry, new THREE.MeshPhongMaterial({ map: this.wallTexture }));
        this.wall3.position.set(-this.floorSize/2, this.wallHeight/2, 0);
        this.wall3.rotation.y = Math.PI/2;
        this.app.scene.add(this.wall3);
        
        //right wall
        this.wall4 = new THREE.Mesh(wallGeometry, new THREE.MeshPhongMaterial({ map: this.wallTexture }));
        this.wall4.position.set(this.floorSize/2, this.wallHeight/2, 0);
        this.wall4.rotation.y = -Math.PI/2;
        this.app.scene.add(this.wall4);

        //-----table-----
        // table dimensions
        const tableWidth = 4;
        const tableTopHeight = 0.2;
        const tableDepth = 2;
        const legRadius = 0.1;
        const legHeight = 1;

        this.table = new MyTable(tableWidth, tableTopHeight, tableDepth, legRadius, legHeight, this.woodTexture);
        this.table.position.set(0, 0, 0);
        this.app.scene.add(this.table);

        // y coordinate of the top of the table
        this.tableTopY = legHeight + tableTopHeight + 0.01;

        // -----Lamp-----
        this.lamp = new MyLamp(0.5, 0.6);
        this.lamp.position.set(1.3,this.tableTopY,-0.5);
        this.app.scene.add(this.lamp);

        // ----- Pencils -----
        // pencil dimensions
        const pencilLength = 0.25;
        const pencilWidth = 0.02;

        this.pencil = new MyPencil(pencilLength, pencilWidth);
        this.pencil.position.set(-0.4,this.tableTopY + pencilWidth / 2,0.5);
        this.pencil.rotateX(- Math.PI / 2);
        this.app.scene.add(this.pencil);

        this.pencil2 = new MyPencil(pencilLength, pencilWidth);
        this.pencil2.position.set(1.15,this.tableTopY + pencilWidth / 2,0.5);
        this.pencil2.rotateX(- Math.PI / 2);
        this.app.scene.add(this.pencil2);

        // ---- Rubbers ------
        const rubberHeight = 0.02;
        const rubberWidth = 0.1;
        const rubberDepth = 0.05;
        this.rubber1 = new MyRubber(rubberWidth, rubberHeight, rubberDepth, 0x9999ff);
        this.rubber2 = new MyRubber(rubberWidth, rubberHeight, rubberDepth, 0xff9999);
        this.rubber1.position.set(-0.3,this.tableTopY, 0.4);
        this.rubber2.position.set(1.25,this.tableTopY + rubberHeight / 2, 0.4);
        this.rubber1.rotateY(Math.PI / 2);
        this.rubber2.rotateY(Math.PI / 2);
        this.app.scene.add(this.rubber1);
        this.app.scene.add(this.rubber2);

        // -----Books-----
        // book dimensions
        const bookWidth = 0.4;
        const bookLength = 0.6;
        const bookThickness = 0.1;

        //book1
        this.book1 = new MyBook(bookLength,bookWidth, bookThickness, "#0000ff", this.blueBookTexture);
        this.book1.position.set(-0.9, this.tableTopY + bookThickness / 2, 0.75);
        this.book1.rotateX(- Math.PI / 2);
        this.app.scene.add(this.book1);

        //book2
        this.book2 = new MyBook(bookLength,bookWidth, bookThickness, "#ff0000", this.redBookTexture);
        this.book2.position.set(0.6, this.tableTopY + bookThickness / 2, 0.75);
        this.book2.rotateX(- Math.PI / 2);
        this.app.scene.add(this.book2);

        //-----Globe-----
        this.globe = new MyGlobe(0.25, 0.1, 0.15, 0.05, this.earthTexture);
        this.globe.position.set(-1.3, this.tableTopY, -0.5);
        this.app.scene.add(this.globe);

        //-----Chairs-----
        //chair number 1
        this.chair1 = new MyChair(1, 0.2, 1, 0.05, 0.5, "#8B4513", this.woodTexture);
        this.chair1.position.set(-0.75,-0,1.5);   
        this.app.scene.add(this.chair1);

        //chair number 2
        this.chair2 = new MyChair(1, 0.2, 1, 0.05, 0.5, "#8B4513", this.woodTexture);
        this.chair2.position.set(0.75,-0,1.5);   
        this.app.scene.add(this.chair2);

        //-----pencil holder-----
        this.pencilHolder = new MyPencilHolder(0.10, 0.25, "#00FF00");
        this.pencilHolder.position.set(-0.7,this.tableTopY,-0.5);
        this.app.scene.add(this.pencilHolder);

        // -----Painting-----
        const paintingsWidth = 2;
        const paintingsHeight = 2;
        const frameWidth = 0.1;
        const xSpacePaintings = this.floorSize / 3; //space between the paintings considering the wall size
        const firstPaintingPosition = - this.floorSize / 2 + paintingsWidth / 2 + frameWidth * 2 + xSpacePaintings  / 2 - (paintingsWidth / 2 + frameWidth * 2); //position of the first painting
       
        this.paintings = [];

        this.paintingTextures.forEach((texture, i) => {
            const painting = new MyPainting(paintingsWidth, paintingsHeight, frameWidth, texture);
            painting.position.set(firstPaintingPosition + i * xSpacePaintings, this.wallHeight / 2 - paintingsHeight / 2, -this.floorSize / 2 + 0.05 + (i === 0 ? 0.05 : 0)); 
            this.app.scene.add(painting);
            this.paintings.push(painting);
        });

        // -----Window with a landscape-----
        this.window = new MyWindow(2,2,0.1, this.windowTexture);
        this.window.position.set(this.floorSize/2 - 0.05, this.wallHeight/2 - 1, 0)
        this.window.rotateY(-Math.PI / 2);
        this.app.scene.add(this.window);

        // -----bookshelf-----
        this.bookshelf = new MyBookshelf(2, 0.5, 5, "#8B4513", this.woodTexture, this.redBookTexture, this.blueBookTexture);
        this.bookshelf.position.set(-4.75, 0, 4);
        this.bookshelf.rotateY(Math.PI / 2);
        this.app.scene.add(this.bookshelf);

        // -----rug------
        this.rugMaterial = new THREE.MeshPhongMaterial({ map: this.rugTexture, color: 0xcccccc});
        this.rug = new THREE.Mesh(new THREE.PlaneGeometry(6, 5), this.rugMaterial);

        this.rug.rotation.x = -Math.PI / 2; 
        this.rug.position.set(0, 0.01, 0);

        this.app.scene.add(this.rug);

        // -----Door-------
        this.doorHeight = 4;
        this.door = new MyDoor(2,this.doorHeight,0.2, this.doorTexture, "#8B4513");
        this.door.position.set(0,0,this.floorSize / 2 - 0.1);
        this.door.rotation.y = Math.PI;
        this.app.scene.add(this.door);

        // ----Exit Sign -----
        this.signHeight = 0.5;
        this.exitSign = new MyExitSign(1,this.signHeight, this.exitSignTexture);
        this.exitSign.position.set(0,this.doorHeight + 0.2,this.floorSize / 2 - 0.05);
        this.exitSign.rotation.y = Math.PI;
        this.app.scene.add(this.exitSign);


        // ----- Diamond on a box -----
        this.diamond = new MyDiamond(0.2, 0.2, 0x000000, 0x00FFFF);
        this.diamond.position.set(0.6, this.tableTopY, -0.5);
        this.app.scene.add(this.diamond);
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
     * Updates the wall texture wrap mode
     * @param {string} value 
     */
    updateWallWrap(value){
        this.wrapMode = value;
        if(value === "Repeat"){
            this.wall1Texture.wrapS = THREE.RepeatWrapping;
            this.wall1Texture.wrapT = THREE.RepeatWrapping;
        }
        else if(value === "Clamp to Edge"){

            this.wall1Texture.wrapS = THREE.ClampToEdgeWrapping;
            this.wall1Texture.wrapT = THREE.ClampToEdgeWrapping;
        }

        this.wall1Texture.needsUpdate = true;
        this.wall1.material.map = this.wall1Texture;
        this.wall1.material.needsUpdate = true;
    

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

    toggleLampLight(value){
        this.lamp.toggleBulbLight(value);
        this.lampEnabled = value;
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

        if (this.globe) {
            this.globe.update(0.005);
        }
        
    }

}

export { MyContents };