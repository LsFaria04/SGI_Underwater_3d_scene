import * as THREE from 'three';
import { generateRandom } from '../utils.js';

/**
 * This class represents a rock with different levels of detail
 */
class MyRock extends THREE.Object3D {
    /**
     * 
     * @param {number} radius Rock base radius
     * @param {*} color Rock color
     * @param {*} rockTexture Rock texture
     * @param {string} LOD Level of detail ("L", "M", "H") 
     */
    constructor(radius, color = "#000000", rockTexture, LOD){
        super();

        this.radius = radius;
        this.rockTexture = rockTexture;
        this.color = color;
        
        switch (LOD){
            case "L":
                this.initLowLOD();
                break;
            case "M":
                this.initMidLOD();
                break;
            case "H":
                this.initHighLOD();
                break;
            default:
                this.initLowLOD();
        }
         
    }

    initLowLOD(){
        
        //simple box for low LOD
        const rockGeometry = new THREE.BoxGeometry(this.radius, this.radius, this.radius);
        const rockMaterial = new THREE.MeshPhongMaterial({color: this.color, map: this.rockTexture ? this.rockTexture : null});
        const rock = new THREE.Mesh(rockGeometry, rockMaterial);
        rockGeometry.computeBoundsTree();

        this.add(rock);
    }

     initMidLOD(){
        
        //More complex spahe for MID LOD
        const rockGeometry = new THREE.DodecahedronGeometry(this.radius * 0.8);
        const rockMaterial = new THREE.MeshPhongMaterial({color: this.color, map: this.rockTexture ? this.rockTexture : null});
        const rock = new THREE.Mesh(rockGeometry, rockMaterial);
        rockGeometry.computeBoundsTree();

        rock.castShadow = true;    
        rock.receiveShadow = true;
    

        this.add(rock);
    }


    initHighLOD(){
        //use a sphere as the base geometry for High LOD
        let geometry = new THREE.SphereGeometry(this.radius, 30, 30);

        //cuts the sphere with a plane to create a random shape rock
        for(let i = 0; i < 20; i++){
            const normal = new THREE.Vector3(generateRandom(-1, 1), generateRandom(-1,1), generateRandom(-1,1)).normalize();
            geometry = this.scrapeWithPlane(geometry, normal, generateRandom(this.radius / 10, this.radius), generateRandom(0.2,0.8));
        }

        const rockMaterial = new THREE.MeshPhongMaterial({color: this.color, map: this.rockTexture ? this.rockTexture : null});
        const rock = new THREE.Mesh(geometry, rockMaterial);
        geometry.computeBoundsTree();

        rock.castShadow = true;    
        rock.receiveShadow = true;
        
        this.add(rock)
    }

    scrapeWithPlane(geometry, planeNormal, planeOffset, strength = 1) {
        const pos = geometry.attributes.position;
        const vect = new THREE.Vector3();

        for (let i = 0; i < pos.count; i++) {
            vect.fromBufferAttribute(pos, i);

            // Signed distance from plane (n·p - d)
            const dist = planeNormal.dot(vect) - planeOffset;

            if (dist > 0) {
                // Push vertex back toward the plane
                vect.addScaledVector(planeNormal, -dist * strength);
                pos.setXYZ(i, vect.x, vect.y, vect.z);
            }
        }

        pos.needsUpdate = true;
        geometry.computeVertexNormals();
        return geometry;
    }

}

export{ MyRock};