import * as THREE from 'three';
import {floorHeightPosition, getRandomInt} from '../utils.js';
import { MySeaPlant } from './MySeaPlant.js';


class MySeaPlantGroup extends THREE.Group {
    constructor(numbSeaPlants,x, z, minSpace,maxScale, minScale, colors, overlap){
        super();
        
        this.position.set(x, 0, z);

        //default plant
        const gridSide = Math.ceil(Math.sqrt(numbSeaPlants));
        let plantCount = 0;

        const baseWidth = 0.05 ;
        const baseDepth = 0.05 ;

        let baseCellWidth = baseWidth * maxScale + minSpace;
        let baseCellDepth = baseDepth * maxScale + minSpace;

        for (let x = 0; x < gridSide && plantCount < numbSeaPlants; x++) {
            for (let y = 0; y < gridSide && plantCount < numbSeaPlants; y++) {
            const plant = new MySeaPlant(0.05,1,0.05,null, "L");
            const highLODPlant = new MySeaPlant(0.05,1,0.05,null, "H");
            const midLODPlant = new MySeaPlant(0.05,1,0.05,null, "M");
            const lod = new THREE.LOD();

            // Random scale
            const scaleFactor = THREE.MathUtils.lerp(minScale, maxScale, Math.random());
            plant.scale.set(scaleFactor, scaleFactor, scaleFactor);
            highLODPlant.scale.set(scaleFactor, scaleFactor,scaleFactor);
            midLODPlant.scale.set(scaleFactor, scaleFactor,scaleFactor);

            //Random color
            const randomColor = getRandomInt(0,colors.length - 1);
            const color = colors[randomColor];
            plant.traverse(child => {
                if (child instanceof MySeaPlant) {
                    child.updateColor(color);
                }
            });
            highLODPlant.traverse(
                child => {
                if (child instanceof MySeaPlant) {
                    child.updateColor(color);
                }
            }
            )
            midLODPlant.traverse(
                child => {
                if (child instanceof MySeaPlant) {
                    child.updateColor(color);
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

            lod.addLevel(plant, 20);
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