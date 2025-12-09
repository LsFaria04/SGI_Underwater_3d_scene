import * as THREE from 'three';

const TintShader = {
    uniforms: {
        'tDiffuse': { value: null },
        'tintColor': { value: new THREE.Color(0.6, 0.85, 0.4) } // greenish/yellowish tint
    },

    vertexShader: `
        varying vec2 vUv;
        
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,

    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform vec3 tintColor;
        
        varying vec2 vUv;
        
        void main() {
            vec4 color = texture2D(tDiffuse, vUv);
            
            // Apply greenish-yellow tint by multiplying with tint color
            color.rgb *= tintColor;
            
            gl_FragColor = color;
        }
    `
};

export { TintShader };
