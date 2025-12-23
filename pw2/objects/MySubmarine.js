import * as THREE from 'three';
import {
    MeshBVHHelper
} from '../index.module.js';

/**
 * Submarine object with movement, lighting, collision detection, and shield effect.
 */
class MySubmarine extends THREE.Object3D {

    /**
     * 
     * @param {*} videoTexture Texture for submarine windows (optional)
     */
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

        // movement and physics
        this.velocity = new THREE.Vector3();
        this.acceleration = new THREE.Vector3();
        this.maxSpeed = 3.0;
        this.accelerationRate = 3.0;
        this.decelerationRate = 2.0;
        this.rotationSpeed = 0.5;

        // collision
        this.collisionResponse = true;
        this.collisionDamping = 0.5;

        // movement state
        this.moveState = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            up: false,
            down: false
        };

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

        const submarineGroup = new THREE.Group();
        submarineGroup.name = 'submarineGroup';

        // main body
        this.bodyGeometry = new THREE.CapsuleGeometry(0.5, 3, 8, 16);
        const body = new THREE.Mesh(this.bodyGeometry, bodyMaterial);
        body.rotation.z = Math.PI / 2;
        submarineGroup.add(body);
        body.castShadow = true;
        body.receiveShadow = true;
        this.bodyGeometry.computeBoundsTree();
        const helper = new MeshBVHHelper(body);
        submarineGroup.add(helper);
        helper.visible = false;
        this.helpers.push(helper);
        

        // hatch
        this.hatchGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.3, 12);
        const hatch = new THREE.Mesh(this.hatchGeometry, darkMetalMaterial);
        hatch.position.set(0, 0.4, 0);
        submarineGroup.add(hatch);
        hatch.castShadow = true;
        hatch.receiveShadow = true;
        this.hatchGeometry.computeBoundsTree();
        const helper2 = new MeshBVHHelper(hatch);
        submarineGroup.add(helper2);
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
        submarineGroup.add(periscope);
        periscope.castShadow = true;
        periscope.receiveShadow = true;
        this.tubeGeometry.computeBoundsTree();
        const helper3 = new MeshBVHHelper(periscope);
        submarineGroup.add(helper3);
        helper3.visible = false;
        this.helpers.push(helper3);

        const lensGeometry = new THREE.CircleGeometry(0.035, 16);

        const lens = new THREE.Mesh(lensGeometry, glassMaterial);
        lens.position.set(0.3, 1.1, 0); 
        lens.rotation.y = Math.PI / 2;    
        submarineGroup.add(lens);
        lens.castShadow = true;
        lens.receiveShadow = true;

        const lensHousingGeometry = new THREE.RingGeometry(0.035, 0.045, 16);
        const lensHousing = new THREE.Mesh(lensHousingGeometry, darkMetalMaterial);
        lensHousing.position.copy(lens.position);
        lensHousing.rotation.copy(lens.rotation);
        submarineGroup.add(lensHousing);
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

        // Group all windows into a parent group
        const allWindowsGroup = new THREE.Group();
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
            allWindowsGroup.add(windowGroup);
        });
        submarineGroup.add(allWindowsGroup);
        this.add(submarineGroup);

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

        submarineGroup.add(propellerGroup);
        this.propellerGroup = propellerGroup;

        // rudder
        const rudderGeometry = new THREE.BoxGeometry(0.1, 1.2, 0.3);
        const rudder = new THREE.Mesh(rudderGeometry, bodyMaterial);
        rudder.position.set(-1.8, 0, 0);
        rudder.rotation.set(0,Math.PI/2,0);
        rudder.castShadow = true;
        rudder.receiveShadow = true;
        submarineGroup.add(rudder);

        // stern planes
        const sternPlaneGeometry = new THREE.BoxGeometry(0.6, 0.1, 0.2);
        const leftSternPlane = new THREE.Mesh(sternPlaneGeometry, bodyMaterial);
        leftSternPlane.position.set(-1.8, 0, -0.4);
        leftSternPlane.rotation.set(0,Math.PI/2,0);
        leftSternPlane.castShadow = true;
        leftSternPlane.receiveShadow = true;
        submarineGroup.add(leftSternPlane);

        const rightSternPlane = new THREE.Mesh(sternPlaneGeometry, bodyMaterial);
        rightSternPlane.position.set(-1.7, 0, 0.4);
        rightSternPlane.rotation.set(0,Math.PI/2,0);
        rightSternPlane.castShadow = true;
        rightSternPlane.receiveShadow = true;
        submarineGroup.add(rightSternPlane);
        
        submarineGroup.rotation.y = Math.PI/2; //so that it faces the same direction as camera
        this.add(submarineGroup);

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
        submarineGroup.add(frontLightBulb);
        this.frontLightBulb = frontLightBulb;
        frontLightBulb.layers.set(2);
        

        this.frontLight = new THREE.SpotLight(0xffffcc, this.frontLightIntensity);
        this.frontLight.position.set(1.8, -0.3, 0); 
        this.frontLight.target.position.set(3, -2, 0);
        submarineGroup.add(this.frontLight);
        submarineGroup.add(this.frontLight.target);

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
        submarineGroup.add(warningLightBulb);

        this.warningLight = new THREE.PointLight(0xff0000, this.warningLightIntensity);
        this.warningLight.position.set(0.3, 1.1, 0);
        submarineGroup.add(this.warningLight);
        this.warningLightBulb = warningLightBulb;

        
        this.warningLight.decay = 4;
        this.warningLight.distance = 8;
        
        this.warningLightTimer = 0;
        this.warningLightFlashRate = 0.5;
        this.isWarningLightOn = true;

        // bounding box for simple collision system
        this.box = new THREE.Box3();
        this.boxHelper = new THREE.Box3Helper(this.box, 0xff0000);
        this.boxHelper.visible = false;
        this.boxHelper.layers.set(1);

        this.box.setFromObject(submarineGroup, true);

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
        this.shield.layers.set(1);
    }

    /**
     * Set movement state for the submarine
     * @param {*} key Movement direction key ('forward', 'backward', 'left', 'right', 'up', 'down')
     * @param {*} isPressed True if the key is pressed, false if released
     */
    setMoveState(key, isPressed) {
        switch (key) {
            case 'forward': this.moveState.forward = isPressed; break;
            case 'backward': this.moveState.backward = isPressed; break;
            case 'left': this.moveState.left = isPressed; break;
            case 'right': this.moveState.right = isPressed; break;
            case 'up': this.moveState.up = isPressed; break;
            case 'down': this.moveState.down = isPressed; break;
        }
    }

    /**
     * Update submarine movement based on current move state
     * @param {*} delta Time elapsed since last update
     */
    updateMovement(delta) {
        this.acceleration.set(0, 0, 0);

        const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(this.quaternion);
        const up = new THREE.Vector3(0, 1, 0);

        let isAccelerating = false;

        if (this.moveState.forward) {
            this.acceleration.add(forward.multiplyScalar(this.accelerationRate));
            isAccelerating = true;
        }
        if (this.moveState.backward) {
            this.acceleration.add(forward.multiplyScalar(-this.accelerationRate));
            isAccelerating = true;
        }

        if (this.moveState.left) {
            this.rotation.y += this.rotationSpeed * delta;
        }
        if (this.moveState.right) {
            this.rotation.y -= this.rotationSpeed * delta;
        }
        if (this.moveState.up) {
            this.acceleration.add(up.multiplyScalar(this.accelerationRate));
            isAccelerating = true;
        }
        if (this.moveState.down) {
            this.acceleration.add(up.multiplyScalar(-this.accelerationRate));
            isAccelerating = true;
        }

        this.velocity.add(this.acceleration.clone().multiplyScalar(delta));
        if (this.velocity.lengthSq() > 0.0001) {
            this.lastNonZeroVelocity = this.velocity.clone();
        }

        if (!isAccelerating) {
            const decelerationAmount = this.decelerationRate * delta;
            const currentSpeed = this.velocity.length();
            
            if (currentSpeed > 0) {
                const newSpeed = Math.max(0, currentSpeed - decelerationAmount);
                this.velocity.normalize().multiplyScalar(newSpeed);
            }
        }

        if (this.velocity.length() > this.maxSpeed) {
            this.velocity.normalize().multiplyScalar(this.maxSpeed);
        }

        this.position.add(this.velocity.clone().multiplyScalar(delta));

        if (this.propellerGroup) {
            const speed = this.velocity.length();
            const propellerSpeed = 5 + (speed / this.maxSpeed) * 15;
            this.propellerGroup.rotation.x += delta * propellerSpeed;
        }
    }

    /**
     * Check for collisions with given objects using BVH
     * @param {*} collisionObjects Array of objects to check collisions against
     * @return Collision info if a collision is detected, null otherwise
     */
    checkCollisions(collisionObjects) {
        if (!this.bvh || !collisionObjects || collisionObjects.length === 0) {
            return null;
        }

        const submarineWorldPos = new THREE.Vector3();
        this.getWorldPosition(submarineWorldPos);

        let collision = null;
        this.collisionGroup.traverse((subMesh) => {
            if (collision) return;
            if (!subMesh.isMesh || !subMesh.geometry.boundsTree) return;

            const subWorldMatrix = new THREE.Matrix4();
            subMesh.getWorldMatrix(subWorldMatrix);

            for (const collisionObj of collisionObjects) {
                if (collisionObj === this) continue;

                let targetMeshes = [];
                
                if (collisionObj.isMesh && collisionObj.geometry.boundsTree) {
                    targetMeshes.push(collisionObj);
                } else if (collisionObj.geometry && collisionObj.geometry.boundsTree) {
                    targetMeshes.push(collisionObj);
                } else {
                    collisionObj.traverse((child) => {
                        if (child.isMesh && child.geometry.boundsTree) {
                            targetMeshes.push(child);
                        }
                    });
                }

                for (const targetMesh of targetMeshes) {
                    const targetWorldMatrix = new THREE.Matrix4();
                    targetMesh.getWorldMatrix(targetWorldMatrix);

                    const result = subMesh.geometry.boundsTree.intersectsGeometry(
                        targetMesh.geometry,
                        targetWorldMatrix
                    );

                    if (result) {
                        const targetPos = new THREE.Vector3();
                        targetMesh.getWorldPosition(targetPos);
                        
                        const normal = new THREE.Vector3()
                            .subVectors(submarineWorldPos, targetPos)
                            .normalize();

                        return {
                            object: collisionObj,
                            mesh: targetMesh,
                            normal: normal,
                            point: submarineWorldPos.clone()
                        };
                    }
                }
            }
        });

        return null;
    }

    /**
     * Handle collision response
     * @param {*} collision Collision info
     */
    handleCollision(collision) {
        // repel submarine away from collision surface
        if (!collision || !this.collisionResponse) return;
        const repelStrength = 0.1;
        this.velocity.add(collision.normal.clone().multiplyScalar(repelStrength));
        this.lastCollisionNormal = collision.normal.clone();
        return;
    }

    /**
     * Update submarine state
     * @param {*} delta Time elapsed since last update
     * @param {*} collisionObjects Array of objects to check collisions against
     */
    update(delta, collisionObjects = []) {
        this.box.setFromObject(this.getObjectByName('submarineGroup') || this.children[0], true);
        
        const bounds = {
            minX: -30,
            minY: 2, 
            minZ: -30,
            maxX: 30,
            maxY: 20,
            maxZ: 30
        };

        this.position.x = Math.max(bounds.minX, Math.min(bounds.maxX, this.position.x));
        this.position.y = Math.max(bounds.minY, Math.min(bounds.maxY, this.position.y));
        this.position.z = Math.max(bounds.minZ, Math.min(bounds.maxZ, this.position.z));
        if (!this.elapsed) this.elapsed = 0;
        this.elapsed += delta;

        const prevPosition = this.position.clone();

        this.updateMovement(delta);

        // simple bounding box collision detection
        if (collisionObjects && collisionObjects.length > 0) {
            this.box.setFromObject(this.getObjectByName('submarineGroup') || this.children[0], true);
            let collisionNormal = null;
            let minDistance = Infinity;
            
            for (const obj of collisionObjects) {
                if (!obj || obj === this) continue;
                if (!obj.geometry && !obj.box) continue;
                
                let objBox;
                if (obj.box instanceof THREE.Box3) {
                    objBox = obj.box;
                } else {
                    objBox = new THREE.Box3().setFromObject(obj);
                }
                
                if (this.box.intersectsBox(objBox)) {
                    const objCenter = new THREE.Vector3();
                    objBox.getCenter(objCenter);
                    const subCenter = new THREE.Vector3();
                    this.box.getCenter(subCenter);
                    
                    const normal = new THREE.Vector3().subVectors(subCenter, objCenter);
                    const distance = normal.length();
                    
                    if (distance < minDistance) {
                        minDistance = distance;
                        collisionNormal = normal.normalize();
                    }
                }
            }
            
            if (collisionNormal) {
                this.position.copy(prevPosition);
                
                const velocityDot = this.velocity.dot(collisionNormal);
                
                if (velocityDot < 0) {
                    this.velocity.addScaledVector(collisionNormal, -velocityDot);
                    this.velocity.addScaledVector(collisionNormal, Math.abs(velocityDot) * 0.2);
                }
                
                this.position.addScaledVector(collisionNormal, 0.1);
                
                this.lastCollisionNormal = collisionNormal;
            }
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
            this.bodyGeometry.boundsTree?.refit?.();
            this.hatchGeometry.boundsTree?.refit?.();
            this.tubeGeometry.boundsTree?.refit?.();
        }
    }

    /**
     * Toggle front light on/off
     * @return Current state of front light (true=on, false=off)
     */
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

    /**
     * Set front light intensity
     * @param {*} value New intensity value
     */
    setFrontLightIntensity(value) {
        this.frontLightIntensity = value;
        this.frontLight.intensity = value;

        if (this.frontLightEnabled) {
            this.frontLightBulb.material.color.set(value);
        }
    }

    /**
     * Set front light color
     * @param {*} value New color value (hex)
     */
    setFrontLightColor(value) {
        this.frontLightColor = value;
        this.frontLight.color.setHex(value);
        this.frontLightBulb.material.color.set(value);
    }

    /**
     * Set front light decay
     * @param {*} value New decay value
     */
    setFrontLightDecay(value) {
        this.frontLightDecay = value;
        this.frontLight.decay = value;
    }

    /**
     * Toggle warning light on/off
     * @return Current state of warning light (true=on, false=off)
     */
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

    /**
     * Set warning light intensity
     * @param {*} value New intensity value
     */
    setWarningLightIntensity(value) {
        this.warningLightIntensity = value;
        this.warningLight.intensity = value;
    }

    /**
     * Set warning light flash rate
     * @param {*} value New flash rate value
     */
    setWarningFlashRate(value) {
        this.warningFlashRate = value;
        this.warningLightFlashRate = value;
    }

    /**
     * Toggle shield on/off
     * @return Current state of shield (true=on, false=off)
     */
    toggleShield() {
        this.shieldEnabled = !this.shieldEnabled;
        this.shield.visible = this.shieldEnabled;
        return this.shieldEnabled;
    }

    /**
     * Set shield 'c' parameter
     * @param {*} value New 'c' value
     */
    setShieldC(value) {
        this.shieldC = value;
        this.shield.material.uniforms.c.value = value;
    }
    /**
     * Set shield 'p' parameter
     * @param {*} value New 'p' value
     */
    setShieldP(value) {
        this.shieldP = value;
        this.shield.material.uniforms.p.value = value;
    }

    /**
     * Set shield color
     * @param {*} color New shield color
     */
    setShieldColor(color) {
        this.shield.material.uniforms.glowColor.value.set(color);
    }

    /**
     * Enable or disable collision response
     * @param {*} enabled True to enable, false to disable
     */
    setCollisionResponse(enabled) {
        this.collisionResponse = enabled;
    }

    /**
     * Set collision damping factor
     * @param {*} value New damping value (0 to 1)
     */
    setCollisionDamping(value) {
        this.collisionDamping = Math.max(0, Math.min(1, value));
    }

    /**
     * Set maximum speed
     * @param {*} value New maximum speed value
     */
    setMaxSpeed(value) {
        this.maxSpeed = value;
    }

    /**
     * Set acceleration rate
     * @param {*} value New acceleration rate value
     */
    setAccelerationRate(value) {
        this.accelerationRate = value;
    }

    /**
     * Set deceleration rate
     * @param {*} value New deceleration rate value
     */
    setDecelerationRate(value) {
        this.decelerationRate = value;
    }

    /**
     * Set rotation speed
     * @param {*} value New rotation speed value
     */
    setRotationSpeed(value) {
        this.rotationSpeed = value;
    }
}

export { MySubmarine };