/**
 * Overlays a texture directly without processing
 */

const TextureOverlayShader = {
    uniforms: {
        'tDiffuse': { value: null },
        'tOverlay': { value: null },
        'opacity': { value: 1.0 }
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
        uniform sampler2D tOverlay;
        uniform float opacity;
        
        varying vec2 vUv;
        
        void main() {
            vec4 base = texture2D(tDiffuse, vUv);
            vec4 overlay = texture2D(tOverlay, vUv);
            
            // Only blend where the overlay is bright (scratches)
            float brightness = (overlay.r + overlay.g + overlay.b) / 3.0;
            float mask = brightness * overlay.a * opacity;
            
            // Add bright scratches on top
            gl_FragColor = vec4(base.rgb + overlay.rgb * mask, base.a);
        }
    `
};

export { TextureOverlayShader };
