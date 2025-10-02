import * as THREE from 'three';

class MyDiamond extends THREE.Object3D {
    /**
     * Box with a diamond (octahedron) on top
     * @param {number} boxSize size of the cube box
     * @param {number} diamondScale scale factor for the diamond
     * @param {string|number} boxColor box color (default black)
     * @param {string|number} diamondColor diamond color (default cyan)
     */
    constructor(boxSize = 0.5, diamondScale = 0.6, boxColor = 0x000000, diamondColor = 0x00FFFF) {
        super();

        const boxGeo = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
        const boxMat = new THREE.MeshPhongMaterial({ color: boxColor, shininess: 30 });
        const box = new THREE.Mesh(boxGeo, boxMat);
        box.position.y = boxSize / 2;
        this.add(box);

        // Diamond: using a OctahedronGeometry to simulate a cut diamond
        const diamondGeo = new THREE.OctahedronGeometry(boxSize * diamondScale);
        const diamondMat = new THREE.MeshPhongMaterial({ color: diamondColor, emissive: 0x112233, shininess: 100, flatShading: false });
        const diamond = new THREE.Mesh(diamondGeo, diamondMat);

        // place diamond on top of the box
        diamond.position.y = boxSize + (boxSize * diamondScale) * 0.6;
        this.add(diamond);

        // small pedestal bellow the diamond
        const pedestalGeo = new THREE.CylinderGeometry(boxSize * 0.15, boxSize * 0.15, boxSize * 0.05, 16);
        const pedestalMat = new THREE.MeshPhongMaterial({ color: 0x808080 });
        const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
        pedestal.position.y = boxSize + boxSize * 0.025;
        this.add(pedestal);

        // Glass dome covering the diamond
        
        const domeRadius = boxSize * (diamondScale + 0.3);
        const domeGeo = new THREE.SphereGeometry(domeRadius, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
        
        const domeMat = new THREE.MeshPhysicalMaterial({
            color: 0xFFFFFF,
            metalness: 0,
            roughness: 0.05,
            transparent: true,
            opacity: 0.35,
            transmission: 0.9,
            ior: 1.45,
            thickness: 0.02,
            reflectivity: 0.5
        });
        const dome = new THREE.Mesh(domeGeo, domeMat);
        dome.position.y = boxSize;
        this.add(dome);
    }
}

export { MyDiamond };
