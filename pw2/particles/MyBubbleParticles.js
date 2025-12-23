import * as THREE from "three";

/**
 * Bubble particle system with buoyancy and wobble effects.
 * */
class MyBubbleParticles{

  /**
   * 
   * @param {*} sourcePositions Start position of the bubbles
   * @param {*} maxParticles Maximum number of bubbles
   * @param {*} texture Texture of the bubbles
   * @param {*} options Additional options for bubble behavior and appearance
   */
  constructor(sourcePositions = [{ x: 0, z: 0 }], maxParticles = 400, texture = null, options = {}) {

    this.bubbleTexture = texture || new THREE.TextureLoader().load("./textures/bubble.png");
    
    this.maxParticles = maxParticles;   
    this.fullParticles = maxParticles;
    this.lowParticles = Math.floor(maxParticles / 4);            
    this.lodDistance = 20;     
    this.lodEnabled = false;  
    

    this.sourceY  = options.sourceY  ?? 1.5;
    this.surfaceY = options.surfaceY ?? 20;

    this.spawnArea = {
      x: options.spawnAreaX ?? 2,
      z: options.spawnAreaZ ?? 2
    };

    this.spawnRate = options.spawnRate ?? 10; // bubbles per second
    this.spawnAccumulator = Math.random(); 

    this.speedFactor = options.speedFactor ?? 1.0;

    this.buoyancy = 0.002;       // buoyancy is similar to upward acceleration
    this.wobbleStrength = 0.5;   // wobble is similar to horizontal movement

    this.count = 0;
    this.sources = sourcePositions;

    this.data = [];
    this.activeBubbles = 0;
    this.init();
  }

