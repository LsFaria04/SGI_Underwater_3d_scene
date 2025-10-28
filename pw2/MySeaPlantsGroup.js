import * as THREE from 'three';
import {getRandomInt} from './utils.js';
import { MySeaPlant } from './MySeaPlant.js';


class MySeaPlantGroup extends THREE.Group {
    constructor(numbSeaPlants, minSpace,maxScale, minScale, colors, overlap){
        super();
        

        const plant = new MySeaPlant(0.05,1,0.05,null, null,  "L"); //default plant
        const gridSide = Math.ceil(Math.sqrt(numbSeaPlants));
        let plantCount = 0;

        const baseWidth = plant.width ;
        const baseDepth = plant.depth ;

        let baseCellWidth = baseWidth * maxScale + minSpace;
        let baseCellDepth = baseDepth * maxScale + minSpace;

        for (let x = 0; x < gridSide && plantCount < numbSeaPlants; x++) {
            for (let y = 0; y < gridSide && plantCount < numbSeaPlants; y++) {
            const clonePlant = plant.clone();
            const highLODPlant = new MySeaPlant(0.05,1,0.05,null, null,  "H");
            const midLODPlant = new MySeaPlant(0.05,1,0.05,null, null,  "M");
            const lod = new THREE.LOD();

            // Random scale
            const scaleFactor = THREE.MathUtils.lerp(minScale, maxScale, Math.random());
            clonePlant.scale.set(scaleFactor, scaleFactor, scaleFactor);
            highLODPlant.scale.set(scaleFactor, scaleFactor,scaleFactor);
            midLODPlant.scale.set(scaleFactor, scaleFactor,scaleFactor);

            //Random color
            const randomColor = getRandomInt(0,colors.length - 1);
            const color = colors[randomColor];
            clonePlant.traverse(child => {
                if (child.isMesh) {
                    child.material = new THREE.MeshPhongMaterial({ color: color });
                    child.material.needsUpdate = true;
                }
            });
            highLODPlant.traverse(
                child => {
                if (child.isMesh) {
                    child.material = new THREE.MeshPhongMaterial({ color: color });
                    child.material.needsUpdate = true;
                }
            }
            )
            midLODPlant.traverse(
                child => {
                if (child.isMesh) {
                    child.material = new THREE.MeshPhongMaterial({ color: color });
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
            
            // Position Plant
            lod.position.set(
                cellWidth * x,
                0,
                cellDepth * y
            );
            lod.addLevel(clonePlant, 20);
            lod.addLevel(highLODPlant,0);
            lod.addLevel(midLODPlant,10);
            this.add(lod);
            plantCount++;
            }         
        }
    }

    update(delta){
        //traverse the plant group to 
        this.traverse(
             child => {
                //child is a LOD
                if (child instanceof THREE.LOD) {
                    let visibleLevel = child.getObjectForDistance(0);
                    if (visibleLevel) {
                        visibleLevel.update(delta);
                    }
                    visibleLevel = child.getObjectForDistance(10);
                    if (visibleLevel) {
                        visibleLevel.update(delta);
                    }
                }
            }
        );
    }
}

export{ MySeaPlantGroup};