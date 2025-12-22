/**
 * Creates simple lava movement using sine waves.
 */

export const LavaSimpleMovement = {
    uniforms: {
        'time': { value: 0.0 },
        'lavaTexture': { value: null }
    },

    vertexShader: `
        varying vec2 vUv;

        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,

    fragmentShader: `
        uniform float time;
        uniform sampler2D lavaTexture;
        varying vec2 vUv;

        void main() {

            // Create a simple moving lava effect using sine waves
            float wave1 = sin((vUv.x + time * 0.2) * 10.0) * 0.1;
            float wave2 = sin((vUv.y + time * 0.3) * 15.0) * 0.1;
            float lavaPattern = wave1 + wave2;

            // Sample the texture
            vec4 texColor = texture2D(lavaTexture, vUv + vec2(wave1, wave2) * 0.1);

            // Base lava color
            vec3 lavaColor = vec3(1.0, 0.3, 0.0);
            // Brighten the color based on the lava pattern
            lavaColor += lavaPattern * 0.5;
            
            // Mix texture with lava color
            vec3 finalColor = mix(texColor.rgb, lavaColor, 0.5);
            
            gl_FragColor = vec4(finalColor, 1.0);
        }
    `
};