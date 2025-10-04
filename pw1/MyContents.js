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
import { MyClock } from './MyClock.js';

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
        
    }

    // initializes the scene contents
    init() {
        this.initTextures();
        this.initObjects();
        this.initLights();
    }

    initLights() {

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

        // clock texture
        this.clockTexture = new THREE.TextureLoader().load('./textures/clock.jpeg');

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
        this.table.add(this.lamp);

        // ----- Pencils -----
        // pencil dimensions
        const pencilLength = 0.25;
        const pencilWidth = 0.02;

        this.pencil = new MyPencil(pencilLength, pencilWidth);
        this.pencil.position.set(-0.4,this.tableTopY + pencilWidth / 2,0.5);
        this.pencil.rotateX(- Math.PI / 2);
        this.table.add(this.pencil);

        this.pencil2 = new MyPencil(pencilLength, pencilWidth);
        this.pencil2.position.set(1.15,this.tableTopY + pencilWidth / 2,0.5);
        this.pencil2.rotateX(- Math.PI / 2);
        this.table.add(this.pencil2);

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
        this.table.add(this.rubber1);
        this.table.add(this.rubber2);

        // -----Books-----
        // book dimensions
        const bookWidth = 0.4;
        const bookLength = 0.6;
        const bookThickness = 0.1;

        //book1
        this.book1 = new MyBook(bookLength,bookWidth, bookThickness, "#0000ff", this.blueBookTexture);
        this.book1.position.set(-0.9, this.tableTopY + bookThickness / 2, 0.75);
        this.book1.rotateX(- Math.PI / 2);
        this.table.add(this.book1);

        //book2
        this.book2 = new MyBook(bookLength,bookWidth, bookThickness, "#ff0000", this.redBookTexture);
        this.book2.position.set(0.6, this.tableTopY + bookThickness / 2, 0.75);
        this.book2.rotateX(- Math.PI / 2);
        this.table.add(this.book2);

        //-----Globe-----
        this.globe = new MyGlobe(0.25, 0.1, 0.15, 0.05, this.earthTexture);
        this.globe.position.set(-1.3, this.tableTopY, -0.5);
        this.table.add(this.globe);

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
        this.table.add(this.pencilHolder);

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
        this.table.add(this.diamond);

        // ------- Clock ------------
        this.clock = new MyClock(0.5, 0.2, this.clockTexture);
        this.clock.position.set(- this.floorSize / 2, this.wallHeight / 2, 0);
        this.clock.rotation.z = Math.PI / 2;
        this.clock.rotation.y = Math.PI;
        
        this.app.scene.add(this.clock);
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
     * updates the contents
     * this method is called from the render method of the app
     * 
     */
    update() {
        if (this.globe) {
            this.globe.update(0.005);
        }
        
    }

}

export { MyContents };