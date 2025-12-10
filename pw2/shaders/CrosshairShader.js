import * as THREE from 'three';

/**
 * Turns the black lines of the crosshair texture into green lines
 */

const CrosshairShader = {
    uniforms: {
        'tDiffuse': { value: null },
        'tCrosshair': { value: null }, // crosshair texture
        'crosshairColor': { value: new THREE.Vector3(0.0, 1.0, 0.0) } // green color
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
        uniform sampler2D tCrosshair;
        uniform vec3 crosshairColor;
        
        varying vec2 vUv;
        
        void main() {
            vec4 color = texture2D(tDiffuse, vUv);
            vec4 crosshair = texture2D(tCrosshair, vUv);
            
            // Use luminance to detect black lines (dark = crosshair line)
            float luminance = (crosshair.r + crosshair.g + crosshair.b) / 3.0;
            
            // Where texture is dark (black lines), replace with green
            // Invert luminance: dark becomes 1.0, bright becomes 0.0
            float crosshairMask = 1.0 - luminance;
            
            // Blend green crosshair over the scene
            color.rgb = mix(color.rgb, crosshairColor, crosshairMask * crosshair.a);
            
            gl_FragColor = color;
        }
    `
};

export { CrosshairShader };
