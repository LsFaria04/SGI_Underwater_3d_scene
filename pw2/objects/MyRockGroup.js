import * as THREE from 'three';
import { floorHeightPosition, getRandomInt } from '../utils.js';
import { MyRock } from './MyRock.js';

/**
 * This class represents a group of several rocks
 */
class MyRockGroup extends THREE.Group {

    /**
     * 
     * @param {*} numbRocks Number of rocks in the group
     * @param {*} x First x position
     * @param {*} z First z position
     * @param {*} minSpace Minimum space between rocks
     * @param {*} maxScale Maximum scale applied to arock
     * @param {*} minScale Minimum scale applied to a rock
     * @param {*} colors Colors that can be applied to a rocks
     * @param {*} overlap If the rocks can overlap
     * @param {*} textures Set of textures that can be applied to a rock
     */
    constructor(
        numbRocks,
        x, z,
        minSpace,
        maxScale,
        minScale,
        colors,
        overlap,
        textures
    ) {
        super();

        this.position.set(x, 0, z);
        this.rocks = [];

        const gridSide = Math.ceil(Math.sqrt(numbRocks));
        let rockCount = 0;

        const baseWidth = 1;
        const baseDepth = 1;

        const baseCellWidth = baseWidth * maxScale + minSpace;
        const baseCellDepth = baseDepth * maxScale + minSpace;

        for (let gx = 0; gx < gridSide && rockCount < numbRocks; gx++) {
            for (let gy = 0; gy < gridSide && rockCount < numbRocks; gy++) {

                // Create a single LOD rock (the class handles L/M/H internally)
                const rock = new MyRock(1, null, null);

                // Random scale
                const scaleFactor = THREE.MathUtils.lerp(minScale, maxScale, Math.random());
                rock.scale.set(scaleFactor, scaleFactor, scaleFactor);

                const color = colors[getRandomInt(0, colors.length - 1)];
                const texture = textures[getRandomInt(0, textures.length - 1)];

                // Configure texture tiling
                for (const key of ["albedo", "roughness", "metallic", "normal", "ao"]) {
                    const tex = texture[key];
                    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
                    tex.repeat.set(4, 4);
                }

                rock.traverse(child => {
                    if (child.isMesh) {

                        // For AO
                        if (child.geometry.attributes.uv) {
                            child.geometry.setAttribute(
                                'uv2',
                                new THREE.BufferAttribute(child.geometry.attributes.uv.array, 2)
                            );
                        }

                        child.material = new THREE.MeshStandardMaterial({
                            color: color,
                            map: texture.albedo,
                            normalMap: texture.normal,
                            roughnessMap: texture.roughness,
                            metalnessMap: texture.metallic,
                            aoMap: texture.ao
                        });

                        child.material.needsUpdate = true;
                    }
                });

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

                const worldX = this.position.x + cellWidth * gx;
                const worldZ = this.position.z + cellDepth * gy;
                const worldY = floorHeightPosition(worldX, worldZ);

                rock.position.set(cellWidth * gx, worldY, cellDepth * gy);

                this.add(rock);
                this.rocks.push(rock);

                rockCount++;
            }
        }
    }
}

export { MyRockGroup };