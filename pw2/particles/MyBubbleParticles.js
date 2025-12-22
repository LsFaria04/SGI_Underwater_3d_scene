import * as THREE from "three";

class MyBubbleParticles{
  constructor(sourcePositions = [{ x: 0, z: 0 }], numParticles = 400, texture = null, options = {}) {

    this.bubbleTexture = texture || new THREE.TextureLoader().load("./textures/bubble.png");
    
    this.fullParticles = numParticles;   
    this.lowParticles = Math.floor(numParticles / 4);            
    this.lodDistance = 20;     
    this.currentParticles = this.fullParticles;
    this.lodEnabled = false;          

    this.sourceY  = options.sourceY  ?? 1.5;
    this.surfaceY = options.surfaceY ?? 30;

    this.spawnArea = {
      x: options.spawnAreaX ?? 2,
      z: options.spawnAreaZ ?? 2
    };

    this.buoyancy = 0.002;       // buoyancy is similar to upward acceleration
    this.wobbleStrength = 0.5;   // wobble is similar to horizontal movement

    this.count = 0;
    this.sources = sourcePositions;

    this.data = [];
    this.init();
  }

  init(particleCount = this.currentParticles) {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const bubble = this.createBubble();
      this.data.push(bubble);

      positions[i * 3] = bubble.x;
      positions[i * 3 + 1] = bubble.y;
      positions[i * 3 + 2] = bubble.z;

      colors[i * 3] = bubble.color.r;
      colors[i * 3 + 1] = bubble.color.g;
      colors[i * 3 + 2] = bubble.color.b;

      sizes[i] = bubble.scale;
    }

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    this.geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    this.geometry.setDrawRange(0, this.fullParticles);

    this.material = new THREE.PointsMaterial({
      map: this.bubbleTexture,
      vertexColors: true,
      size: 0.3,
      transparent: true,
      alphaTest: 0.01,
      opacity: 0.6,
      depthWrite: false,
      sizeAttenuation: true
    });

    this.points = new THREE.Points(this.geometry, this.material);
  }

  randomRange(min, max) {
    return min + Math.random() * (max - min);
  }

  createBubble() {
    const source = this.sources[Math.floor(Math.random() * this.sources.length)];

    const x0 = source.x + this.randomRange(-this.spawnArea.x, this.spawnArea.x);
    const z0 = source.z + this.randomRange(-this.spawnArea.z, this.spawnArea.z);

    return {
      x0, z0, // initial position
      x: x0, 
      y: this.sourceY,
      z: z0,
      vy: this.randomRange(0.05, 0.12), //upward speed
      life: 0,
      maxLife: this.randomRange(200, 400),
      wobbleOffset: Math.random() * Math.PI * 2,
      scale: this.randomRange(0.3, 3),
      color: new THREE.Color(0.8, 0.9, 1.0)
    };
  }

  update() {
    const drawCount = this.geometry.drawRange.count;
    const positions = this.geometry.attributes.position.array;
    const colors = this.geometry.attributes.color.array;

    for (let i = 0; i < drawCount; i++) {
      const b = this.data[i];

      // buoyancy
      b.vy += this.buoyancy;
      b.y += b.vy;

      // wobbling
      b.x = b.x0 + Math.sin(this.count + b.wobbleOffset) * this.wobbleStrength;
      b.z = b.z0 + Math.cos(this.count + b.wobbleOffset) * this.wobbleStrength;

      b.life++;

      // respawn when surface or maxLife reached
      if (b.y > this.surfaceY || b.life > b.maxLife) {
        this.data[i] = this.createBubble();
        continue;
      }

      // fade near surface
      const fade = 1 - b.y / this.surfaceY;
      b.color.setRGB(0.8 * fade, 0.9 * fade, 1.0 * fade);

      positions[i * 3] = b.x;
      positions[i * 3 + 1] = b.y;
      positions[i * 3 + 2] = b.z;

      colors[i * 3] = b.color.r;
      colors[i * 3 + 1] = b.color.g;
      colors[i * 3 + 2] = b.color.b;
    }

    this.count += 0.05;

    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.color.needsUpdate = true;
  }

  updateLOD(cameraPosition) {
    const distance = cameraPosition.distanceTo(
      new THREE.Vector3(
        this.sources[0].x,
        this.sourceY,
        this.sources[0].z
      )
    );

    if (distance > this.lodDistance && !this.lodEnabled) {
      this.geometry.setDrawRange(0, this.lowParticles);
      this.lodEnabled = true;
    }

    if (distance <= this.lodDistance && this.lodEnabled) {
      this.geometry.setDrawRange(0, this.fullParticles);
      this.lodEnabled = false;
    }
  }

  getLODStatus() {
    return this.lodEnabled ? "ON" : "OFF";
  }

}

export { MyBubbleParticles };
