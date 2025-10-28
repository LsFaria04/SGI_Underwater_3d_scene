import * as THREE from 'three';
import {getRandomInt} from './utils.js';
import { MyRock } from './MyRock.js';


class MyRockGroup extends THREE.Group {
    constructor(numbRocks, minSpace,maxScale, minScale, colors, overlap, textures){
        super();
        

        const gridSide = Math.ceil(Math.sqrt(numbRocks));
        let rockCount = 0;

        const baseWidth = 1 ;
        const baseDepth = 1 ;

        let baseCellWidth = baseWidth * maxScale + minSpace;
        let baseCellDepth = baseDepth * maxScale + minSpace;

        for (let x = 0; x < gridSide && rockCount < numbRocks; x++) {
            for (let y = 0; y < gridSide && rockCount < numbRocks; y++) {
            const rock = new MyRock(1,null, null,  "L");
            const highLODRock = new MyRock(1,null,null, "H");
            const midLODRock = new MyRock(1,null,null, "M");
            const lod = new THREE.LOD();

            // Random scale
            const scaleFactor = THREE.MathUtils.lerp(minScale, maxScale, Math.random());
            rock.scale.set(scaleFactor, scaleFactor, scaleFactor);
            highLODRock.scale.set(scaleFactor, scaleFactor,scaleFactor);
            midLODRock.scale.set(scaleFactor, scaleFactor,scaleFactor);

            //Random color and texture
            const randomColor = getRandomInt(0,colors.length - 1);
            const color = colors[randomColor];
            const randomTexture = getRandomInt(0,textures.length - 1);
            const texture = textures[randomTexture];
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(4, 4);
            rock.traverse(child => {
                if (child.isMesh) {
                    child.material = new THREE.MeshPhongMaterial({ color: color, map: texture});
                    child.material.needsUpdate = true;
                }
            });
            highLODRock.traverse(
                child => {
                if (child.isMesh) {
                    child.material = new THREE.MeshStandardMaterial({ color: color, map: texture, roughness: 0.7});
                    child.material.needsUpdate = true;
                }
            }
            )
            midLODRock.traverse(
                child => {
                if (child.isMesh) {
                    child.material = new THREE.MeshPhongMaterial({ color: color, map: texture});
                    child.material.needsUpdate = true;
                }
            }
            )
            
            let cellWidth = baseCellWidth;
            let cellDepth = baseCellDepth;
            if(overlap){
                cellWidth = THREE.MathUtils.lerp(baseWidth * minScale + minSpace, baseCellWidth, Math.random());
                cellDepth = THREE.MathUtils.lerp(baseDepth * minScale + minSpace, baseCellDepth, Math.random());
            }
            
            // Position fish
            lod.position.set(
                cellWidth * x,
                0,
                cellDepth * y
            );
            lod.addLevel(rock, 30);
            lod.addLevel(highLODRock,0);
            lod.addLevel(midLODRock,15);
            this.add(lod);
            rockCount++;
            }
            
        
        }
    }
}

export{ MyRockGroup};