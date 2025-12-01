import * as THREE from 'three';
import { MeshBVHHelper } from '../index.module.js';

/**
 * This class represents a wooden sign with a post and a rectangular board.
 * It now overlays the text as a separate transparent plane when a boardTexture (like a video) is provided,
 * allowing both the video and the text to be visible on the same face.
 */
class MySign extends THREE.Object3D {
	/**
	 * * @param {number} stickHeight - Height of the post.
	 * @param {number} stickRadius - Radius of the post.
	 * @param {number} boardWidth - Width of the sign board.
	 * @param {number} boardHeight - Height of the sign board.
	 * @param {number} boardDepth - Thickness of the sign board.
	 * @param {string|number} stickColor - Color of the post.
	 * @param {string|number} boardColor - Color of the board.
	 * @param {string} [text] - text to display on the board.
	 * @param {THREE.Texture} [boardTexture] - Optional texture for the board (e.g., VideoTexture).
	 */
	constructor(
		stickHeight = 1.5,
		stickRadius = 0.05,
		boardWidth = 1.5,
		boardHeight = 1,
		boardDepth = 0.05,
		stickColor = 0x8b5a2b,
		boardColor = 0xdeb887,
		text = "BEWARE OF THE SHARK",
		boardTexture = null,
	) {
		super();
		this.bvh = false;

		// --- Post ---
		const stickGeometry = new THREE.CylinderGeometry(stickRadius, stickRadius, stickHeight, 8);
		const stickMaterial = new THREE.MeshStandardMaterial({ color: stickColor });
		const stick = new THREE.Mesh(stickGeometry, stickMaterial);
		stick.position.y = stickHeight / 2;
		this.add(stick);
		stickGeometry.computeBoundsTree();

		stick.castShadow = true;
		stick.receiveShadow = true;

		// --- Text Texture Generation (Separate from boardTexture) ---
		let textTexture = null; 
		if (text) {
			const canvas = document.createElement('canvas');
			canvas.width = 512;
			canvas.height = 256;
			const ctx = canvas.getContext('2d');

			// Fill the canvas with a transparent background (not board color)
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			ctx.font = 'bold 32px Arial';
			ctx.fillStyle = 'red';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'top';
			ctx.fillText(text, canvas.width / 2, 25);

			textTexture = new THREE.CanvasTexture(canvas);
			textTexture.needsUpdate = true;
		}

		// --- Main Board (Video Container) ---
		const boardGeometry = new THREE.BoxGeometry(boardWidth, boardHeight, boardDepth);
		boardGeometry.computeBoundsTree();

		// Materials: [right, left, top, bottom, front, back]
		const materials = [
			new THREE.MeshStandardMaterial({ color: boardColor }), // right
			new THREE.MeshStandardMaterial({ color: boardColor }), // left
			new THREE.MeshStandardMaterial({ color: boardColor }), // top
			new THREE.MeshStandardMaterial({ color: boardColor }), // bottom
			// Front Face (Index 4): Uses the video texture (boardTexture). Color 0xffffff ensures no tinting.
			new THREE.MeshStandardMaterial({ map: boardTexture, color: 0xffffff }), 
			new THREE.MeshStandardMaterial({ color: boardColor }), // back
		];

		const board = new THREE.Mesh(boardGeometry, materials);
		board.position.y = stickHeight + boardHeight / 2;
		this.add(board);
		
		// --- Text Overlay Plane ---
		if (textTexture) {
			const textMaterial = new THREE.MeshBasicMaterial({
				map: textTexture,
				transparent: true,
				color: 0xffffff,
				depthWrite: false, // Helps prevent Z-fighting with the board
			});

			const textPlaneGeometry = new THREE.PlaneGeometry(boardWidth, boardHeight);
			const textPlane = new THREE.Mesh(textPlaneGeometry, textMaterial);

			// Position the plane slightly in front of the board's front face
			const offset = boardDepth / 2 + 0.005;
			textPlane.position.z = offset;
			
			// Add the text plane to the board mesh
			board.add(textPlane);
		}


		board.castShadow = true;
		board.receiveShadow = true;
		
		this.stick = stick;
		this.board = board;
	}
}

export { MySign };