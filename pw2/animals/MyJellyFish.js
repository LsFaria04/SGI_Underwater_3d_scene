import * as THREE from 'three';
import { MeshBVHHelper } from '../index.module.js';
/**
 * This calss represents a jellyfish
 */
class MyJellyFish extends THREE.LOD {

    /**
     * 
     * @param {*} radius Radius of the jellyfish body
     * @param {*} height Height of the jellyfish
     * @param {*} color Color of the jellyfish body
     * @param {*} jellyFishTexture Texture of the jelly fish body
     */
    constructor(radius = 1, height = 2, color = "#0000FF", jellyFishTexture) {
        super();

        this.radius = radius;
        this.height = height;
        this.color = color;
        this.jellyFishTexture = jellyFishTexture;
        this.helpers = [];
        this.bvh = false;

        // LOD thresholds
        this.lodMediumThreshold = 10;
        this.lodLowThreshold = 20;

        // Animation properties
        this.elapsedTime = 0;
        this.pulseSpeed = 2;
        this.tentacleWaveSpeed = 3;

        // For BVH refit on high LOD
        this.headGeometry = null;
        this.tentaclesGeo = [];

        this.init();
    }

    addBVHHelper(mesh) {
        const helper = new MeshBVHHelper(mesh);
        helper.visible = false;
        mesh.add(helper);
        this.helpers.push(helper);
    }

    init() {
        const high = this.createHighLOD();
        this.addLevel(high, 0);

        const medium = this.createMediumLOD();
        this.addLevel(medium, this.lodMediumThreshold);

        const low = this.createLowLOD();
        this.addLevel(low, this.lodLowThreshold);

        this.box = new THREE.Box3().setFromObject(this, true);
        this.boxHelper = new THREE.Box3Helper(this.box, 0xff0000);
        this.boxHelper.visible = false;
        this.add(this.boxHelper);
    }

    createHighLOD() {
        const jelly = new THREE.Group();

        const mat = new THREE.MeshPhongMaterial({
            color: this.color,
            map: this.jellyFishTexture || null,
            transparent: true,
            opacity: 0.7,
            shininess: 80,
            specular: 0x4444aa,
            side: THREE.DoubleSide
        });

        // Bell top (store geometry for BVH refit)
        this.headGeometry = new THREE.SphereGeometry(
            this.radius, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2
        );
        this.headGeometry.computeBoundsTree();

        const headTop = new THREE.Mesh(this.headGeometry, mat);

        // Bell bottom
        const bottomGeo = new THREE.RingGeometry(this.radius * 0.7, this.radius, 24);
        const headBottom = new THREE.Mesh(bottomGeo, mat);
        headBottom.rotation.x = -Math.PI / 2;

        const head = new THREE.Group();
        head.add(headTop);
        head.add(headBottom);
        head.position.y = this.height - this.radius;
        jelly.add(head);

        // Glow
        const glowMat = new THREE.MeshBasicMaterial({
            color: this.color,
            transparent: true,
            opacity: 0.1,
            side: THREE.BackSide
        });

        const glowGeo = new THREE.SphereGeometry(
            this.radius * 1.05, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2
        );
        const glow = new THREE.Mesh(glowGeo, glowMat);
        head.add(glow);

        // Tentacles (high detail, curved)
        const tentacles = this.createHighTentacles(jelly, mat);
        tentacles.name = "tentacles";
        jelly.tentacles = tentacles; // convenience reference

        // Add helpers once
        jelly.traverse(obj => {
            if (obj.isMesh) this.addBVHHelper(obj);
        });

        return jelly;
    }

    createMediumLOD() {
        const jelly = new THREE.Group();

        const mat = new THREE.MeshPhongMaterial({
            color: this.color,
            map: this.jellyFishTexture || null,
            transparent: true,
            opacity: 0.8,
            shininess: 150,
            specular: 0x6666ff,
            side: THREE.DoubleSide
        });

        // Head
        const headGeo = new THREE.SphereGeometry(this.radius, 16, 12, Math.PI, Math.PI);
        headGeo.computeBoundsTree();

        const headTop = new THREE.Mesh(headGeo, mat);
        headTop.rotation.x = Math.PI / 2;

        const bottomGeo = new THREE.CircleGeometry(this.radius, 16);
        const headBottom = new THREE.Mesh(bottomGeo, mat);
        headBottom.rotation.x = Math.PI / 2;

        const head = new THREE.Group();
        head.add(headTop);
        head.add(headBottom);
        head.position.y = this.height - this.radius;
        jelly.add(head);

        // Tentacles
        const tentacles = new THREE.Group();
        tentacles.name = "tentacles";

        const tentacleGeo = new THREE.CylinderGeometry(
            this.radius * 0.08,
            this.radius * 0.08,
            this.height - this.radius,
            8
        );

        const count = 8;
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;

            const t = new THREE.Mesh(tentacleGeo, mat);
            t.position.set(
                Math.cos(angle) * this.radius * 0.7,
                (this.height - this.radius) / 2,
                Math.sin(angle) * this.radius * 0.7
            );

            tentacles.add(t);
        }

