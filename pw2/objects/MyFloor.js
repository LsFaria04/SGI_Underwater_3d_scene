import * as THREE from 'three';
import { floorHeightPosition } from '../utils.js';
/**
 * This class represents the sea floor
 */
class MyFloor extends THREE.Mesh {
    /**
     * 
     * @param {*} size Floor size
     * @param {*} segments Floor segments
     */
    constructor(size = 50, segments = 128, texture) {
        const geometry = new THREE.PlaneGeometry(size, size, segments, segments);

        const positions = geometry.attributes.position;
        
        
        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const y = positions.getY(i);
            const height = floorHeightPosition(x, y); 
            positions.setZ(i, height);
        }
        positions.needsUpdate = true;


        texture.albedo.wrapS = THREE.MirroredRepeatWrapping;
        texture.albedo.wrapT = THREE.MirroredRepeatWrapping;
        texture.albedo.repeat.set(4, 4);
        texture.roughness.wrapS = THREE.MirroredRepeatWrapping;
        texture.roughness.wrapT = THREE.MirroredRepeatWrapping;
        texture.roughness.repeat.set(4, 4);
        texture.metallic.wrapS = THREE.MirroredRepeatWrapping;
        texture.metallic.wrapT = THREE.MirroredRepeatWrapping;
        texture.metallic.repeat.set(4, 4);
        texture.normal.wrapS = THREE.MirroredRepeatWrapping;
        texture.normal.wrapT = THREE.MirroredRepeatWrapping;
        texture.normal.repeat.set(4, 4);
        texture.ao.wrapS = THREE.MirroredRepeatWrapping;
        texture.ao.wrapT = THREE.MirroredRepeatWrapping;
        texture.ao.repeat.set(4, 4);
        texture.displacement.wrapS = THREE.MirroredRepeatWrapping;
        texture.displacement.wrapT = THREE.MirroredRepeatWrapping;
        texture.displacement.repeat.set(4, 4);

        geometry.setAttribute('uv2', new THREE.BufferAttribute(geometry.attributes.uv.array, 2));
                        
        const material = new THREE.MeshStandardMaterial({
            color: "#C2B280",   // sand color
            map: texture.albedo,
            normalMap: texture.normal,
            roughnessMap: texture.roughness,
            metalnessMap: texture.metallic,
            aoMap: texture.ao,
            displacementMap: texture.displacement,
            displacementScale: 1
        });

        super(geometry, material);
        this.rotation.x = -Math.PI / 2;
        this.position.y = -0.5
        this.receiveShadow = true;
    }
}

export { MyFloor };
