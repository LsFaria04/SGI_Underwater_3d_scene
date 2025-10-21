import * as THREE from 'three';

/**
 * This class represents a wooden sign with a post and a rectangular board.
 */
class MySign extends THREE.Object3D {
  /**
   * 
   * @param {number} stickHeight - Height of the post.
   * @param {number} stickRadius - Radius of the post.
   * @param {number} boardWidth - Width of the sign board.
   * @param {number} boardHeight - Height of the sign board.
   * @param {number} boardDepth - Thickness of the sign board.
   * @param {string|number} stickColor - Color of the post.
   * @param {string|number} boardColor - Color of the board.
   * @param {string} [text] - text to display on the board.
   * @param {THREE.Texture} [boardTexture] - Optional texture for the board.
   */
  constructor(
    stickHeight = 1.5,
    stickRadius = 0.05,
    boardWidth = 1.5,
    boardHeight = 1,
    boardDepth = 0.05,
    stickColor = 0x8b5a2b,
    boardColor = 0xdeb887,
    text = "BE AWARE OF THE SHARK",
    boardTexture = null,
  ) {
    super();

    // --- Post ---
    const stickGeometry = new THREE.CylinderGeometry(stickRadius, stickRadius, stickHeight, 8);
    const stickMaterial = new THREE.MeshStandardMaterial({ color: stickColor });
    const stick = new THREE.Mesh(stickGeometry, stickMaterial);
    stick.position.y = stickHeight / 2;
    this.add(stick);

    // --- Board ---
    if (!boardTexture && text) {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = '#' + boardColor.toString(16).padStart(6, '0');
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = 'bold 32px Arial';
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(text, canvas.width / 2, 25);

      boardTexture = new THREE.CanvasTexture(canvas);
    }

    const boardGeometry = new THREE.BoxGeometry(boardWidth, boardHeight, boardDepth);
    // Materials: [right, left, top, bottom, front, back]
    const materials = [
    new THREE.MeshStandardMaterial({ color: boardColor }),
    new THREE.MeshStandardMaterial({ color: boardColor }),
    new THREE.MeshStandardMaterial({ color: boardColor }),
    new THREE.MeshStandardMaterial({ color: boardColor }),
    new THREE.MeshStandardMaterial({ map: boardTexture, color: boardColor }), // front <-- texture only here
    new THREE.MeshStandardMaterial({ color: boardColor }),
    ];

    const board = new THREE.Mesh(boardGeometry, materials);
    board.position.y = stickHeight + boardHeight / 2;
    this.add(board);

    this.stick = stick;
    this.board = board;
  }
}

export { MySign };
