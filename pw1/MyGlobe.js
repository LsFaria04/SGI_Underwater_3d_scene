import * as THREE from 'three';

/**
 * This class represents a globe with a base, stand, and sphere
 */
class MyGlobe extends THREE.Object3D {
    /**
     * @param {number} radius Globe radius
     * @param {number} standHeight Height of the vertical stand
     * @param {number} baseRadius Radius of the base
     * @param {number} baseHeight Height of the base
     * @param {string|number} globeColor Color of the globe
     * @param {string|number} standColor Color of the stand
     */
    constructor(
        radius = 0.5,
        standHeight = 0.3,
        baseRadius = 0.25,
        baseHeight = 0.1,
        globeColor = 0x1E90FF, 
        standColor = 0x2e1809 
    ) {
        super();

        // Base
        const baseGeom = new THREE.CylinderGeometry(baseRadius, baseRadius, baseHeight, 32);
        const baseMat = new THREE.MeshPhongMaterial({ color: standColor });
        const base = new THREE.Mesh(baseGeom, baseMat);
        base.position.y = baseHeight / 2;
        this.add(base);

        // Stand
        const standGeom = new THREE.CylinderGeometry(0.05, 0.05, standHeight, 16);
        const stand = new THREE.Mesh(standGeom, baseMat);
        stand.position.y = baseHeight + standHeight / 2;
        this.add(stand);

        // Globe
        const globeGeom = new THREE.SphereGeometry(radius, 32, 32);  

        const textureLoader = new THREE.TextureLoader();
        const earthTexture = textureLoader.load('./textures/earth.jpg');

        const globeMat = new THREE.MeshPhongMaterial({
            map: earthTexture,   
            specular: 0x333333,  
            shininess: 25        
        });

        const globe = new THREE.Mesh(globeGeom, globeMat);
        globe.position.y = baseHeight + standHeight + radius;
        this.add(globe);

        // Ring
        const arcRadius = radius * 1.1; 
        const tubeRadius = 0.03;          
        const arcGeom = new THREE.TorusGeometry(
            arcRadius, 
            tubeRadius, 
            16, 
            100, 
            Math.PI
        );
        const arc = new THREE.Mesh(arcGeom, baseMat);
        arc.rotation.z = Math.PI / 2; 
        arc.position.y = baseHeight + standHeight + radius;
        this.add(arc);

        // caps at the end of the ring (so that it is now hollow)
        const capGeom = new THREE.SphereGeometry(tubeRadius, 16, 16);
        const cap1 = new THREE.Mesh(capGeom, baseMat);
        const cap2 = new THREE.Mesh(capGeom, baseMat);

        cap1.position.set(arcRadius, 0, 0);
        cap2.position.set(-arcRadius, 0, 0);

        arc.add(cap1);
        arc.add(cap2);

    }
}

export { MyGlobe };
