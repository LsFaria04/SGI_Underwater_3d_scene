import * as THREE from 'three';

const LensDirtShader = {
    uniforms: {
        'tDiffuse': { value: null },
        'tDirt': { value: null }, // scratches texture
        'dirtIntensity': { value: 0.6 }
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
        uniform sampler2D tDirt;
        uniform float dirtIntensity;
        
        varying vec2 vUv;
        
        void main() {
            vec4 color = texture2D(tDiffuse, vUv);
            vec4 dirt = texture2D(tDirt, vUv);
            
            // white cracks = visible scratches
            float scratchMask = dirt.a * ((dirt.r + dirt.g + dirt.b) / 3.0);
            
            // darken where scratches are visible
            color.rgb *= mix(1.0, 0.4, scratchMask * dirtIntensity);
            
            gl_FragColor = color;
        }
    `
};

export { LensDirtShader };
