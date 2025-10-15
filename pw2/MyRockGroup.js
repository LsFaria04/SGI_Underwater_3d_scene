import * as THREE from 'three';
import {getRandomInt} from './utils.js';
import { MyRock } from './MyRock.js';

class MyRockGroup extends THREE.Object3D {
    constructor(numbRocks, maxSpace,maxScale, minScale, colors){
        super();
        
        const rock = new MyRock(1,1,1);
        const gridSide = Math.ceil(Math.sqrt(numbRocks));
        const rockGroup = new THREE.Group();
        let rockCount = 0;

        const baseWidth = rock.width;
        const baseDepth = rock.depth;

        // Track cumulative positions per axis
        const spacingMatrix = new Array(gridSide).fill().map(() =>
                new Array(gridSide).fill([0,0])
        );

        for (let x = 0; x < gridSide && rockCount < numbRocks; x++) {
            for (let y = 0; y < gridSide && rockCount < numbRocks; y++) {
            const cloneRock = rock.clone();

            // Random scale
            const scaleFactor = THREE.MathUtils.lerp(minScale, maxScale, Math.random());
            cloneRock.scale.set(scaleFactor, scaleFactor, scaleFactor);

            //Random color
            const randomColor = getRandomInt(0,colors.length - 1);
            const color = colors[randomColor];
            cloneRock.traverse(child => {
                if (child.isMesh) {
                    child.material = new THREE.MeshPhongMaterial({ color: color });
                    child.material.needsUpdate = true;
                }
            });
            

            const newRockWidth = baseWidth * scaleFactor;
            const newRockDepth = baseDepth * scaleFactor;
            const spacingWidth = newRockWidth + maxSpace;
            const spacingDepth = newRockDepth + maxSpace;
            
            
            const prevX = x > 0 ? spacingMatrix[x - 1][y] : spacingMatrix[x][y];  
            const prevy = y > 0 ? spacingMatrix[x][y - 1]: spacingMatrix[x][y];
            spacingMatrix[x][y] = [prevX[0] + spacingWidth, prevy[1] + spacingDepth]

            // Position fish
            cloneRock.position.set(
                spacingMatrix[x][y][0] - spacingWidth + newRockWidth / 2,
                0,
                spacingMatrix[x][y][1] - spacingDepth + newRockDepth / 2,
            );
            rockGroup.add(cloneRock);
            rockCount++;
            }
            
        
        }
    
        this.add(rockGroup);
    }
}

export{ MyRockGroup};