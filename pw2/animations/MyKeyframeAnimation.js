import * as THREE from 'three';

class MyKeyFrameAnimation {
    constructor(object, type, radius, segments, duration, rotationOffset = Math.PI / 2) {
        this.type = type;
        this.radius = radius;
        this.object = object;
        this.segments = segments;
        this.duration = duration;

        // OPTIONAL: Adjust this if your fish is still sideways.
        // Common values: 0, Math.PI, Math.PI / 2, -Math.PI / 2
        this.rotationOffset = rotationOffset; 

        // Store a persistent vector to avoid garbage collection in the loop
        this.previousPos = object.position.clone();
        this.dummyVector = new THREE.Vector3();

        switch (type) {
            case "random":
                this.initRandom();
                break;
            case "circle":
                this.initCircle();
                break
            default:
                this.initCircle();
        }
    }

    initCircle() {
        const times = [];
        const values = [];

        for (let i = 0; i <= this.segments; i++) {
            const t = (i / this.segments) * this.duration;
            const angle = (t / this.duration) * Math.PI * 2;
            
            // Note: Standard circle math
            const x = this.object.position.x + Math.cos(angle) * this.radius;
            const z = this.object.position.z + Math.sin(angle) * this.radius;

            times.push(t);
            values.push(x, this.object.position.y, z);
        }

        const positionTrack = new THREE.VectorKeyframeTrack(
            '.position', 
            times, 
            values, 
            THREE.InterpolateSmooth // Ensure smooth movement
        );
        
        this.startMixer(positionTrack, 'swim');
    }

    initRandom() {
        const controlPoints = [];
        // Generate random points
        for (let i = 0; i < 7; i++) {
            const angle = (i / 7) * Math.PI * 2;
            const r = this.radius * (0.7 + Math.random() * 0.6); 
            const x = this.object.position.x + Math.cos(angle) * r;
            const z = this.object.position.z + Math.sin(angle) * r;
            const y = this.object.position.y + (Math.random() - 0.5) * 1.5;
            controlPoints.push(new THREE.Vector3(x, y, z));
        }

        // Close the loop for smooth repetition
        const curve = new THREE.CatmullRomCurve3(controlPoints, true); 

        const times = [];
        const values = [];

        for (let i = 0; i <= this.segments; i++) {
            const t = (i / this.segments) * this.duration;
            const point = curve.getPoint(i / this.segments);
            times.push(t);
            values.push(point.x, point.y, point.z);
        }

        // FIX: Added THREE.InterpolateSmooth here
        const track = new THREE.VectorKeyframeTrack(
            '.position', 
            times, 
            values, 
            THREE.InterpolateSmooth 
        );

        this.startMixer(track, 'loopSwim');
    }

    startMixer(track, name) {
        this.clip = new THREE.AnimationClip(name, -1, [track]);
        this.mixer = new THREE.AnimationMixer(this.object);
        this.action = this.mixer.clipAction(this.clip);
        this.action.play();
    }

    update(delta) {
        if (!this.mixer) return;

        // 1. Snapshot where we are BEFORE the update
        const posBeforeUpdate = this.object.position.clone();

        // 2. Move the object
        this.mixer.update(delta);

        // 3. Compare New Position vs Old Position to get Velocity Vector
        this.dummyVector.subVectors(this.object.position, posBeforeUpdate);

        // 4. Calculate Rotation
        // Only rotate if we actually moved to avoid flickering
        if (this.dummyVector.lengthSq() > 0.000001) {
            const angle = Math.atan2(this.dummyVector.x, this.dummyVector.z);
            
            // Apply the angle plus the offset to fix "pointing to center"
            this.object.rotation.y = angle + this.rotationOffset;
        }
    }
}

export { MyKeyFrameAnimation }