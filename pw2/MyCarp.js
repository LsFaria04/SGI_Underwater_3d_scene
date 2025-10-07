import * as THREE from 'three';

/**
 * This class contains a 3D representation of a common carp fish
 */
class MyCarp extends THREE.Object3D {
    /**
     * 
     * @param {number} width carp width
     * @param {number} length carp length
     * @param {string} color Color of the carp
     */
    constructor(width, length, color){
        super();
        this.width = width;
        this.length = length;
        this.color = color;

        this.init();
    }

    init(){

        const carpGeometry = new THREE.SphereGeometry(0.25);
        const carpMaterial = new THREE.MeshPhongMaterial({color: this.color});
        const carpBody = new THREE.Mesh(carpGeometry,carpMaterial);
        carpBody.rotation.x = -Math.PI / 2;
        carpBody.position.y = 3;

        const carpBody2 = carpBody.clone();
        carpBody2.position.z = -0.2;

        const carpBody3 = carpBody.clone();
        carpBody3.position.z = -0.4;

        const carpBackGeometry = new THREE.SphereGeometry(0.2);
        const carpBack = new THREE.Mesh(carpBackGeometry,carpMaterial);
        carpBack.rotation.x = -Math.PI / 2;
        carpBack.position.y = 3;
        carpBack.position.z = 0.2;



        const radiusTop = 0; // Apex of the pyramid
        const radiusBottom = 0.2; // Base of the pyramid
        const height = 0.2;
        const radialSegments = 4; // Number of sides for the base

        const pyramidGeometry = new THREE.CylinderGeometry(radiusBottom, radiusTop, height, radialSegments);
        const pyramidMaterial = new THREE.MeshPhongMaterial({color:this.color});
        const pyramidMesh = new THREE.Mesh(pyramidGeometry, pyramidMaterial);

        pyramidMesh.rotation.x = Math.PI/2;
        pyramidMesh.position.y = 3;
        pyramidMesh.position.z = 0.5;

        this.add(carpBody);
        this.add(carpBack);
        this.add(carpBody2);
        this.add(carpBody3);
        this.add(pyramidMesh);    

    }

}

export {MyCarp};