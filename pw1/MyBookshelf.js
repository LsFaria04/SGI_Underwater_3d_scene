import * as THREE from 'three';
import { MyBook } from './MyBook.js';

class MyBookshelf extends THREE.Object3D {
    constructor(width = 2, depth = 0.5, shelfCount = 5, color = "#8B4513", woodTexture, redBookTexture, blueBookTexture) {
        super();

        if (!redBookTexture || !blueBookTexture) {
            console.warn("Book textures not provided!");
        }

        if (!woodTexture) {
            console.warn("Wood texture not provided!");
        }

        woodTexture.wrapS = THREE.RepeatWrapping;
        woodTexture.wrapT = THREE.RepeatWrapping;
        woodTexture.repeat.set(width, shelfCount * 0.6);

        const woodMaterial = new THREE.MeshPhongMaterial({ color: "#8B4513", map: woodTexture });

        const shelfHeight = 0.6;
        const thickness = 0.05; 

        for (let i = 0; i < shelfCount; i++) {
            const yOffset = i * shelfHeight;

            // left and right sides
            const sideGeometry = new THREE.BoxGeometry(thickness, shelfHeight, depth);
            const left = new THREE.Mesh(sideGeometry, woodMaterial);
            const right = new THREE.Mesh(sideGeometry, woodMaterial);

            left.position.set(-width / 2 + thickness / 2, yOffset + shelfHeight / 2, 0);
            right.position.set(width / 2 - thickness / 2, yOffset + shelfHeight / 2, 0);

            // top and bottom
            const horizGeometry = new THREE.BoxGeometry(width, thickness, depth);
            const top = new THREE.Mesh(horizGeometry, woodMaterial);
            const bottom = new THREE.Mesh(horizGeometry, woodMaterial);

            top.position.set(0, yOffset + shelfHeight - thickness / 2, 0);
            bottom.position.set(0, yOffset + thickness / 2, 0);

            // back
            const backGeometry = new THREE.BoxGeometry(width, shelfHeight, thickness);
            const back = new THREE.Mesh(backGeometry, woodMaterial);
            back.position.set(0, yOffset + shelfHeight / 2, -depth / 2 + thickness / 2);

            this.add(left, right, top, bottom, back);

            // books on the shelf
            const booksPerShelf = 18;
            for (let j = 0; j < booksPerShelf; j++) {
                // random choice of red or blue book, 50% chance each
                const isRed = Math.random() < 0.5;

                const color = isRed ? "#FF3333" : "#3366FF";
                const texture = isRed ? redBookTexture : blueBookTexture
                
                const book = new MyBook(0.4, 0.3, 0.1, color, texture);

                book.position.set(
                    -width / 2 + 0.11 + j * 0.1, 
                    yOffset + thickness,  
                    0.1                         
                );
                book.rotation.set(0, Math.PI / 2, 0); 

                this.add(book);
            }
        }
    }
}

export { MyBookshelf };
