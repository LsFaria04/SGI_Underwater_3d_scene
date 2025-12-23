import * as THREE from 'three';
import { MeshBVHHelper } from '../index.module.js';
import { generateRandom } from '../utils.js';

class MySeaPlant extends THREE.LOD {

    constructor(width = 0.2, height = 0.5, depth = 0.05, color = "#00aa55") {
        super();

        this.width = width;
        this.height = height;
        this.depth = depth;
        this.color = color;

        this.uniforms = {
            uTime:  { value: 0 },
            uBend:  { value: 0.3 },
            uHeight:{ value: height }
        };


        this.helpers = [];
        this.init();
    }


    addBVHHelper(mesh) {
        const helper = new MeshBVHHelper(mesh);
        helper.visible = false;
        mesh.add(helper);
        this.helpers.push(helper);
    }

    init() {

        this.material = this.createMaterial();

        // High detail
        const high = this.initHighLOD();
        this.addLevel(high, 0);

        // Medium detail
        const mid = this.initMidLOD();
        this.addLevel(mid, 5);

        // Low detail
        const low = this.initLowLOD();
        this.addLevel(low, 10);

        // Bounding box (same as crab)
        this.box = new THREE.Box3().setFromObject(this, true);
        this.boxHelper = new THREE.Box3Helper(this.box, 0xff0000);
        this.boxHelper.visible = false;
        this.boxHelper.layers.set(1);
        this.add(this.boxHelper);
    }

    // ---------------------------------------------------------
    // Shared material with sway shader
    // ---------------------------------------------------------
    createMaterial() {
        const mat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(this.color)
        });

        
        mat.onBeforeCompile = (shader) => {
            shader.uniforms.uTime   = this.uniforms.uTime;
            shader.uniforms.uBend   = this.uniforms.uBend;
            shader.uniforms.uHeight = this.uniforms.uHeight;

            shader.vertexShader =
                `
                uniform float uTime;
                uniform float uBend;
                uniform float uHeight;
                ` + shader.vertexShader;

            shader.vertexShader = shader.vertexShader.replace(
                '#include <begin_vertex>',
                `
                #include <begin_vertex>

                float influence = (transformed.y + uHeight * 0.5) / uHeight;
                influence = clamp(influence, 0.0, 1.0);

                float theta = sin(uTime * 1.5 + transformed.y) * uBend * (influence * influence);
                transformed.x += theta;
                `
            );

            mat.userData.shader = shader;
        };

        return mat;
    }

    // ---------------------------------------------------------
    // LOW LOD
    // ---------------------------------------------------------
    initLowLOD() {
        const plant = new THREE.Object3D();

        const geo = new THREE.PlaneGeometry(this.width, this.height, 1, 2);
        const pos = geo.attributes.position;
        const v = new THREE.Vector3();

        for (let i = 0; i < pos.count; i++) {
            v.fromBufferAttribute(pos, i);
            const influence = (v.y + this.height * 0.5) / this.height;
            v.x *= THREE.MathUtils.lerp(1.0, 0.3, influence);
            pos.setXYZ(i, v.x, v.y, v.z);
        }

        geo.computeVertexNormals();
        geo.computeBoundsTree();

        const mesh = new THREE.Mesh(geo, this.material);
        mesh.position.y = this.height / 2;
        plant.add(mesh);

        this.addBVHHelper(mesh);
        return plant;
    }

    // ---------------------------------------------------------
    // MID LOD
    // ---------------------------------------------------------
    initMidLOD() {
        const plant = new THREE.Object3D();

        const geo = new THREE.BoxGeometry(this.width, this.height, this.depth, 1, 3, 1);
        const pos = geo.attributes.position;
        const v = new THREE.Vector3();

        const freqX = generateRandom(1, 4);
        const freqZ = generateRandom(1, 3);
        const phaseX = generateRandom(0, Math.PI * 2);
        const phaseZ = generateRandom(0, Math.PI * 2);
        const bend = 0.25;

        for (let i = 0; i < pos.count; i++) {
            v.fromBufferAttribute(pos, i);
            const influence = (v.y + this.height * 0.5) / this.height;

            v.x *= THREE.MathUtils.lerp(1.1, 0.25, influence);
            v.z *= THREE.MathUtils.lerp(1.0, 0.5, influence);

            v.x += Math.sin(v.y * freqX + phaseX) * bend * influence;
            v.z += Math.cos(v.y * freqZ + phaseZ) * bend * 0.7 * influence;

            pos.setXYZ(i, v.x, v.y, v.z);
        }

        geo.computeVertexNormals();
        geo.computeBoundsTree();

        const mesh = new THREE.Mesh(geo, this.material);
        mesh.position.y = this.height / 2;
        plant.add(mesh);

        this.addBVHHelper(mesh);
        return plant;
    }

    // ---------------------------------------------------------
    // HIGH LOD
    // ---------------------------------------------------------
    initHighLOD() {
        const plant = new THREE.Object3D();

        const geo = new THREE.BoxGeometry(this.width, this.height, this.depth, 2, 6, 2);
        const pos = geo.attributes.position;
        const v = new THREE.Vector3();

        const freqX = generateRandom(1.5, 2);
        const freqZ = generateRandom(0.8, 3);
        const phaseX = generateRandom(0, Math.PI * 2);
        const phaseZ = generateRandom(0, Math.PI * 2);

        const bend = 0.2;
        const maxTwist = THREE.MathUtils.degToRad(35);

        for (let i = 0; i < pos.count; i++) {
            v.fromBufferAttribute(pos, i);
            const influence = (v.y + this.height * 0.5) / this.height;

            v.x *= THREE.MathUtils.lerp(1.2, 0.15, influence);
            v.z *= THREE.MathUtils.lerp(1.0, 0.4, influence);

            v.x += Math.sin(v.y * freqX + phaseX) * bend * influence;
            v.z += Math.cos(v.y * freqZ + phaseZ) * bend * 0.8 * influence;

            const twist = maxTwist * influence;
            const cosA = Math.cos(twist);
            const sinA = Math.sin(twist);

            const x = v.x * cosA - v.z * sinA;
            const z = v.x * sinA + v.z * cosA;

            v.x = x;
            v.z = z;

            pos.setXYZ(i, v.x, v.y, v.z);
        }

        geo.computeVertexNormals();
        geo.computeBoundsTree();

        const mesh = new THREE.Mesh(geo, this.material);
        mesh.position.y = this.height / 2;
        plant.add(mesh);

        this.addBVHHelper(mesh);
        return plant;
    }

    // ---------------------------------------------------------
    // UPDATE
    // ---------------------------------------------------------
    updateAnim(delta) {
        this.uniforms.uTime.value += delta;
        
    }
}

export { MySeaPlant };
