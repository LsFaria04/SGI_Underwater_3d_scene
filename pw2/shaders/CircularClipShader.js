/**
 * Creates a circular viewport with black border (periscope effect)
 */

const CircularClipShader = {
    uniforms: {
        'tDiffuse': { value: null },
        'radius': { value: 0.45 },
        'smoothness': { value: 0.05 },
        'aspect': { value: 1.0 } // screen aspect ratio
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
        uniform float radius;
        uniform float smoothness;
        uniform float aspect;
        
        varying vec2 vUv;
        
        void main() {
            vec4 color = texture2D(tDiffuse, vUv);
            
            // Adjust UV for aspect ratio
            vec2 center = vec2(0.5, 0.5);
            vec2 aspectUv = vUv - center;
            aspectUv.x *= aspect;
            
            // Calculate distance from center with corrected aspect
            float dist = length(aspectUv);
            
            // Create circular mask with smooth edge
            float mask = 1.0 - smoothstep(radius - smoothness, radius, dist);
            
            // Apply black border outside the circle
            gl_FragColor = vec4(color.rgb * mask, 1.0);
        }
    `
};

export { CircularClipShader };
