import * as THREE from 'three';
import {
    MeshBVHHelper
} from '../index.module.js';

class MyJellyFish extends THREE.Object3D {
    constructor(radius = 1, height = 2, color = "#0000FF", jellyFishTexture) {
        super();
        this.bvh = false;

        this.radius = radius;
        this.height = height;
        this.color = color;
        this.jellyFishTexture = jellyFishTexture;
        this.helpers = [];
        
        // LOD thresholds
        this.lodMediumThreshold = 10;
        this.lodLowThreshold = 20;

        // Animation properties
        this.elapsedTime = 0;
        this.pulseSpeed = 2;
        this.tentacleWaveSpeed = 3;

        this.init();
    }

    /**
     * creates high detail jellyfish
     */
    createHighLOD() {
        const jellyFishGroup = new THREE.Group();

        const jellyFishMaterial = new THREE.MeshPhongMaterial({
            color: this.color, 
            map: this.jellyFishTexture || null, 
            transparent: true, 
            opacity: 0.7,
            shininess: 80,
            specular: 0x4444aa,
            side: THREE.DoubleSide
        });

        // bell shape
        this.headGeometry = new THREE.SphereGeometry(this.radius, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2); // Only top half (dome)
        const headTop = new THREE.Mesh(this.headGeometry, jellyFishMaterial);
        this.headGeometry.computeBoundsTree();
        const helper = new MeshBVHHelper(headTop);
        helper.visible = false;
        this.helpers.push(helper);
        this.add(helper);
        

        // circular opening at the bottom
        const headBottomGeometry = new THREE.RingGeometry(this.radius * 0.7, this.radius, 24);
        const headBottom = new THREE.Mesh(headBottomGeometry, jellyFishMaterial);
        headBottom.rotation.x = -Math.PI / 2;
        
        const head = new THREE.Group();
        head.add(headTop);
        head.add(headBottom);
        jellyFishGroup.add(head);
        head.position.y = this.height - this.radius;

        // glow
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: this.color,
            transparent: true,
            opacity: 0.1,
            side: THREE.BackSide
        });

        const glowGeometry = new THREE.SphereGeometry(this.radius * 1.05, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2);
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);

        glow.position.copy(headTop.position);
        head.add(glow);

        // tentacles
        const tentacles = this.createHighTentacles(jellyFishGroup, jellyFishMaterial);
        this.tentacles = tentacles;

        return jellyFishGroup;
    }

    /**
     * creates medium detail jellyfish
     */
    createMediumLOD() {
        const jellyFishGroup = new THREE.Group();

        const jellyFishMaterial = new THREE.MeshPhongMaterial({
            color: this.color, 
            map: this.jellyFishTexture || null, 
            transparent: true, 
            opacity: 0.8,
            shininess: 150,
            specular: 0x6666ff,
            side: THREE.DoubleSide
        });

        // head
        const headGeometry = new THREE.SphereGeometry(this.radius, 16, 12, Math.PI, Math.PI);
        const headTop = new THREE.Mesh(headGeometry, jellyFishMaterial);
        headTop.rotation.x = Math.PI / 2;
        headGeometry.computeBoundsTree();
        const helper = new MeshBVHHelper(headTop);
        helper.visible = false;
        this.helpers.push(helper);
        this.add(helper);
        

        const headBottomGeometry = new THREE.CircleGeometry(this.radius, 16);
        const headBottom = new THREE.Mesh(headBottomGeometry, jellyFishMaterial);
        headBottom.rotation.x = Math.PI / 2;
        
        const head = new THREE.Group();
        head.add(headTop);
        head.add(headBottom);
        jellyFishGroup.add(head);
        head.position.y = this.height - this.radius;

        // tentacles
        const tentacleGeometry = new THREE.CylinderGeometry(this.radius * 0.08, this.radius * 0.08, this.height - this.radius, 8);
        const tentacles = new THREE.Group();

        const tentacleCount = 8;
        for(let i = 0; i < tentacleCount; i++){
            const angle = (i / tentacleCount) * Math.PI * 2;
            const tentacle = new THREE.Mesh(tentacleGeometry, jellyFishMaterial);
            
            tentacle.position.set(
                Math.cos(angle) * this.radius * 0.7,
                (this.height - this.radius) / 2,
                Math.sin(angle) * this.radius * 0.7  
            );
            
            tentacles.add(tentacle);
            const helper = new MeshBVHHelper(tentacle);
            helper.visible = false;
            this.helpers.push(helper);
            this.add(helper);
        }

        jellyFishGroup.add(tentacles);
        this.tentacles = tentacles;

        return jellyFishGroup;
    }

    /**
     * creates low detail jellyfish
     */
    createLowLOD() {
        const jellyFishGroup = new THREE.Group();

        const jellyFishMaterial = new THREE.MeshPhongMaterial({
            color: this.color, 
            map: this.jellyFishTexture || null,
            transparent: true,
            opacity: 0.7
        });

        // head
        const headGeometry = new THREE.SphereGeometry(this.radius, 8, 6, Math.PI, Math.PI);
        const headTop = new THREE.Mesh(headGeometry, jellyFishMaterial);
        headTop.rotation.x = Math.PI / 2;
        headGeometry.computeBoundsTree();
        const helper = new MeshBVHHelper(headTop);
        helper.visible = false;
        this.helpers.push(helper);
        this.add(helper);

        const headBottomGeometry = new THREE.CircleGeometry(this.radius, 8);
        const headBottom = new THREE.Mesh(headBottomGeometry, jellyFishMaterial);
        headBottom.rotation.x = Math.PI / 2;
        
        const head = new THREE.Group();
        head.add(headTop);
        head.add(headBottom);
        jellyFishGroup.add(head);
        head.position.y = this.height - this.radius;

        // tentacles
        const tentacleGeometry = new THREE.CylinderGeometry(this.radius * 0.1, this.radius * 0.1, this.height - this.radius, 6);
        const tentacle = new THREE.Mesh(tentacleGeometry, jellyFishMaterial);
        tentacle.position.y = (this.height - this.radius) / 2;
        tentacle.position.z = 0;
        tentacle.position.x = this.radius * 0.6;
        
        const tentacles = new THREE.Group();
        tentacles.add(tentacle);

        let anglestep = 360 / 6;
        let angle = anglestep;
        for(let i = 0; i < 6; i++){
            const copyTentacle = tentacle.clone();
            copyTentacle.position.set(
                Math.cos(THREE.MathUtils.degToRad(angle + (anglestep * i))) * this.radius * 0.6,
                (this.height - this.radius) / 2,
                Math.sin(THREE.MathUtils.degToRad(angle + (anglestep * i))) * this.radius * 0.6
            );
            tentacles.add(copyTentacle);
            const helper = new MeshBVHHelper(tentacle);
            helper.visible = false;
            this.helpers.push(helper);
            this.add(helper);
        }

        jellyFishGroup.add(tentacles);
        this.tentacles = tentacles;

        return jellyFishGroup;
    }


    createHighTentacles(jellyFishGroup, material) {
        const tentacles = new THREE.Group();
        const tentacleCount = 12;
        this.tentaclesGeo = [];
        
        for(let i = 0; i < tentacleCount; i++) {
            const angle = (i / tentacleCount) * Math.PI * 2;
            
            const points = [];
            const segments = 8; 
            const length = this.height - this.radius;
            const curl = 0.1 + Math.random() * 0.2;
            
            for(let j = 0; j <= segments; j++) {
                const t = j / segments;
                const x = Math.cos(angle) * this.radius * (0.8 - t * 0.3);
                const y = -length * t;
                const z = Math.sin(angle) * this.radius * (0.8 - t * 0.3);
                
                const wave = Math.sin(t * Math.PI * 3) * curl * 0.1;
                points.push(new THREE.Vector3(x + wave, y, z + wave));
            }
            
            const curve = new THREE.CatmullRomCurve3(points);
            const tubeGeometry = new THREE.TubeGeometry(curve, segments, 0.03, 6, false);
            const tentacle = new THREE.Mesh(tubeGeometry, material);~
            tubeGeometry.computeBoundsTree();
            this.tentaclesGeo.push(tubeGeometry);
            const helper = new MeshBVHHelper(tentacle);
            helper.visible = false;
            this.helpers.push(helper);
            this.add(helper);
            
            tentacle.position.y = this.height - this.radius;
            tentacles.add(tentacle);
        }
        
        jellyFishGroup.add(tentacles);
        return tentacles;
    }

    init() {
        const lod = new THREE.LOD();
        
        // high LOD
        const highJellyfish = this.createHighLOD();
        lod.addLevel(highJellyfish, 0);

        // medium LOD
        const mediumJellyfish = this.createMediumLOD();
        lod.addLevel(mediumJellyfish, this.lodMediumThreshold);

        // low LOD
        const lowJellyfish = this.createLowLOD();
        lod.addLevel(lowJellyfish, this.lodLowThreshold);

        this.add(lod);
    }

    update(delta) {
        this.elapsedTime += delta;
        
        // pulsing animation for the bell
        const pulse = Math.sin(this.elapsedTime * this.pulseSpeed) * 0.1 + 1;
        this.scale.set(pulse, pulse, pulse);

        const currentTentacles = this.findCurrentTentacles();
        
        // tentacle waving animation
        if (currentTentacles) {
            currentTentacles.children.forEach((tentacle, index) => {
                const wave = Math.sin(this.elapsedTime * this.tentacleWaveSpeed + index * 0.5) * 0.2;
                tentacle.rotation.x = wave;
            });
        }

        if((this.elapsed % 4 == 0) && this.bvh){
            this.headGeometry.boundsTree.refit();
            for(const tentacle of this.tentaclesGeo){
                tentacle.boundsTree.refit();
            }
            
        }
    }

    findCurrentTentacles() {
        let currentTentacles = null;
        this.traverse((child) => {
            if (child instanceof THREE.LOD) {
                const levels = child.levels;
                for (let i = 0; i < levels.length; i++) {
                    const level = levels[i];
                    if (level.object && level.object.visible) {
                        level.object.traverse((obj) => {
                            if (obj instanceof THREE.Group && obj.children.length > 0 && 
                                obj.children[0] instanceof THREE.Mesh) {
                                currentTentacles = obj;
                            }
                        });
                        break;
                    }
                }
            }
        });
        return currentTentacles;
    }
}

export { MyJellyFish };