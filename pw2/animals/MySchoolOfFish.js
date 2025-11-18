import * as THREE from 'three';
import { MyCarp } from './MyCarp.js';
import { MyKeyFrameAnimation } from '../animations/MyKeyframeAnimation.js';

/**
 * This class represents a school of fish (fish group)
 */
class MySchoolfOfFish extends THREE.Group {
    /**
     * 
     * @param {*} numbFish Number of fish in the group
     * @param {*} minSpace Minimum space between each fish
     * @param {*} maxScale Maximum scale of each fish
     * @param {*} minScale Minimum scale of each fish
     * @param {*} specie Specie of fish 
     * @param {*} baseLen Base lenght before scaling of the fishes
     * @param {*} baseWidth Base width before scaling of the fishes
     * @param {*} fishTexture Texture of the fishes
     * @param {*} flockingParams Parameters used for the flocking behaviour
     */
    constructor(numbFish, minSpace,maxScale, minScale, specie, baseLen, baseWidth, fishTexture, flockingParams){
        super();
        this.minSpace = minSpace;
        this.maxScale = maxScale;

        this.bvh = false;

        //default values for the flocking atributes
        this.cohesionW = flockingParams.cohesion;
        this.aligmentW = flockingParams.alignment;
        this.separationW = flockingParams.separation;
        this.maxSpeed = flockingParams.maxSpeed;
        
        const gridSide = Math.ceil(Math.cbrt(numbFish));
        let fishCount = 0;

        this.fishes = []; // Store all fish instances
        this.fishTexture = fishTexture;

        this.fishGroupsAnimations = []; // Store all animations for the fishes

        const cellWidth = baseWidth * maxScale + minSpace;
        const cellLen = baseLen * maxScale + minSpace;

        for (let x = 0; x < gridSide && fishCount < numbFish; x++) {
            for (let y = 0; y < gridSide && fishCount < numbFish; y++) {
                for (let z = 0; z < gridSide && fishCount < numbFish; z++) {
                    const cloneSpecie = new MyCarp(baseLen,baseWidth, baseWidth,baseLen, this.fishTexture);
                    
                    cloneSpecie.traverse(child => {
                        if (child.isMesh) {
                            // Don't use texture map since geometry doesn't have UV coordinates
                            child.material = new THREE.MeshPhongMaterial({ color: "#00b3ff", side:THREE.DoubleSide});
                            child.material.needsUpdate = true;
                        }
                    });

                    // Random scale
                    const scaleFactor = THREE.MathUtils.lerp(minScale, maxScale, Math.random());
                    cloneSpecie.scale.set(scaleFactor, scaleFactor, scaleFactor);

                    // Position fish
                    cloneSpecie.position.set(
                        cellWidth * x,
                        cellWidth * y,
                        cellLen * z
                    );

                    cloneSpecie.velocity = new THREE.Vector3(0,0,0); //initialize the speed to zero (used for the flocking animation)
                    cloneSpecie.acceleration = new THREE.Vector3(0,0,0);;
                    this.fishGroupsAnimations.push(new MyKeyFrameAnimation(cloneSpecie, "random", 2,50, 30));
                    this.add(cloneSpecie);
                    this.fishes.push(cloneSpecie); // Add to fish array
                    fishCount++;

                   
                }
                
            }
        }
    
    }

    /**
     * Finds the neighbors of a boid using BVH
     */
    findNeighbors(fish, fishes, radius) {
        const neighbors = [];
        const sphereWorld = new THREE.Sphere(fish.getWorldPosition(new THREE.Vector3()), radius);

        for (const other of fishes) {
            if (other === fish) continue;

            other.traverse(child => {
            if (child.isMesh && child.geometry.boundsTree) {
                const geom = child.geometry;
                let found = false;

                // convert sphere to local space of this child
                const sphereLocal = sphereWorld.clone();
                sphereLocal.center.applyMatrix4(child.matrixWorld.clone().invert());

                const tmpVec = new THREE.Vector3();
                geom.boundsTree.shapecast({
                intersectsBounds: box => box.intersectsSphere(sphereLocal),
                intersectsTriangle: tri => {
                    tri.closestPointToPoint(sphereLocal.center, tmpVec);
                    if (tmpVec.distanceTo(sphereLocal.center) <= sphereLocal.radius) {
                        found = true;
                        return true;
                    }
                    return false; // continue traversal
                }
                });

                if (found) neighbors.push(other);
            }
            });
        }
        return neighbors;
    }

