import * as THREE from 'three';
import {
    MeshBVHHelper
} from '../index.module.js';


class MySubmarine extends THREE.Object3D {
    constructor(videoTexture = null) {
        super();

        this.bvh = false;
        this.helpers = [];

        this.frontLightEnabled = true;
        this.frontLightIntensity = 20.0;
        this.frontLightColor = 0xffffcc;
        this.frontLightDecay = 3;

        this.warningLightEnabled = true;
        this.warningLightIntensity = 1.5;
        this.warningFlashRate = 0.5;

        const bodyMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x2a4b5e,
            shininess: 80,
            specular: 0x444444
        });

        const metalMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x888888,
            shininess: 120,
            specular: 0x666666
        });

        const darkMetalMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x333333,
            shininess: 100
        });

        const glassMaterial = new THREE.MeshPhongMaterial({
            color: 0x002244,       
            transparent: true,
            opacity: 0.85,
            shininess: 200,
            specular: 0x88aaff,
            refractionRatio: 0.8,
            side: THREE.DoubleSide
        });

        const woodMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x1a1a1a,
            shininess: 80,
            side: THREE.DoubleSide
        });

        let windowMaterial = glassMaterial;

        if (videoTexture) {
            windowMaterial = new THREE.MeshPhongMaterial({
                map : videoTexture,
                color : 0xffffff,
                transparent: true,
                opacity: 1.0,
                shininess: 100,
                side: THREE.DoubleSide
            });
        }



        // main body
        this.bodyGeometry = new THREE.CapsuleGeometry(0.5, 3, 8, 16);
        const body = new THREE.Mesh(this.bodyGeometry, bodyMaterial);
        body.rotation.z = Math.PI / 2;
        this.add(body);
        body.castShadow = true;
        body.receiveShadow = true;
        this.bodyGeometry.computeBoundsTree();
        const helper = new MeshBVHHelper(body);
        this.add(helper);
        helper.visible = false;
        this.helpers.push(helper);
        

        // hatch
        this.hatchGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.3, 12);
        const hatch = new THREE.Mesh(this.hatchGeometry, darkMetalMaterial);
        hatch.position.set(0, 0.4, 0);
        this.add(hatch);
        hatch.castShadow = true;
        hatch.receiveShadow = true;
        this.hatchGeometry.computeBoundsTree();
        const helper2 = new MeshBVHHelper(hatch);
        this.add(helper2);
        helper2.visible = false;
        this.helpers.push(helper2);
        

        // periscope
        const points = [
            new THREE.Vector3(0, 0, 0),      
            new THREE.Vector3(0, 0.55, 0),   
            new THREE.Vector3(0, 0.6, 0),    
            new THREE.Vector3(0.05, 0.6, 0), 
            new THREE.Vector3(0.3, 0.6, 0)   
        ];

        const curve = new THREE.CatmullRomCurve3(points);
        this.tubeGeometry = new THREE.TubeGeometry(curve, 32, 0.04, 8, false);
        const periscope = new THREE.Mesh(this.tubeGeometry, metalMaterial);
        periscope.position.y = 0.5;
        this.add(periscope);
        periscope.castShadow = true;
        periscope.receiveShadow = true;
        this.tubeGeometry.computeBoundsTree();
        const helper3 = new MeshBVHHelper(periscope);
        this.add(helper3);
        helper3.visible = false;
        this.helpers.push(helper3);

        const lensGeometry = new THREE.CircleGeometry(0.035, 16);

        const lens = new THREE.Mesh(lensGeometry, glassMaterial);
        lens.position.set(0.3, 1.1, 0); 
        lens.rotation.y = Math.PI / 2;    
        this.add(lens);
        lens.castShadow = true;
        lens.receiveShadow = true;

        const lensHousingGeometry = new THREE.RingGeometry(0.035, 0.045, 16);
        const lensHousing = new THREE.Mesh(lensHousingGeometry, darkMetalMaterial);
        lensHousing.position.copy(lens.position);
        lensHousing.rotation.copy(lens.rotation);
        this.add(lensHousing);
        lensHousing.castShadow = true;
        lensHousing.receiveShadow = true;

        // Submarine windows
        const windowGeometry = new THREE.CircleGeometry(0.12, 12);
        const windowFrameGeometry = new THREE.RingGeometry(0.12, 0.1, 12);


        const windowPositions = [
            {x: 0.5, y: 0.2, z: 0.482},   // Front-left
            {x: 0.5, y: 0.2, z: -0.482},  // Front-right
            {x: -0.5, y: 0.2, z: 0.482},   // Middle-left
            {x: -0.5, y: 0.2, z: -0.482},  // Middle-right
        ];

        windowPositions.forEach(pos => {
            const windowGroup = new THREE.Group();
            windowGroup.position.set(pos.x, pos.y, pos.z);
            windowGroup.rotation.y = pos.z > 0 ? 0 : Math.PI;
            
            const frame = new THREE.Mesh(windowFrameGeometry, woodMaterial);
            windowGroup.add(frame);

            const window = new THREE.Mesh(windowGeometry, windowMaterial);
            window.castShadow = true;
            window.receiveShadow = true;
            window.position.z = -0.001;
            windowGroup.add(window);
            
            this.add(windowGroup);
        });

        // propeller 
        const propellerGroup = new THREE.Group();
        propellerGroup.position.set(-2, 0, 0);

        // base 
        const propellerBaseGeometry = new THREE.CylinderGeometry(0.12, 0.12, 0.1, 12);
        const propellerBase = new THREE.Mesh(propellerBaseGeometry, metalMaterial);
        propellerBase.rotation.z = Math.PI / 2;
        propellerGroup.add(propellerBase);

        // blades
        const bladeGeometry = new THREE.BoxGeometry(0.4, 0.08, 0.02);

        const horizontalBlade = new THREE.Mesh(bladeGeometry, metalMaterial);
        horizontalBlade.rotation.set(0, 0, Math.PI/2);
        propellerGroup.add(horizontalBlade);

        const verticalBlade = new THREE.Mesh(bladeGeometry, metalMaterial);
        verticalBlade.rotation.set(Math.PI/2, 0, Math.PI/2);
        propellerGroup.add(verticalBlade);

        this.add(propellerGroup);

        // rudder
        // rudder
        const rudderGeometry = new THREE.BoxGeometry(0.1, 1.2, 0.3);
        const rudder = new THREE.Mesh(rudderGeometry, bodyMaterial);
        rudder.position.set(-1.8, 0, 0);
        rudder.rotation.set(0,Math.PI/2,0);
        rudder.castShadow = true;
        rudder.receiveShadow = true;
        this.add(rudder);

        // stern planes
        const sternPlaneGeometry = new THREE.BoxGeometry(0.6, 0.1, 0.2);
        const leftSternPlane = new THREE.Mesh(sternPlaneGeometry, bodyMaterial);
        leftSternPlane.position.set(-1.8, 0, -0.4);
        leftSternPlane.rotation.set(0,Math.PI/2,0);
        leftSternPlane.castShadow = true;
        leftSternPlane.receiveShadow = true;
        this.add(leftSternPlane);

        const rightSternPlane = new THREE.Mesh(sternPlaneGeometry, bodyMaterial);
        rightSternPlane.position.set(-1.7, 0, 0.4);
        rightSternPlane.rotation.set(0,Math.PI/2,0);
        rightSternPlane.castShadow = true;
        rightSternPlane.receiveShadow = true;
        this.add(rightSternPlane);

        // front light
        const frontLightBulb = new THREE.Mesh(
            new THREE.SphereGeometry(0.1, 8, 8),
            new THREE.MeshBasicMaterial({ 
                color: 0xffffaa,
                transparent: true,
                opacity: 0.8,
                blending: THREE.AdditiveBlending
            })
        );
        frontLightBulb.position.set(1.85, -0.3, 0);
        this.add(frontLightBulb);
        this.frontLightBulb = frontLightBulb;
        

        this.frontLight = new THREE.SpotLight(0xffffcc, this.frontLightIntensity);
        this.frontLight.position.set(1.8, -0.3, 0); 
        this.frontLight.target.position.set(3, -2, 0);
        this.add(this.frontLight);
        this.add(this.frontLight.target);

        this.frontLight.angle = Math.PI / 6;
        this.frontLight.penumbra = 0.3;
        this.frontLight.decay = 3;
        this.frontLight.distance = 15;
        this.frontLight.castShadow = true;
        
        this.frontLight.shadow.mapSize.width = 1024;
        this.frontLight.shadow.mapSize.height = 1024;
        this.frontLight.shadow.camera.near = 0.5;
        this.frontLight.shadow.camera.far = 20;
        this.frontLight.shadow.bias = -0.0001;

        // warning light
        const warningLightBulb = new THREE.Mesh(
            new THREE.SphereGeometry(0.03, 8, 8),
            new THREE.MeshBasicMaterial({ 
                color: 0xff0000,
                transparent: true,
                opacity: 0.9,
                blending: THREE.AdditiveBlending
            })
        );
        warningLightBulb.position.set(0.3, 1.1, 0);
        this.add(warningLightBulb);

        this.warningLight = new THREE.PointLight(0xff0000, this.warningLightIntensity);
        this.warningLight.position.set(0.3, 1.1, 0);
        this.add(this.warningLight);
        this.warningLightBulb = warningLightBulb;

        
        this.warningLight.decay = 4;
        this.warningLight.distance = 8;
        
        this.warningLightTimer = 0;
        this.warningLightFlashRate = 0.5;
        this.isWarningLightOn = true;

        // frontlight on layer 1 so that it is not visible in submarine camera
        frontLightBulb.layers.set(1);

        //Bounding box used in the simple collision system
        this.box = new THREE.Box3().setFromObject(this, true);
        this.boxHelper = new THREE.Box3Helper(this.box, 0xff0000);
        this.boxHelper.visible = false;
        this.add(this.boxHelper);

        // shield effect
        this.shieldEnabled = false;
        this.shieldC = 1.0;
        this.shieldP = 2.0;
        
        const shieldGeometry = new THREE.SphereGeometry(2.2, 32, 32);
        
        // Fresnel shader material for shield effect
        const shieldMaterial = new THREE.ShaderMaterial({
            uniforms: {
                c: { value: this.shieldC },
                p: { value: this.shieldP },
                glowColor: { value: new THREE.Color(0x00ffff) }
            },
            vertexShader: `
                varying vec3 vNormal;
                varying vec3 vViewPosition;
                void main() {
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    vViewPosition = -mvPosition.xyz;
                    vNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                uniform vec3 glowColor;
                uniform float c;
                uniform float p;
                varying vec3 vNormal;
                varying vec3 vViewPosition;
                void main() {
                    vec3 viewDir = normalize(vViewPosition);
                    float fresnel = max(0.0, c - dot(vNormal, viewDir));
                    float intensity = pow(fresnel, p);
                    gl_FragColor = vec4(glowColor, intensity);
                }
            `,
            side: THREE.FrontSide,
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthWrite: false
        });
        
        this.shield = new THREE.Mesh(shieldGeometry, shieldMaterial);
        this.shield.visible = false;
        this.add(this.shield);

        
    }

    update(delta) {
        if (!this.elapsed) this.elapsed = 0;
        this.elapsed += delta;

        const propeller = this.children.find(child => child.position.x === -2);
        if (propeller) {
            propeller.rotation.x += delta * 5;
        }

        this.warningLightTimer += delta;
        if (this.warningLightTimer >= this.warningLightFlashRate) {
            this.warningLightTimer = 0;
            this.isWarningLightOn = !this.isWarningLightOn;
            
            if (this.warningLightEnabled) {
                this.warningLight.visible = this.isWarningLightOn;
                this.warningLightBulb.visible = this.isWarningLightOn;
            }
        }

        if((this.elapsed % 4 == 0) && this.bvh){
            this.bodyGeometry.boundsTree.refit();
            this.hatchGeometry.boundsTree.refit();
            this.tubeGeometry.boundsTree.refit();
        }
    }

    toggleFrontLight() {
        this.frontLightEnabled = !this.frontLightEnabled;
        this.frontLight.visible = this.frontLightEnabled;
        
        if (this.frontLightEnabled) {
            this.frontLightBulb.material.color.setHex(this.frontLightColor);
            this.frontLightBulb.material.opacity = 0.9;
            this.frontLightBulb.material.blending = THREE.AdditiveBlending;
        } else {
            this.frontLightBulb.material.color.set(0x666666);
            this.frontLightBulb.material.opacity = 0.4;
            this.frontLightBulb.material.blending = THREE.NormalBlending;
        }
        
        return this.frontLightEnabled;
    }
    
    setFrontLightIntensity(value) {
        this.frontLightIntensity = value;
        this.frontLight.intensity = value;

        if (this.frontLightEnabled) {
            this.frontLightBulb.material.color.set(value);
        }
    }

    setFrontLightColor(value) {
        this.frontLightColor = value;
        this.frontLight.color.setHex(value);
        this.frontLightBulb.material.color.set(value);
    }

    setFrontLightDecay(value) {
        this.frontLightDecay = value;
        this.frontLight.decay = value;
    }

    toggleWarningLight() {
        this.warningLightEnabled = !this.warningLightEnabled;
        this.warningLight.visible = this.warningLightEnabled && this.isWarningLightOn;
        
        if (this.warningLightEnabled) {
            this.warningLightBulb.material.color.set(0xff0000);
            this.warningLightBulb.material.opacity = 0.9;
            this.warningLightBulb.material.blending = THREE.AdditiveBlending;
        } else {
            this.warningLightBulb.material.color.set(0x333333);
            this.warningLightBulb.material.opacity = 0.3;
            this.warningLightBulb.material.blending = THREE.NormalBlending;
        }
        
        return this.warningLightEnabled;
    }
    
    setWarningLightIntensity(value) {
        this.warningLightIntensity = value;
        this.warningLight.intensity = value;
    }

    setWarningFlashRate(value) {
        this.warningFlashRate = value;
        this.warningLightFlashRate = value;
    }

    toggleShield() {
        this.shieldEnabled = !this.shieldEnabled;
        this.shield.visible = this.shieldEnabled;
        return this.shieldEnabled;
    }

    setShieldC(value) {
        this.shieldC = value;
        this.shield.material.uniforms.c.value = value;
    }

    setShieldP(value) {
        this.shieldP = value;
        this.shield.material.uniforms.p.value = value;
    }

    setShieldColor(color) {
        this.shield.material.uniforms.glowColor.value.set(color);
    }
}

export { MySubmarine };