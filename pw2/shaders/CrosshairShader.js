import * as THREE from 'three';

/**
 * Turns the black lines of the crosshair texture into green lines
 */

const CrosshairShader = {
    uniforms: {
        'tDiffuse': { value: null },
        'tCrosshair': { value: null },
        'crosshairColor': { value: new THREE.Vector3(0.0, 1.0, 0.0) },
        'scale': { value: 0.3 }, // scale of the crosshair (0.0 - 1.0)
        'aspect': { value: 1.0 }
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
        uniform float scale;
        uniform float aspect;
        
        varying vec2 vUv;
        
        void main() {
            vec4 color = texture2D(tDiffuse, vUv);
            
            // Scale and center the crosshair
            vec2 center = vec2(0.5, 0.5);
            vec2 scaledUv = (vUv - center) / scale + center;
            
            // Correct aspect ratio
            scaledUv.x = (scaledUv.x - 0.5) * aspect + 0.5;
            
            // Only sample if within bounds
            vec4 crosshair = vec4(0.0);
            if (scaledUv.x >= 0.0 && scaledUv.x <= 1.0 && scaledUv.y >= 0.0 && scaledUv.y <= 1.0) {
                crosshair = texture2D(tCrosshair, scaledUv);
            }
            
            // Use luminance to detect black lines
            float luminance = (crosshair.r + crosshair.g + crosshair.b) / 3.0;
            float crosshairMask = 1.0 - luminance;
            
            // Blend green crosshair over the scene
            color.rgb = mix(color.rgb, crosshairColor, crosshairMask * crosshair.a);
            
            gl_FragColor = color;
        }
    `
};

export { CrosshairShader };
