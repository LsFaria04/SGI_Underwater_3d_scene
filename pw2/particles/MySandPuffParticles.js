import * as THREE from 'three';
import { floorHeightPosition } from '../utils.js';

class SandPuffSystem {
  constructor(scene, maxParticles = 5000, texture) {
    this.maxParticles = maxParticles;

    this.positions = new Float32Array(maxParticles * 3);
    this.velocities = new Array(maxParticles);
    this.lifetimes = new Float32Array(maxParticles);
    this.alive = new Array(maxParticles).fill(false);


    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(this.positions, 3)
    );

    this.material = new THREE.PointsMaterial({
        size: 0.01,
        color: "#2f291f",
        transparent: true,
        opacity: 1,
        depthWrite: false,
        depthTest: true,
        blending: THREE.NormalBlending,
    });

    this.points = new THREE.Points(this.geometry, this.material);
    scene.add(this.points);

    this.gravity = new THREE.Vector3(0, -1, 0);

    
  }

  spawn(origin, normal = new THREE.Vector3(0, 1, 0), count = 80) {
    for (let i = 0; i < this.maxParticles && count > 0; i++) {
      if (!this.alive[i]) {
        this.alive[i] = true;

        // Position
        this.positions[i * 3] = origin.x;
        this.positions[i * 3 + 1] = origin.y + 0.5;
        this.positions[i * 3 + 2] = origin.z;


        // Velocity
        const dir = this.randomHemisphereVector(normal);
        dir.multiplyScalar(0.5 + Math.random());
        this.velocities[i] = dir;

        // Lifetime
        this.lifetimes[i] = 3 + Math.random() * 0.6;

        count--;
      }
    }
  }

    randomHemisphereVector(normal) {
        const dir = new THREE.Vector3(
            normal.x + Math.random() - 1,
            normal.y + Math.random() * 2, 
            normal.z + Math.random() - 1
        ).normalize();

        //Avoid particles starting going down in the beggining
        if (dir.dot(normal) < 0) dir.negate();
        if(dir.y < 0) dir.y = -dir.y;


        return dir;
    }

  update(dt) {
    for (let i = 0; i < this.maxParticles; i++) {
      if (!this.alive[i]) continue;

      this.lifetimes[i] -= dt;
      if (this.lifetimes[i] <= 0) {
        this.alive[i] = false;
        this.positions[i * 3 + 1] = -9999; // hide
        continue;
      }

      // Physics
      this.velocities[i].addScaledVector(this.gravity, dt);

      this.positions[i * 3] += this.velocities[i].x * dt;
      this.positions[i * 3 + 1] += this.velocities[i].y * dt;
      this.positions[i * 3 + 2] += this.velocities[i].z * dt;

      //Check if the particle is already in the seabed. Hide it if that is the case
      const floorHeight = floorHeightPosition(this.positions[i * 3], this.positions[i * 3 + 2]);
      if(this.positions[i * 3 + 1] <= floorHeight){
        this.alive[i] = false;
        this.positions[i * 3 + 1] = -9999; // hide
        continue;
      }

    }

    this.geometry.attributes.position.needsUpdate = true;
  }
}

export{SandPuffSystem}