    /**
     * Controls the flocking behaviour in the school of fish
     */
    flocking(delta){
        
        let v1 = new THREE.Vector3(0,0,0);
        let v2 = new THREE.Vector3(0,0,0);
        let v3 = new THREE.Vector3(0,0,0);
        let v4 = new THREE.Vector3(0,0,0);
        let v5 = new THREE.Vector3(0,0,0);

        for(const fish of this.fishes){

            //find the neighbours using bvh 
            if(this.bvh){
                 this.neighbors = this.findNeighbors(fish,this.fishes, this.minSpace / 2 + this.maxScale / 2)
            }
            else{
                this.neighbors = this.fishes
            }
           

            
            //the three rules
            v1 = this.separation(fish);
            v2 = this.alignment(fish);
            v3 = this.cohesion(fish);
            
            //extra rules
            v4 = this.bound_position(fish);
            v5 = this.avoid_predators(fish);

            

            //add acceleration using the rules
            fish.acceleration
            .addScaledVector(v1, 1 * this.separationW)
            .addScaledVector(v2, 0.1 * this.aligmentW)
            .addScaledVector(v3, 0.4 * this.cohesionW)
            .addScaledVector(v4, 1 * this.separationW)
            .addScaledVector(v5,10 * this.separationW);


            
            //use the acceleration to change the velocity and position
            fish.velocity.addScaledVector(fish.acceleration, delta);


            //use a precise flag to see if the fish is in a danger zone (close to enemies)
            fish.isInDanger = false;

            for (const enemy of this.enemyPositions) {
                const dist = enemy.distanceTo(fish.position.clone().add(this.position));
                if (dist < 8) {
                    fish.isInDanger = true;
                }
            }
            
            //limit the speed but add a higher to fishes in danger
            let maxSpeed = fish.isInDanger ? this.maxSpeed * 2 : this.maxSpeed;
            fish.velocity.clampLength(-maxSpeed, maxSpeed);

            // update position
            fish.position.addScaledVector(fish.velocity, delta);

            
            //update rotation
            if (fish.velocity.lengthSq() > 0) {
                const dir = fish.velocity.clone().normalize();
                const forward = new THREE.Vector3(-1, 0, 0); // model original forward positon is to -X
                const quat = new THREE.Quaternion().setFromUnitVectors(forward, dir);
                fish.quaternion.slerp(quat, delta); // smooth turning (or at leats close to smooth)
            }

            fish.acceleration.set(0,0,0);

        }
        
    }
    /**
     * Flooking Rule 1: Separation
     */
    separation(fishj){
        let positionDisplacement = new THREE.Vector3();

        for (const fish of this.neighbors) {
            if (fish !== fishj) {
                const dist = fish.position.distanceTo(fishj.position);

                //avoid colisions
                if (dist < (this.minSpace / 2 + this.maxScale / 2)) {
                    const diff = new THREE.Vector3().subVectors(fish.position, fishj.position);
                    positionDisplacement.sub(diff);
                }
            }
        }

        return positionDisplacement;
        
    }
    /**
     * Flooking Rule 2: Aligment
     */
    alignment(fishj){
        let velocityWeight = new THREE.Vector3();

        for (const fish of this.neighbors) {
            if (fish !== fishj) {
                velocityWeight.add(fish.velocity);
            }
        }

        // average velocity of neighbors
        velocityWeight.divideScalar(this.fishes.length - 1);

        // difference between average and current velocity
        const steer = new THREE.Vector3().subVectors(velocityWeight, fishj.velocity);


        return steer;
    }
    /**
     * Flooking Rule 3: Cohesion
     */
    cohesion(fishj){
        let positionWeight = new THREE.Vector3();

        for (const fish of this.neighbors) {
            if (fish !== fishj) {
                positionWeight.add(fish.position);
            }
        }

        // average position of neighbors
        positionWeight.divideScalar(this.fishes.length - 1);

        // vector pointing from current fish to average position
        const steer = new THREE.Vector3().subVectors(positionWeight, fishj.position);

        return steer;
    }

    /**
     * Bounds the fish positions so that they do not go out of the aquarium bounds
     */
    bound_position(fish){
        let maxX = 20;
        let minX = -20;
        let maxY = 15;
        let minY = 5;
        let maxZ = 20;
        let minZ = -20;

        let v = new THREE.Vector3(fish.velocity.x,fish.velocity.y,fish.velocity.z);

        if ((this.position.x  + fish.position.x) < minX){
            v.x = 1;
        }
        else if((this.position.x + fish.position.x) > maxX){
            v.x = -1;
        }

        if ((this.position.y + fish.position.y) < minY){
            v.y = 1;
        }
        else if((this.position.y  + fish.position.y) > maxY){
            v.y = -1;
        }

        if ((this.position.z + fish.position.z) < minZ){
            v.z = 1;
        }
        else if((this.position.z + fish.position.z) > maxZ){
            v.z = -1;
        }

        return v;
        
    }
    /**
     * Extra Rule to avoid predators. Similar to the rule 2 but more intense
     */
    avoid_predators(fish){
        let positionDisplacement = new THREE.Vector3();

        for (const enemy of this.enemyPositions) {
            const fishWorldPos = fish.position.clone().add(this.position);
            const dist = enemy.distanceTo(fishWorldPos);

            //avoid colisions with enemies
            if (dist < 6) {
                const diff = new THREE.Vector3().subVectors(enemy, fishWorldPos);
                positionDisplacement.sub(diff);
            }
        
        }

        
        return positionDisplacement;
    }

    
    update(delta, enemyPositions){
        // Update each fish in the school
        for (const fish of this.fishes) {
            if (fish.update) {
                fish.update(delta);
            }
        }
        this.enemyPositions = enemyPositions;
        this.flocking(delta);
    }

    getAnimations(){
        return this.fishGroupsAnimations;
    }

    updateFlockingParams(flockingParams){
        this.aligmentW = flockingParams.alignment;
        this.separationW = flockingParams.separation;
        this.cohesionW = flockingParams.cohesion;
        this.maxSpeed = flockingParams.maxSpeed;
    }
}

export{ MySchoolfOfFish};