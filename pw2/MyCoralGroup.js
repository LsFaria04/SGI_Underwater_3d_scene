import * as THREE from 'three';
import { getRandomInt } from './utils.js';
import { MyCoral } from './MyCoral.js';

class MyCoralGroup extends THREE.Object3D {
  constructor(numbCorals, minSpace, maxScale, minScale, colors) {
    super();

    const gridSide = Math.ceil(Math.sqrt(numbCorals));
    const coralGroup = new THREE.Group();
    let coralCount = 0;


    // Define fixed cell size to avoid overlap (might change later for better effect)
    const cellWidth = maxScale * 0.1 + minSpace;

    for (let x = 0; x < gridSide && coralCount < numbCorals; x++) {
      for (let z = 0; z < gridSide && coralCount < numbCorals; z++) {
        const coral = new MyCoral(1,1);

        // Random scale
        const scaleFactor = THREE.MathUtils.lerp(minScale, maxScale, Math.random());
        coral.scale.set(scaleFactor * 0.1, 1, scaleFactor * 0.1);

        // Random color
        const randomColor = getRandomInt(0, colors.length - 1);
        const color = colors[randomColor];

        coral.traverse(child => {
          if (child.isMesh) {
            child.material = new THREE.MeshPhongMaterial({ color });
            child.material.needsUpdate = true;
          }
        });

        // Position coral in grid
        const posX = x * cellWidth;
        const posZ = z * cellWidth;
        coral.position.set(posX, 0, posZ);

        coralGroup.add(coral);
        coralCount++;
      }
    }


    this.add(coralGroup);
  }
}

export { MyCoralGroup };
