import * as THREE from 'three';

export class MyCoral {
    constructor() {
        this.coralPresets = {
        fanCoral: {
            rules: {
            'X': [
                { prob: 0.7, rule: 'F[+X][-X]' },
                { prob: 0.3, rule: 'FX' }
            ],
            'F': [
                { prob: 1.0, rule: 'FF' }
            ]
            },
            angle: 15,
            variableAngle: 5,
            lengthFactor: 0.8
        },
        branchingCoral: {
            rules: {
            'X': [
                { prob: 0.3, rule: 'F[+X][&X][-X][^X]' },
                 { prob: 0.7, rule: 'F[+X][-X]^X' }
            ],
            'F': [
                { prob: 1.0, rule: 'FF' }
            ]
            },
            angle: 45,
            variableAngle: 10,
            lengthFactor: 0.1
        },
        bubbleCoral: {
            rules: {
            'X': [
                { prob: 0.8, rule: 'FX' },
                { prob: 0.2, rule: '' }
            ],
            'F': [
                { prob: 1.0, rule: 'F' }
            ]
            },
            angle: 0,
            variableAngle: 0,
            lengthFactor: 0.9
        }
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
        const defaultCoral = this.coralPresets.branchingCoral;
        const coral = this.generateCoralMesh(defaultCoral, complexity);
        
        coral.position.y = -4; 
        return coral;
    }

    generateCoralMesh(coralType, complexity) {
        const iterations = complexity;
        const baseAngle = 25 * THREE.MathUtils.DEG2RAD;
        const variableAngle = 10 * THREE.MathUtils.DEG2RAD; // random angle variation for more natural trees

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

        let branchLength = 0.2;
        const lengthFactor = 0.6;
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


        const group = new THREE.Group();

        const branchGeo = new THREE.CylinderGeometry(0.05, 0.05, 1, 8);
        branchGeo.translate(0, 0.5, 0);
        const branchMat = new THREE.MeshStandardMaterial({ color: '#FF6F61', metalness: 0.1, roughness: 0.8 });
        const branchMesh = new THREE.InstancedMesh(branchGeo, branchMat, branchMatrices.length);
        branchMesh.name = "branches";
        for (let i = 0; i < branchMatrices.length; i++) {
            branchMesh.setMatrixAt(i, branchMatrices[i]);
        }
        group.add(branchMesh);

        group.scale.setScalar(0.4);
        group.position.y = -4;
        return group;
    }   

    dispose(object) {
        object.children.forEach(child => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) child.material.dispose();
        });
    }
}
