import * as THREE from 'three';
import { MyCarp } from './MyCarp.js';

class MySchoolfOfFish extends THREE.Object3D {
    constructor(numbFish, minSpace,maxScale, minScale, specie, baseLen, baseWidth){
        super();
        
        const gridSide = Math.ceil(Math.cbrt(numbFish));
        const fishGroup = new THREE.Group();
        let fishCount = 0;


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

                    fishGroup.add(cloneSpecie);
                    fishCount++;
                }
                
            }
        }
    
        this.add(fishGroup);
    }
}

export{ MySchoolfOfFish};