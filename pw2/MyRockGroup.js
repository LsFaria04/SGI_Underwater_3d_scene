import * as THREE from 'three';
import {getRandomInt} from './utils.js';
import { MyRock } from './MyRock.js';

class MyRockGroup extends THREE.Object3D {
    constructor(numbRocks, minSpace,maxScale, minScale, colors, overlap){
        super();
        
        const rock = new MyRock(1,1,1);
        const gridSide = Math.ceil(Math.sqrt(numbRocks));
        const rockGroup = new THREE.Group();
        let rockCount = 0;

        const baseWidth = rock.width;
        const baseDepth = rock.depth;

        let baseCellWidth = baseWidth * maxScale + minSpace;
        let baseCellDepth = baseDepth * maxScale + minSpace;

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
            
            let cellWidth = baseCellWidth;
            let cellDepth = baseCellDepth;
            if(overlap){
                cellWidth = THREE.MathUtils.lerp(baseWidth * minScale + minSpace, baseCellWidth, Math.random());
                cellDepth = THREE.MathUtils.lerp(baseDepth * minScale + minSpace, baseCellDepth, Math.random());
            }
            
            // Position fish
            cloneRock.position.set(
                cellWidth * x,
                0,
                cellDepth * y
            );
            rockGroup.add(cloneRock);
            rockCount++;
            }
            
        
        }
    
        this.add(rockGroup);
    }
}

export{ MyRockGroup};