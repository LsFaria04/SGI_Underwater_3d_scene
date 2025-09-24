import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyTable } from './MyTable.js';
import {MyLamp} from './MyLamp.js';
import { MyPencil } from './MyPencil.js';
import { MyBook } from './MyBook.js';


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

        // plane related attributes
        this.diffusePlaneColor = "#d4b68e"
        this.specularPlaneColor = "#777777"
        this.planeShininess = 30
        this.planeMaterial = new THREE.MeshPhongMaterial({ color: this.diffusePlaneColor, 
            specular: this.specularPlaneColor, emissive: "#000000", shininess: this.planeShininess })
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
        const pointLight = new THREE.PointLight( 0xffffff, 500, 0 );
        pointLight.position.set( 0, 20, 0 );
        this.app.scene.add( pointLight );

        // add a point light helper for the previous point light
        const sphereSize = 0.5;
        const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
        this.app.scene.add( pointLightHelper );

        // add an ambient light
        const ambientLight = new THREE.AmbientLight( 0x555555 );
        this.app.scene.add( ambientLight );

        //this.buildBox()
        
        // Create a Plane Mesh with basic material
        
        let plane = new THREE.PlaneGeometry(10, 10);
        this.planeMesh = new THREE.Mesh(plane, this.planeMaterial);
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

        const tableTopY = legHeight + tableTopHeight;

        //lamp
        let lamp = new MyLamp(0.5, 0.6);
        lamp.position.set(1,tableTopY,0);
        this.app.scene.add(lamp);

        //pencil
        const pencilLenght = 0.2;
        const pencilWidth = 0.02;
        let pencil = new MyPencil(pencilLenght, pencilWidth);
        pencil.position.set(0.1,tableTopY + pencilWidth / 2,0.5);
        pencil.rotateX(- Math.PI / 2);
        this.app.scene.add(pencil);

        //book
        const bookWidth = 0.4;
        const bookLength = 0.6;
        const bookThickness = 0.1;
        let book = new MyBook(bookLength,bookWidth, bookThickness);
        book.position.set(-1, tableTopY + bookThickness / 2,0);
        book.rotateX(- Math.PI / 2);
        this.app.scene.add(book);
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

        // sets the box mesh position based on the displacement vector
        /*
        this.boxMesh.position.x = this.boxDisplacement.x
        this.boxMesh.position.y = this.boxDisplacement.y
        this.boxMesh.position.z = this.boxDisplacement.z
        */
        
    }

}

export { MyContents };