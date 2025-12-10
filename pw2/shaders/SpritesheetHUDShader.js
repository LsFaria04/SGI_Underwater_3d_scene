import * as THREE from 'three';

/**
 * Displays a texture and converts white/bright pixels to green
 */

const SpritesheetHUDShader = {
    uniforms: {
        'tDiffuse': { value: null },
        'tSpritesheet': { value: null },
        'hudColor': { value: new THREE.Vector3(0.0, 1.0, 0.0) } // green
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
        uniform sampler2D tSpritesheet;
        uniform vec3 hudColor;
        
        varying vec2 vUv;
        
        void main() {
            vec4 color = texture2D(tDiffuse, vUv);
            vec4 sprite = texture2D(tSpritesheet, vUv);
            
            float brightness = (sprite.r + sprite.g + sprite.b) / 3.0;
            
            // if bright (white parts), replace with green
            vec3 greenSprite = hudColor * brightness;
            
            color.rgb = mix(color.rgb, greenSprite, sprite.a * brightness);
            
            gl_FragColor = color;
        }
    `
};

export { SpritesheetHUDShader };