  init() {
    const positions = new Float32Array(this.maxParticles * 3);
    const colors = new Float32Array(this.maxParticles * 3);
    const sizes = new Float32Array(this.maxParticles);

    for (let i = 0; i < this.maxParticles; i++) {
      this.data.push({
        active: false,
        x0: 0, z0: 0,
        x: 0, y: 0, z: 0,
        vy: 0,
        life: 0,
        maxLife: 0,
        wobbleOffset: 0,
        scale: 0,
        color: new THREE.Color(0, 0, 0)
      });

      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;

      colors[i * 3] = 0;
      colors[i * 3 + 1] = 0;
      colors[i * 3 + 2] = 0;

      sizes[i] = 0;
    }

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    this.geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    this.geometry.setDrawRange(0, 0); // start with zero drawn particles

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        pointTexture: { value: this.bubbleTexture }
      },
      vertexShader: `
        attribute float size;
        varying float vAlpha;
        void main() {
          vAlpha = 1.0 - position.y / 20.0; // fade towards top
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (100.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform sampler2D pointTexture;
        varying float vAlpha;
        void main() {
          vec4 texColor = texture2D(pointTexture, gl_PointCoord);
          vec3 bubbleColor = vec3(0.8, 0.9, 1.0);
          gl_FragColor = vec4(bubbleColor, texColor.a * vAlpha * 0.6);
          // soft edges
          float dist = distance(gl_PointCoord, vec2(0.5));
          gl_FragColor.a *= smoothstep(0.5, 0.45, dist);
        }
      `,
      transparent: true,
      depthWrite: false
    });

    this.points = new THREE.Points(this.geometry, this.material);
    this.points.frustumCulled = false;
  }

  /**
   * Generate a random number in range [min, max)
   * @param {*} min Minimum value
   * @param {*} max Maximum value
   * @return Random number in the specified range
   */
  randomRange(min, max) {
    return min + Math.random() * (max - min);
  }

  /**
   * Create a new bubble with randomized properties
   * @return New bubble object
   */
  createBubble() {
    const source = this.sources[Math.floor(Math.random() * this.sources.length)];

    const x0 = source.x + this.randomRange(-this.spawnArea.x, this.spawnArea.x);
    const z0 = source.z + this.randomRange(-this.spawnArea.z, this.spawnArea.z);

    return {
      active: true,
      x0, z0,
      x: x0, 
      y: this.sourceY,
      z: z0,
      vy: this.randomRange(0.05, 0.12) * this.speedFactor,
      life: 0,
      maxLife: this.randomRange(200, 400),
      wobbleOffset: Math.random() * Math.PI * 2,
      scale: this.randomRange(0.3, 3),
      color: new THREE.Color(0.8, 0.9, 1.0)
    };
  }

  /**
   * Spawn a new bubble if there is an inactive slot
   * @return True if a bubble was spawned, false otherwise
   */
  spawnBubble() {
    for (let i = 0; i < this.maxParticles; i++) {
      if (!this.data[i].active) {
        const newBubble = this.createBubble();
        this.data[i] = newBubble;
        this.activeBubbles++;
        
        const currentMax = this.lodEnabled ? this.lowParticles : this.fullParticles;
        const newDrawCount = Math.min(this.activeBubbles, currentMax);
        this.geometry.setDrawRange(0, newDrawCount);
        
        return true;
      }
    }
    return false;
  }

  /**
   * Update bubble positions and states
   * @param {*} deltaTime Time elapsed since last update
   */
  update(deltaTime = 1/60) {
    const positions = this.geometry.attributes.position.array;
    const colors = this.geometry.attributes.color.array;
    const sizes = this.geometry.attributes.size.array;

    this.spawnAccumulator += this.spawnRate * deltaTime;
    while (this.spawnAccumulator >= 1 && this.activeBubbles < this.maxParticles) {
      this.spawnBubble();
      this.spawnAccumulator -= 1;
    }

    for (let i = 0; i < this.maxParticles; i++) {
      const b = this.data[i];
      
      if (!b.active) {
        positions[i * 3] = 0;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = 0;
        sizes[i] = 0;
        continue;
      }

      // buoyancy
      b.vy += this.buoyancy * this.speedFactor;
      b.y += b.vy;

      // wobbling
      b.x = b.x0 + Math.sin(this.count + b.wobbleOffset) * this.wobbleStrength;
      b.z = b.z0 + Math.cos(this.count + b.wobbleOffset) * this.wobbleStrength;

      b.life++;

      // respawn when surface or maxLife reached
      if (b.y > this.surfaceY || b.life > b.maxLife) {
        b.active = false;
        this.activeBubbles--;
        positions[i * 3] = 0;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = 0;
        sizes[i] = 0;
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
      
      sizes[i] = b.scale;
    }

    this.count += 0.05;

    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.color.needsUpdate = true;
    this.geometry.attributes.size.needsUpdate = true;
  }

  /**
   * Update LOD based on camera distance
   * @param {*} cameraPosition Position of the camera
   */
  updateLOD(cameraPosition) {
    const distance = cameraPosition.distanceTo(
      new THREE.Vector3(
        this.sources[0].x,
        this.sourceY,
        this.sources[0].z
      )
    );

    const wasEnabled = this.lodEnabled;

    if (distance > this.lodDistance && !this.lodEnabled) {
      this.lodEnabled = true;
    }

    if (distance <= this.lodDistance && this.lodEnabled) {
      this.lodEnabled = false;
    }

    if (wasEnabled !== this.lodEnabled) {
      const maxDraw = this.lodEnabled ? this.lowParticles : this.fullParticles;
      const newDrawCount = Math.min(this.activeBubbles, maxDraw);
      this.geometry.setDrawRange(0, newDrawCount);
    }
  }

  /**
   * Get current LOD status
   * @return "ON" if LOD is enabled, "OFF" otherwise
   */
  getLODStatus() {
    return this.lodEnabled ? "ON" : "OFF";
  }

  /**
   * Get current active bubble count
   * @return Number of active bubbles
   */
  getActiveBubbleCount() {
    return this.activeBubbles;
  }

}

export { MyBubbleParticles }; 