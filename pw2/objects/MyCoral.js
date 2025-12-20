import * as THREE from 'three';
import { generateRandom } from '../utils.js';
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

        this.colorZ = "";

        if (coralType == this.coralPresets.branchingCoral){
            this.colorZ = '#ad0065';
        }
        else{
            this.colorZ = '#ff9100'

        }

        const branchGeo = new THREE.CylinderGeometry(radius, radius, 1, 8);
        branchGeo.computeBoundsTree();
        branchGeo.translate(0, 0.5, 0);
        const branchMat = new THREE.MeshStandardMaterial(
            { color: this.colorZ, 
              map: this.texture.albedo,
             normalMap: this.texture.normal,
             roughnessMap: this.texture.roughness,
             metalnessMap: this.texture.metallic,
            aoMap: this.texture.ao
            });
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


        return LOD;
    }   

    dispose(object) {
        object.children.forEach(child => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) child.material.dispose();
        });
    }
}
