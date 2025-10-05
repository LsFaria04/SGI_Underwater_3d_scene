import * as THREE from 'three';
import { MyPencil } from './MyPencil.js';

/**
 * This class represents a pencil holder composed of a cylindrical body and an open top
 */

class MyPencilHolder extends THREE.Object3D {
    /**
     * 
     * @param {number} radius Pencil holder radius
     * @param {number} height Pencil holder height
     * @param {string|number} color Pencil holder color (hex or string)
     */
    constructor(radius = 0.1, height = 0.2, color = "#00FF00", wallThickness = 0.02) {
        super();

        // Holder body (outer + inner to simulate thickness)
        const outerRadius = radius;
        const innerRadius = Math.max(0.001, radius - wallThickness);

        const bodyMaterial = new THREE.MeshPhongMaterial({ color, side: THREE.DoubleSide});

        // Outer shell
        const outerGeometry = new THREE.CylinderGeometry(outerRadius, outerRadius, height, 32, 1, true);
        const outer = new THREE.Mesh(outerGeometry, bodyMaterial);
        outer.position.y = height / 2;
        this.add(outer);

        // Inner cavity (slightly shorter so bottom thickness remains visible)
        const innerGeometry = new THREE.CylinderGeometry(innerRadius, innerRadius, Math.max(0.001, height - wallThickness * 0.8), 32, 1, true);
        const inner = new THREE.Mesh(innerGeometry, bodyMaterial);
        inner.position.y = (Math.max(0.001, height - wallThickness * 0.8)) / 2 + wallThickness * 0.4; // leave small bottom thickness
        // flip normals visually by using DoubleSide material (no CSG to subtract)
        this.add(inner);

        // Bottom ring: create a thin disk for the outer bottom and another smaller disk above it to simulate inner empty portion
        const bottomThickness = Math.min(0.02, wallThickness);
        const bottomOuterGeom = new THREE.CylinderGeometry(outerRadius, outerRadius, bottomThickness, 32);
        const bottomOuter = new THREE.Mesh(bottomOuterGeom, bodyMaterial);
        bottomOuter.position.y = bottomThickness / 2; // sits on the floor
        this.add(bottomOuter);

        const bottomInnerGeom = new THREE.CylinderGeometry(innerRadius, innerRadius, bottomThickness + 0.001, 32);
        const bottomInner = new THREE.Mesh(bottomInnerGeom, bodyMaterial);
        bottomInner.position.y = bottomThickness / 2 + 0.001; // slightly above to simulate hole
        bottomInner.material = new THREE.MeshPhongMaterial({ color: 0x000000, side: THREE.DoubleSide, opacity: 0, transparent: true });
        // keep it invisible (used only for visual separation if desired)
        // If you want an actual hole, replace with CSG operation from a library like three-csg.js
        this.add(bottomInner);

        // Top rim: add a rounded torus between outer and inner to smoothly fill the gap
        const rimTube = (outerRadius - innerRadius) / 2;
        const rimRadius = (outerRadius + innerRadius) / 2;
        if (rimTube > 0.0005) {
            const rimGeom = new THREE.TorusGeometry(rimRadius, rimTube, 16, 64);
            const rim = new THREE.Mesh(rimGeom, bodyMaterial);
            // rotate so the torus lies horizontally around the cup's opening
            rim.rotation.x = Math.PI / 2;
            // position slightly below the top to avoid z-fighting
            rim.position.y = height - rimTube * 0.6;
            this.add(rim);
        }

    // Fill with pencils inside
        const pencilCount = 5;
        for (let i = 0; i < pencilCount; i++) {
            const pencil = new MyPencil(0.25, 0.02, i % 2 == 0 ? "#FFFF00" : "#FF0000");
            const angle = (i / pencilCount) * Math.PI * 2;
            const pencilRadius = radius * 0.6; // position pencils slightly inside the holder
            pencil.rotateX(0.10);
            pencil.position.set(Math.cos(angle) * pencilRadius, height - 0.2, Math.sin(angle) * pencilRadius);
            this.add(pencil);
        }
    }
}

export { MyPencilHolder };
