import * as THREE from 'three';
import { MeshBVHHelper } from '../index.module.js';

/**
 * This class represents a sea rock
 */
class MyRock extends THREE.LOD {

    /**
     * 
     * @param {*} radius Base radius of the rock
     * @param {*} color Color of the rock
     * @param {*} rockTexture Texture applied to the rock
     */
    constructor(radius = 1, color = "#000000", rockTexture = null) {
        super();

        this.radius = radius;
        this.color = color;
        this.rockTexture = rockTexture;

        this.helpers = [];

        this.init();
    }

    /**
     * Adds a BVH helper to the given mesh for visualization.
     * @param {*} mesh
     */
    addBVHHelper(mesh) {
        const helper = new MeshBVHHelper(mesh);
        helper.visible = false;
        mesh.add(helper);
        this.helpers.push(helper);
    }


    init() {
        const high = this.initHighLOD();
        this.addLevel(high, 0);

        const medium = this.initMidLOD();
        this.addLevel(medium, 10);

        const low = this.initLowLOD();
        this.addLevel(low, 20);

        this.box = new THREE.Box3().setFromObject(this, true);
        this.boxHelper = new THREE.Box3Helper(this.box, 0xff0000);
        this.boxHelper.visible = false;
        this.boxHelper.layers.set(1);
        this.add(this.boxHelper)
    }

    /**
     * Initializes the low level of detail rock.
     * @returns {THREE.Object3D} Low LOD rock object.
     */
    initLowLOD() {
        const rock = new THREE.Object3D();

        const geo = new THREE.BoxGeometry(this.radius, this.radius, this.radius);
        const mat = new THREE.MeshPhongMaterial({
            color: this.color,
            map: this.rockTexture || null
        });

        const mesh = new THREE.Mesh(geo, mat);
        geo.computeBoundsTree();

        rock.add(mesh);

        // Add BVH helpers once
        rock.traverse(obj => {
            if (obj.isMesh) this.addBVHHelper(obj);
        });

        return rock;
    }

    /**
     * Initializes the medium level of detail rock.
     * @returns {THREE.Object3D} Medium LOD rock object.
     */
    initMidLOD() {
        const rock = new THREE.Object3D();

        const geo = new THREE.DodecahedronGeometry(this.radius * 0.8);
        const mat = new THREE.MeshPhongMaterial({
            color: this.color,
            map: this.rockTexture || null
        });

        const mesh = new THREE.Mesh(geo, mat);
        geo.computeBoundsTree();

        mesh.castShadow = true;
        mesh.receiveShadow = true;

        rock.add(mesh);

        // Add BVH helpers once
        rock.traverse(obj => {
            if (obj.isMesh) this.addBVHHelper(obj);
        });

        return rock;
    }

    /**
     * Initializes the high level of detail rock.
     * @returns {THREE.Object3D} High LOD rock object.
     */
    initHighLOD() {
        const rock = new THREE.Object3D();

        let geo = new THREE.SphereGeometry(this.radius, 30, 30);

        // Apply random plane cuts
        for (let i = 0; i < 20; i++) {
            const normal = new THREE.Vector3(
                THREE.MathUtils.randFloat(-1, 1),
                THREE.MathUtils.randFloat(-1, 1),
                THREE.MathUtils.randFloat(-1, 1)
            ).normalize();

            geo = this.scrapeWithPlane(
                geo,
                normal,
                THREE.MathUtils.randFloat(this.radius / 10, this.radius),
                THREE.MathUtils.randFloat(0.2, 0.8)
            );
        }

        const mat = new THREE.MeshPhongMaterial({
            color: this.color,
            map: this.rockTexture || null
        });

        const mesh = new THREE.Mesh(geo, mat);
        geo.computeBoundsTree();

        mesh.castShadow = true;
        mesh.receiveShadow = true;

        rock.add(mesh);

        // Add BVH helpers once
        rock.traverse(obj => {
            if (obj.isMesh) this.addBVHHelper(obj);
        });

        return rock;
    }

    /**
     * Scrapes the geometry with a plane defined by its normal and offset.
     * @param {THREE.BufferGeometry} geometry Geometry to scrape.
     * @param {THREE.Vector3} planeNormal Normal vector of the plane.
     * @param {number} planeOffset Offset of the plane from the origin.
     * @param {number} strength Strength of the scraping effect.
     * @return {THREE.BufferGeometry} Scraped geometry.
     */
    scrapeWithPlane(geometry, planeNormal, planeOffset, strength = 1) {
        const pos = geometry.attributes.position;
        const vect = new THREE.Vector3();

        for (let i = 0; i < pos.count; i++) {
            vect.fromBufferAttribute(pos, i);

            const dist = planeNormal.dot(vect) - planeOffset;

            if (dist > 0) {
                vect.addScaledVector(planeNormal, -dist * strength);
                pos.setXYZ(i, vect.x, vect.y, vect.z);
            }
        }

        pos.needsUpdate = true;
        geometry.computeVertexNormals();
        return geometry;
    }
}

export { MyRock };