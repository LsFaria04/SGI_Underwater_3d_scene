import * as THREE from 'three';
import { MyCarp } from './MyCarp.js';
import { MyKeyFrameAnimation } from './MyKeyframeAnimation.js';

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
     */
    constructor(numbFish, minSpace,maxScale, minScale, specie, baseLen, baseWidth, fishTexture){
        super();
        this.minSpace = minSpace;
        
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
                    this.fishGroupsAnimations.push(new MyKeyFrameAnimation(cloneSpecie, "random", 2,50, 30));
                    this.add(cloneSpecie);
                    this.fishes.push(cloneSpecie); // Add to fish array
                    fishCount++;

                   
                }
                
            }
        }
    
    }

    /**
     * Controls the flocking behaviour in the school of fish
     */
    flocking(delta){

        let v1 = new THREE.Vector3(0,0,0);
        let v2 = new THREE.Vector3(0,0,0);
        let v3 = new THREE.Vector3(0,0,0);

        for(const fish of this.fishes){
            //the three rules
            v1 = this.separation(fish);
            v2 = this.alignment(fish);
            v3 = this.cohesion(fish);

            

            //use the three rules to change the velocity and position
            fish.velocity
            .addScaledVector(v1, delta)
            .addScaledVector(v2, delta)
            .addScaledVector(v3, delta);

            const maxSpeed = 1; // tune this
            if (fish.velocity.length() > maxSpeed) {
                fish.velocity.setLength(maxSpeed);
            }

            // update position
            fish.position.add(fish.velocity);

        }
        
    }
    /**
     * Flooking Rule 1: Separation
     */
    separation(fishj){
        let positionDisplacement = new THREE.Vector3();

        for (const fish of this.fishes) {
            if (fish !== fishj) {
                const dist = fish.position.distanceTo(fishj.position);

                if (dist < this.minSpace) {
                    // displacement = displacement - (fish.position - fishj.position)
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

        for (const fish of this.fishes) {
            if (fish !== fishj) {
                velocityWeight.add(fish.velocity);
            }
        }

        // average velocity of neighbors
        velocityWeight.divideScalar(this.fishes.length - 1);

        // difference between average and current velocity
        const steer = new THREE.Vector3().subVectors(velocityWeight, fishj.velocity);

        // scale down influence (1/8th)
        steer.divideScalar(8);

        return steer;
    }
    /**
     * Flooking Rule 3: Cohesion
     */
    cohesion(fishj){
        let positionWeight = new THREE.Vector3();

        for (const fish of this.fishes) {
            if (fish !== fishj) {
                positionWeight.add(fish.position);
            }
        }

        // average position of neighbors
        positionWeight.divideScalar(this.fishes.length - 1);

        // vector pointing from current fish to average position
        const steer = new THREE.Vector3().subVectors(positionWeight, fishj.position);

        // scale down influence (1% weight)
        steer.divideScalar(100);

        return steer;
    }

    
    update(delta){
        // Update each fish in the school
        for (const fish of this.fishes) {
            if (fish.update) {
                fish.update(delta);
            }
        }

        this.flocking(delta);
    }

    getAnimations(){
        return this.fishGroupsAnimations;
    }
}

export{ MySchoolfOfFish};