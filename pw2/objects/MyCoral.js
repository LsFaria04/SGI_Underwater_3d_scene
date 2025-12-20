import * as THREE from 'three';
import { generateRandom } from '../utils.js';
import { perlinNoiseGLSL } from '../shaders/PerlinNoiseGLSL.js';

/**
 * This class creates a coral
 */
export class MyCoral {
    constructor(texture) {
        this.texture = texture;
        this.helpers = [];
        this.coralPresets = {
        fanCoral: {
            rules: {
            'X': [
                { prob: 0.55, rule: 'F&[+X]F[-X]^X' },
                { prob: 0.25, rule: 'F[+X][-X]FX' },
                { prob: 0.15, rule: 'F&[+X]X' },
                { prob: 0.05, rule: 'F' }
            ],
            'F': [
                { prob: 0.90, rule: 'F' },
                { prob: 0.10, rule: 'F[+F][-F]' }
            ],
            
            },
            angle: 30,
            variableAngle: 20,
            lengthFactor: 0.8
        },
        branchingCoral: {
            rules: {
            'X': [
                { prob: 0.3, rule: 'F[+X][&X][-X][^X]' },
                 { prob: 0.7, rule: 'F[+X][-X]^X' }
            ],
            'F': [
                { prob: 1.0, rule: 'F' }
            ]
            },
            angle: 35,
            variableAngle: 10,
            lengthFactor: 1
        },
        };
    }

    chooseNextRule(options) {
        //Sum the weights (probabilities) of all options.
        const total = options.reduce((sum, o) => sum + o.prob, 0);

        //Number between 0 and `total`
        let randomValue = Math.random() * total;

        //The first option that makes `r <= 0` is the winner.
        for (const opt of options) {
            randomValue -= opt.prob;
            if (randomValue <= 0)
                return opt.rule;
        }

        //default: return the last option.
        return options[options.length - 1].rule;
    }
    createObject(complexity) {
        const defaultCoral = this.coralPresets.fanCoral;
        const coral = this.generateCoralMesh(defaultCoral, complexity);
        
        // Position is already set in generateCoralMesh on the LOD
        return coral;
    }

    generateCoralMesh(coralType, complexity, radius = 0.05) {
        const iterations = complexity;
        const baseAngle = coralType.angle * THREE.MathUtils.DEG2RAD;
        const variableAngle = coralType.variableAngle * THREE.MathUtils.DEG2RAD;

        // --- Stochastic L-System Rules ---

        const axiom = 'X';
        const rules = coralType.rules;

        let currentString = axiom;
        for (let i = 0; i < iterations; i++) {
            let nextString = '';
            for (const char of currentString) {
                if (rules[char]) {
                    nextString += this.chooseNextRule(rules[char]);
                } else {
                    nextString += char;
                }
            }
            currentString = nextString;
        }


        // --- Turtle interpretation ---
        const stack = [];
        let turtle = {
            position: new THREE.Vector3(0, 0, 0),
            quaternion: new THREE.Quaternion(),
        };


        let branchLength = coralType.lengthFactor * 0.7;
        const lengthFactor = coralType.lengthFactor;
        const branchMatrices = [];
        const leafMatrices = [];

        const axisX = new THREE.Vector3(1, 0, 0);
        const axisY = new THREE.Vector3(0, 1, 0);
        const axisZ = new THREE.Vector3(0, 0, 1);
        const q = new THREE.Quaternion();

        const randomAngle = (base) => base + (Math.random() * 2 - 1) * variableAngle;

        for (const char of currentString) {
            switch (char) {
                case 'F': {
                    const startPosition = turtle.position.clone();
                    const forward = new THREE.Vector3(0, 1, 0)
                        .applyQuaternion(turtle.quaternion)
                        .multiplyScalar(branchLength);
                    turtle.position.add(forward);

                    const instanceMatrix = new THREE.Matrix4();
                    const orientation = new THREE.Quaternion().setFromUnitVectors(axisY, forward.clone().normalize());
                    const scale = new THREE.Vector3(1, branchLength, 1);
                    instanceMatrix.compose(startPosition, orientation, scale);
                    branchMatrices.push(instanceMatrix);
                    break;
                }
                case 'X': {

                    if (coralType == this.coralPresets.branchingCoral) break;

                    const leafMatrix = new THREE.Matrix4();
                    leafMatrix.compose(turtle.position, new THREE.Quaternion(), new THREE.Vector3(1, 1, 1));
                    leafMatrices.push(leafMatrix);
                    break;
                }
                case '+':
                    turtle.quaternion.multiply(q.setFromAxisAngle(axisZ, randomAngle(baseAngle)));
                    break;
                case '-':
                    turtle.quaternion.multiply(q.setFromAxisAngle(axisZ, -randomAngle(baseAngle)));
                    break;
                case '&':
                    turtle.quaternion.multiply(q.setFromAxisAngle(axisX, randomAngle(baseAngle)));
                    break;
                case '^':
                    turtle.quaternion.multiply(q.setFromAxisAngle(axisX, -randomAngle(baseAngle)));
                    break;
                case '[':
                    stack.push({
                        position: turtle.position.clone(),
                        quaternion: turtle.quaternion.clone(),
                        length: branchLength
                    });
                    branchLength *= lengthFactor;
                    break;
                case ']': {
                    const state = stack.pop();
                    if (!state) break;
                    turtle.position = state.position;
                    turtle.quaternion = state.quaternion;
                    branchLength = state.length;
                    break;
                }
                default:
                    break;
            }
        }

        const LOD = new THREE.LOD();

        const group = new THREE.Group();

        // Set color based on coral type
        let coralColor;
        if (coralType === this.coralPresets.branchingCoral) {
            coralColor = '#ad0065';
        } else {
            coralColor = '#ff9100';
        }
        this.colorZ = coralColor;

        const branchGeo = new THREE.CylinderGeometry(radius, radius, 1, 8);
        branchGeo.computeBoundsTree();
        branchGeo.translate(0, 0.5, 0);
        
        // Create uniforms object 
        const coralUniforms = {
            uTime: { value: 0.0 }
        };
        
        const branchMat = new THREE.MeshStandardMaterial({
            color: coralColor, 
            map: this.texture.albedo,
            normalMap: this.texture.normal,
            roughnessMap: this.texture.roughness,
            metalnessMap: this.texture.metallic,
            aoMap: this.texture.ao
        });

        // Store uniforms on material userData
        branchMat.userData.uniforms = coralUniforms;

        // Force unique perlin noise shader key
        branchMat.customProgramCacheKey = function() {
            return 'coral_perlin_noise';
        };

        branchMat.onBeforeCompile = (shader) => {
            shader.uniforms.uTime = coralUniforms.uTime;

            shader.vertexShader = shader.vertexShader.replace(
                '#include <common>',
                `#include <common>
                uniform float uTime;
                varying vec3 vWorldPos;
                
                // Perlin noise for vertex shader
                ${perlinNoiseGLSL}
                `
            );
            
            shader.vertexShader = shader.vertexShader.replace(
                '#include <begin_vertex>',
                `#include <begin_vertex>
                // Get instance world position
                vec3 instancePos = (instanceMatrix * vec4(position, 1.0)).xyz;
                vWorldPos = instancePos;
                
                // Perlin noise wave movement - stronger at top of coral
                float heightFactor = clamp(position.y, 0.0, 1.0);
                float waveNoise = cnoise(instancePos * 1.5 + vec3(uTime * 0.8, uTime * 0.5, uTime * 0.3));
                
                // Apply wave displacement (sway effect)
                transformed.x += waveNoise * 0.15 * heightFactor;
                transformed.z += waveNoise * 0.1 * heightFactor;
                `
            );

            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <common>',
                `#include <common>
                uniform float uTime;
                varying vec3 vWorldPos;
                
                ${perlinNoiseGLSL}
                `
            );

            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <color_fragment>',
                `#include <color_fragment>
                // Multi-layered Perlin noise for rich organic patterns
                float noise1 = cnoise(vWorldPos * 3.0 + vec3(uTime * 0.4, 0.0, uTime * 0.2));
                float noise2 = cnoise(vWorldPos * 6.0 - vec3(uTime * 0.2, uTime * 0.3, 0.0)) * 0.5;
                float combinedNoise = noise1 + noise2;
                
                // Dramatic color pulsing
                diffuseColor.rgb *= 0.4 + combinedNoise * 0.9;
                
                // Strong hue shifting for bioluminescent effect
                diffuseColor.r *= 1.0 + combinedNoise * 0.4;
                diffuseColor.g *= 1.0 + sin(uTime * 0.5 + combinedNoise) * 0.2;
                diffuseColor.b *= 1.0 - combinedNoise * 0.3;
                `
            );

