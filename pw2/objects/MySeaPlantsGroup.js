import * as THREE from 'three';
import { floorHeightPosition, getRandomInt } from '../utils.js';
import { MySeaPlant } from './MySeaPlant.js';

/**
 * Group of sea plants arranged in a grid with random spacing, scale, and color.
 */
class MySeaPlantGroup extends THREE.Group {

    /**
     * 
     * @param {*} numbSeaPlants Number of sea plants in the group
     * @param {*} x Position X of the group
     * @param {*} z Position Z of the group
     * @param {*} minSpace Minimum spacing between sea plants
     * @param {*} maxScale Maximum scale of sea plants
     * @param {*} minScale Minimum scale of sea plants
     * @param {*} colors Array of colors for the sea plants
     * @param {*} overlap If true, allows overlapping of sea plants by randomizing spacing
     */
    constructor(
        numbSeaPlants,
        x, z,
        minSpace,
        maxScale,
        minScale,
        colors,
        overlap
    ) {
        super();

        this.position.set(x, 0, z);

        const gridSide = Math.ceil(Math.sqrt(numbSeaPlants));
        let plantCount = 0;

        const baseWidth = 0.05;
        const baseDepth = 0.05;

        const baseCellWidth = baseWidth * maxScale + minSpace;
        const baseCellDepth = baseDepth * maxScale + minSpace;

        this.plants = [];

        for (let gx = 0; gx < gridSide && plantCount < numbSeaPlants; gx++) {
            for (let gy = 0; gy < gridSide && plantCount < numbSeaPlants; gy++) {

                // Pick random color
                const colorIndex = getRandomInt(0, colors.length - 1);
                const color = colors[colorIndex];

                // Create one plant; LOD is handled internally by MySeaPlant
                const plant = new MySeaPlant(0.05, 1, 0.05, color);

                // Random scale
                const scaleFactor = THREE.MathUtils.lerp(minScale, maxScale, Math.random());
                plant.scale.set(scaleFactor, scaleFactor, scaleFactor);

                // Cell spacing
                let cellWidth = baseCellWidth;
                let cellDepth = baseCellDepth;

                if (overlap) {
                    cellWidth = THREE.MathUtils.lerp(
                        baseWidth * minScale + minSpace,
                        baseCellWidth,
                        Math.random()
                    );
                    cellDepth = THREE.MathUtils.lerp(
                        baseDepth * minScale + minSpace,
                        baseCellDepth,
                        Math.random()
                    );
                }

                // World/sample position for height
                const worldX = this.position.x + cellWidth * gx;
                const worldZ = this.position.z + cellDepth * gy;
                const worldY = floorHeightPosition(worldX, worldZ);

                // Local position inside the group
                plant.position.set(cellWidth * gx, worldY, cellDepth * gy);


                this.add(plant);
                this.plants.push(plant)
                plantCount++;
            }
        }
    }

    /**
     * Update all sea plants in the group
     * @param {*} delta Time elapsed since last update
     */
    update(delta) {
        // Each child is a MySeaPlant (which is responsible for its own LOD/update)
        this.children.forEach(child => {
            if (child instanceof MySeaPlant) {
                child.updateAnim(delta);
            }
        });
    }
}

export { MySeaPlantGroup };
