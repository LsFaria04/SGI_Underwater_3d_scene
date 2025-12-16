import * as THREE from 'three';
import {floorHeightPosition, getRandomInt} from '../utils.js';
import { MyRock } from './MyRock.js';


class MyRockGroup extends THREE.Group {
    constructor(numbRocks,x, z,  minSpace,maxScale, minScale, colors, overlap, textures){
        super();
        
        this.position.set(x, 0, z);
        const gridSide = Math.ceil(Math.sqrt(numbRocks));
        let rockCount = 0;
        this.rocks = []

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
            
            
            texture.albedo.wrapS = THREE.RepeatWrapping;
            texture.albedo.wrapT = THREE.RepeatWrapping;
            texture.albedo.repeat.set(4, 4);
            texture.roughness.wrapS = THREE.RepeatWrapping;
            texture.roughness.wrapT = THREE.RepeatWrapping;
            texture.roughness.repeat.set(4, 4);
            texture.metallic.wrapS = THREE.RepeatWrapping;
            texture.metallic.wrapT = THREE.RepeatWrapping;
            texture.metallic.repeat.set(4, 4);
            texture.normal.wrapS = THREE.RepeatWrapping;
            texture.normal.wrapT = THREE.RepeatWrapping;
            texture.normal.repeat.set(4, 4);
            texture.ao.wrapS = THREE.RepeatWrapping;
            texture.ao.wrapT = THREE.RepeatWrapping;
            texture.ao.repeat.set(4, 4);

            
            
            rock.traverse(child => {
                if (child.isMesh) {
                    child.material = new THREE.MeshStandardMaterial(
                        { color: color, 
                        
                        });
                    child.material.needsUpdate = true;
                }
            });
            highLODRock.traverse(
                child => {
                if (child.isMesh) {
                    //for ao
                    child.geometry.setAttribute('uv2', new THREE.BufferAttribute(child.geometry.attributes.uv.array, 2));

                    child.material = new THREE.MeshStandardMaterial(
                        { color: color, 
                        map: texture.albedo,
                        normalMap: texture.normal,
                        roughnessMap: texture.roughness,
                        metalnessMap: texture.metallic,
                        aoMap: texture.ao,
                        });
                    child.material.needsUpdate = true;
                }
            }
            )
            midLODRock.traverse(
                child => {
                if (child.isMesh) {
                    child.material = new THREE.MeshStandardMaterial(
                        { color: color, 
                        

                        });
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
            
            const worldX = this.position.x + cellWidth * x;
            const worldZ = this.position.z + cellDepth * y;
            const worldY = floorHeightPosition(worldX, worldZ);
            lod.position.set(cellWidth * x, worldY, cellDepth * y);

            lod.addLevel(rock, 30);
            lod.addLevel(highLODRock,0);
            lod.addLevel(midLODRock,15);
            this.add(lod);
            this.rocks.push(lod);
            rockCount++;
            }
            
        
        }
    }
}

export{ MyRockGroup};