            // Store shader reference
            branchMat.userData.shader = shader;
        };

        const branchMesh = new THREE.InstancedMesh(branchGeo, branchMat, branchMatrices.length);
        branchMesh.name = "branches";
        for (let i = 0; i < branchMatrices.length; i++) {
            branchMesh.setMatrixAt(i, branchMatrices[i]);
        }
        group.add(branchMesh);


        if (leafMatrices.length > 0) {

            const leafShape = new THREE.Shape();
            leafShape.moveTo(0, 0);
            leafShape.bezierCurveTo(0.05, 0.2, 0.1, 0.3, 0, 0.5);
            leafShape.bezierCurveTo(-0.1, 0.3, -0.05, 0.2, 0, 0);
            const leafGeo = new THREE.ExtrudeGeometry(leafShape, { depth: 0.02, bevelEnabled: false });
            leafGeo.computeBoundsTree();
            const leafMat = new THREE.MeshStandardMaterial(
                { color: 0xff9100,
                    map: this.texture.albedo,
                    normalMap: this.texture.normal,
                    roughnessMap: this.texture.roughness,
                    metalnessMap: this.texture.metallic,
                    aoMap: this.texture.ao
                });
            const leafMesh = new THREE.InstancedMesh(leafGeo, leafMat, leafMatrices.length);
            leafMesh.name = "leaves";
            for (let i = 0; i < leafMatrices.length; i++) {
                leafMesh.setMatrixAt(i, leafMatrices[i]);
            }
            group.add(leafMesh);

            
        }

        group.scale.setScalar(0.4);
    
        // Detailed coral
        LOD.addLevel(group, 0);


        // Simple coral 
        const simpleCoralGeo = new THREE.CylinderGeometry(0.10, 0.05, 2);
        const simpleCoralMat = new THREE.MeshStandardMaterial({ color: this.colorZ, metalness: 0.1, roughness: 0.8 });
        const simpleCoralMesh = new THREE.Mesh(simpleCoralGeo, simpleCoralMat);
        simpleCoralMesh.name = "simpleCoral";
        LOD.addLevel(simpleCoralMesh, 25);

        // Set position on the LOD itself
        LOD.position.y = -4;

        // Store uniforms reference on LOD for external update (MyContents.js)
        LOD.userData.uniforms = coralUniforms;

        return LOD;
    }   

    dispose(object) {
        object.children.forEach(child => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) child.material.dispose();
        });
    }
}
