import * as THREE from 'three';
import { MeshBVHHelper } from '../index.module.js';

/**
 * This class represents a sea star
 */
class MySeaStar extends THREE.LOD {

    /**
     * 
     * @param {*} radius Radius of the star arms
     * @param {*} height Height of the arms
     * @param {*} color Color of the star
     * @param {*} starTexture Texture of the star
     */
    constructor(radius = 0.1, height = 0.2, color = "#ff0000", starTexture) {
        super();

        this.radius = radius;
        this.height = height;
        this.color = color;
        this.starTexture = starTexture;
        this.helpers = [];

        this.init();
    }

    /**
     * Adds a BVH helper to the given mesh for visualization and debugging.
     * @param {THREE.Mesh} mesh The mesh to which the BVH helper will be added.
     */
    addBVHHelper(mesh) {
        const helper = new MeshBVHHelper(mesh);
        helper.visible = false;
        mesh.add(helper);
        this.helpers.push(helper);
    }

    init() {
        // High detail (LOD 0)
        const high = this.initHighLOD();
        this.addLevel(high, 0);

        // Medium detail (LOD 1)
        const medium = this.initMediumLOD();
        this.addLevel(medium, 5);

        // Low detail (LOD 2)
        const low = this.initLowLOD();
        this.addLevel(low, 20);

        this.box = new THREE.Box3().setFromObject(this, true);
        this.boxHelper = new THREE.Box3Helper(this.box, 0xff0000);
        this.boxHelper.visible = false;
        this.boxHelper.layers.set(1);
        this.add(this.boxHelper);
    }

    /*
    * Creates the low level of detail sea star
    */
    initLowLOD() {
        const star = new THREE.Object3D();

        const geo = new THREE.BoxGeometry(
            this.height * 2,
            this.height,
            this.height * 2
        );
        const mat = new THREE.MeshPhongMaterial({
            color: this.color,
            map: this.starTexture || null
        });

        const mesh = new THREE.Mesh(geo, mat);
        geo.computeBoundsTree();
        star.add(mesh);

        // Add helpers once
        star.traverse(obj => {
            if (obj.isMesh) this.addBVHHelper(obj);
        });

        return star;
    }

    /*
    * Creates the medium level of detail sea star
    */
    initMediumLOD() {
        const star = new THREE.Object3D();

        const mat = new THREE.MeshPhongMaterial({
            color: this.color,
            map: this.starTexture || null
        });

        const armGeo = new THREE.CylinderGeometry(this.radius, this.radius / 3, this.height, 5, 5);
        const bodyGeo = new THREE.CylinderGeometry(this.radius / 2, this.radius / 2, this.radius * 2, 5, 5);

        armGeo.computeBoundsTree();
        bodyGeo.computeBoundsTree();

        const body = new THREE.Mesh(bodyGeo, mat);
        star.add(body);

        // Build one arm
        const arm = new THREE.Group();
        const armMesh = new THREE.Mesh(armGeo, mat);
        arm.add(armMesh);

        arm.rotation.x = Math.PI / 2;
        arm.position.z = -(this.height / 2 + this.radius / 3);

        // Clone 5 arms around center
        for (let i = 0; i < 5; i++) {
            const armClone = arm.clone(true);

            const pivot = new THREE.Group();
            pivot.add(armClone);
            pivot.rotation.y = THREE.MathUtils.degToRad(i * 72);

            star.add(pivot);
        }

        // Add helpers once
        star.traverse(obj => {
            if (obj.isMesh) this.addBVHHelper(obj);
        });

        return star;
    }

    /*
    * Creates the high level of detail sea star
    */
    initHighLOD() {
        const star = new THREE.Object3D();

        const mat = new THREE.MeshPhongMaterial({
            color: this.color,
            map: this.starTexture || null
        });

        const armGeo = new THREE.CylinderGeometry(this.radius, this.radius / 3, this.height);
        const tipGeo = new THREE.SphereGeometry(this.radius / 3, 8, 8, Math.PI, Math.PI);
        const bodyGeo = new THREE.CylinderGeometry(this.radius / 2, this.radius / 2, this.radius * 2, 5);

        armGeo.computeBoundsTree();
        tipGeo.computeBoundsTree();
        bodyGeo.computeBoundsTree();

        const body = new THREE.Mesh(bodyGeo, mat);
        star.add(body);

        // Build one arm with tip
        const arm = new THREE.Group();
        const armMesh = new THREE.Mesh(armGeo, mat);
        const tipMesh = new THREE.Mesh(tipGeo, mat);

        tipMesh.rotation.x = -Math.PI / 2;
        tipMesh.position.y = -this.height / 2;

        arm.add(armMesh);
        arm.add(tipMesh);

        arm.rotation.x = Math.PI / 2;
        arm.position.z = -(this.height / 2 + this.radius / 3);

        // Clone 5 arms around center
        for (let i = 0; i < 5; i++) {
            const armClone = arm.clone(true);

            const pivot = new THREE.Group();
            pivot.add(armClone);
            pivot.rotation.y = THREE.MathUtils.degToRad(i * 72);

            star.add(pivot);
        }

        // Add helpers once
        star.traverse(obj => {
            if (obj.isMesh) this.addBVHHelper(obj);
        });

        return star;
    }
}

export { MySeaStar };