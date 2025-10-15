import * as THREE from 'three';
import { MyCarp } from './MyCarp.js';

class MySchoolfOfFish extends THREE.Object3D {
    constructor(numbFish, minSpace,maxScale, minScale, specie){
        super();
        
        const gridSide = Math.ceil(Math.cbrt(numbFish));
        const fishGroup = new THREE.Group();
        let fishCount = 0;

        const baseLen = 1;
        const baseWidth = 1;
        
        // Track cumulative positions per axis
        const spacingMatrix = new Array(gridSide).fill().map(() =>
            new Array(gridSide).fill().map(() =>
                new Array(gridSide).fill([0,0,0])
            )
        );

        for (let x = 0; x < gridSide && fishCount < numbFish; x++) {
            for (let y = 0; y < gridSide && fishCount < numbFish; y++) {
                for (let z = 0; z < gridSide && fishCount < numbFish; z++) {
                    const cloneSpecie = new MyCarp(1,1);
               
                    cloneSpecie.traverse(child => {
                        if (child.isMesh) {
                            child.material = new THREE.MeshPhongMaterial({ color: "#00b3ff" });
                            child.material.needsUpdate = true;
                        }
                    });

                    // Random scale
                    const scaleFactor = THREE.MathUtils.lerp(minScale, maxScale, Math.random());
                    cloneSpecie.scale.set(scaleFactor, scaleFactor, scaleFactor);

                    const spacingLen = baseLen * scaleFactor + minSpace;
                    const spacingWidth = baseWidth * scaleFactor + minSpace;
                    
                    const prevX = x > 0 ? spacingMatrix[x - 1][y][z] : spacingMatrix[x][y][z]  
                    const prevy = y > 0 ? spacingMatrix[x][y - 1][z] : spacingMatrix[x][y][z]  
                    const prevz = z > 0 ? spacingMatrix[x][y][z - 1] : spacingMatrix[x][y][z]  
                    spacingMatrix[x][y][z] = [prevX[0] + spacingWidth, prevy[1] + spacingWidth, prevz[2] + spacingLen]

                    // Position fish
                    cloneSpecie.position.set(
                        spacingMatrix[x][y][z][0],
                        spacingMatrix[x][y][z][1],
                        spacingMatrix[x][y][z][2]
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