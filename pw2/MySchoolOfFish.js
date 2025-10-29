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
     */
    constructor(numbFish, minSpace,maxScale, minScale, specie, baseLen, baseWidth){
        super();
        
        const gridSide = Math.ceil(Math.cbrt(numbFish));
        let fishCount = 0;

        this.fishes = []; // Store all fish instances

        this.fishGroupsAnimations = []; // Store all animations for the fishes

        const cellWidth = baseWidth * maxScale + minSpace;
        const cellLen = baseLen * maxScale + minSpace;

        for (let x = 0; x < gridSide && fishCount < numbFish; x++) {
            for (let y = 0; y < gridSide && fishCount < numbFish; y++) {
                for (let z = 0; z < gridSide && fishCount < numbFish; z++) {
                    const cloneSpecie = new MyCarp(baseLen,baseWidth, baseWidth,baseLen);
               
                    cloneSpecie.traverse(child => {
                        if (child.isMesh) {
                            child.material = new THREE.MeshPhongMaterial({ color: "#00b3ff", side:THREE.DoubleSide  });
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

                    this.fishGroupsAnimations.push(new MyKeyFrameAnimation(cloneSpecie, "random", 2,50, 30));
                    this.add(cloneSpecie);
                    this.fishes.push(cloneSpecie); // Add to fish array
                    fishCount++;
                }
                
            }
        }
    
    }

    update(delta){
        // Update each fish in the school
        for (const fish of this.fishes) {
            if (fish.update) {
                fish.update(delta);
            }
        }
    }

    getAnimations(){
        return this.fishGroupsAnimations;
    }
}

export{ MySchoolfOfFish};