        jelly.add(tentacles);
        jelly.tentacles = tentacles;

        // Add helpers once
        jelly.traverse(obj => {
            if (obj.isMesh) this.addBVHHelper(obj);
        });

        return jelly;
    }

    createLowLOD() {
        const jelly = new THREE.Group();

        const mat = new THREE.MeshPhongMaterial({
            color: this.color,
            map: this.jellyFishTexture || null,
            transparent: true,
            opacity: 0.7
        });

        // Head
        const headGeo = new THREE.SphereGeometry(this.radius, 8, 6, Math.PI, Math.PI);
        headGeo.computeBoundsTree();

        const headTop = new THREE.Mesh(headGeo, mat);
        headTop.rotation.x = Math.PI / 2;

        const bottomGeo = new THREE.CircleGeometry(this.radius, 8);
        const headBottom = new THREE.Mesh(bottomGeo, mat);
        headBottom.rotation.x = Math.PI / 2;

        const head = new THREE.Group();
        head.add(headTop);
        head.add(headBottom);
        head.position.y = this.height - this.radius;
        jelly.add(head);

        // Tentacles
        const tentacles = new THREE.Group();
        tentacles.name = "tentacles";

        const tentacleGeo = new THREE.CylinderGeometry(
            this.radius * 0.1,
            this.radius * 0.1,
            this.height - this.radius,
            6
        );

        const base = new THREE.Mesh(tentacleGeo, mat);
        base.position.set(this.radius * 0.6, (this.height - this.radius) / 2, 0);
        tentacles.add(base);

        const step = 360 / 6;
        for (let i = 0; i < 6; i++) {
            const angle = THREE.MathUtils.degToRad(step * i);

            const t = base.clone();
            t.position.set(
                Math.cos(angle) * this.radius * 0.6,
                (this.height - this.radius) / 2,
                Math.sin(angle) * this.radius * 0.6
            );

            tentacles.add(t);
        }

        jelly.add(tentacles);
        jelly.tentacles = tentacles;

        // Add helpers once
        jelly.traverse(obj => {
            if (obj.isMesh) this.addBVHHelper(obj);
        });

        return jelly;
    }


    createHighTentacles(jelly, material) {
        const tentacles = new THREE.Group();
        tentacles.name = "tentacles";

        const count = 12;
        const segments = 8;
        this.tentaclesGeo = []; // geometries for BVH refit

        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;

            const points = [];
            const length = this.height - this.radius;
            const curl = 0.1 + Math.random() * 0.2;

            for (let j = 0; j <= segments; j++) {
                const t = j / segments;
                const x = Math.cos(angle) * this.radius * (0.8 - t * 0.3);
                const y = -length * t;
                const z = Math.sin(angle) * this.radius * (0.8 - t * 0.3);

                const wave = Math.sin(t * Math.PI * 3) * curl * 0.1;
                points.push(new THREE.Vector3(x + wave, y, z + wave));
            }

            const curve = new THREE.CatmullRomCurve3(points);
            const tubeGeo = new THREE.TubeGeometry(curve, segments, 0.03, 6, false);
            tubeGeo.computeBoundsTree();
            this.tentaclesGeo.push(tubeGeo);

            const tentacle = new THREE.Mesh(tubeGeo, material);
            tentacle.position.y = this.height - this.radius;

            tentacles.add(tentacle);
        }

        jelly.add(tentacles);
        return tentacles;
    }

    updateAnimation(delta) {
        this.elapsedTime += delta;

        // Pulse the whole jellyfish
        const pulse = Math.sin(this.elapsedTime * this.pulseSpeed) * 0.1 + 1;

        this.scale.set(pulse, pulse, pulse);

        // Tentacle waving
        const currentTentacles = this.findCurrentTentacles();
        if (currentTentacles) {
            currentTentacles.children.forEach((tentacle, index) => {
                const wave = Math.sin(this.elapsedTime * this.tentacleWaveSpeed + index * 0.5) * 0.2;
                tentacle.rotation.x = wave;
            });
        }

        // BVH refit (for animated geometry, only if enabled)
        if ((Math.floor(this.elapsedTime) % 4 === 0) && this.bvh) {
            if (this.headGeometry && this.headGeometry.boundsTree) {
                this.headGeometry.boundsTree.refit();
            }
            if (this.tentaclesGeo) {
                for (const g of this.tentaclesGeo) {
                    if (g.boundsTree) g.boundsTree.refit();
                }
            }
        }
    }

    findCurrentTentacles() {
        for (const level of this.levels) {
            const obj = level.object;
            if (obj.visible && obj.tentacles) {
                return obj.tentacles;
            }
        }
        return null;
    }
}

export { MyJellyFish };