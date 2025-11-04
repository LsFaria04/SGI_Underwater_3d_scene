import * as THREE from 'three';

class MyKeyFrameAnimation  {
    constructor(object, type, radius, segments, duration) {
        this.type = type;
        this.radius = radius;
        this.object = object;
        this.segments = segments;
        this.duration = duration;

        switch(type){
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

    initCircle(){
        const times = [];
        const values = [];

        for (let i = 0; i <= this.segments; i++) {
            const t = (i / this.segments) * this.duration;
            const angle = (t / this.duration) * Math.PI * 2;
            const x = this.object.position.x + Math.cos(angle) * this.radius;
            const z =this.object.position.z + Math.sin(angle) * this.radius;

            times.push(t);
            values.push(x, this.object.position.y, z);
        }
        const positionTrack = new THREE.VectorKeyframeTrack('.position', times, values, THREE.InterpolateSmooth);
        this.mixer = new THREE.AnimationMixer(this.object);
        this.clip = new THREE.AnimationClip('swim', -1, [positionTrack]);
        this.action = this.mixer.clipAction(this.clip);
        this.action.play();
    }
    initRandom(){
        const controlPoints = [];
        for (let i = 0; i < 7; i++) {
            const angle = (i / 7) * Math.PI * 2;
            const r = this.radius * (0.7 + Math.random() * 0.6); // randomize the radius
            const x = this.object.position.x + Math.cos(angle) * r;
            const z = this.object.position.z + Math.sin(angle) * r;
            const y = this.object.position.y + (Math.random() - 0.5) * 1.5;
            controlPoints.push(new THREE.Vector3(x, y, z));
        }

        //allow to create smooth curves
        const curve = new THREE.CatmullRomCurve3(controlPoints, true);

        const times = [];
        const values = [];

        for (let i = 0; i <= this.segments; i++) {
            const t = (i / this.segments) * this.duration;
            const point = curve.getPoint(i / this.segments);
            times.push(t);
            values.push(point.x, point.y, point.z);
        }

        const track = new THREE.VectorKeyframeTrack('.position', times, values);
        this.clip = new THREE.AnimationClip('loopSwim', -1, [track]);
        this.mixer = new THREE.AnimationMixer(this.object);
        this.action = this.mixer.clipAction(this.clip);
        this.action.play();
    }

    update(delta){

        if (!this.previousPos) this.previousPos = this.object.position;
        const deltaPos = this.object.position.sub(this.previousPos);
        this.previousPos = this.object.position;
        this.mixer.update(delta);

        //calculate the delta of positions to control the body rotation 
        this.object.rotation.y = Math.atan2(deltaPos.x, deltaPos.z);
        
        
    }
}

export {MyKeyFrameAnimation}