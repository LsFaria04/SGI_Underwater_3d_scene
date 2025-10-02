import * as THREE from 'three';

/**
 * This class represents a chair composed of a seat and a backrest with four legs
 */
class MyChair extends THREE.Object3D {
    /**
     * 
     * @param {number} width Chair width
     * @param {number} height Chair height
     * @param {number} depth Chair depth
     * @param {number} legRadius Cylinder radius for legs
     * @param {number} legHeight Cylinder height for legs
     * @param {string|number} color Chair color (hex or string)
     */
    constructor(width = 4, height = 0.2, depth = 2, legRadius = 0.1, legHeight = 1, color = "#8B4513") {
        super();

        // Chair texture (same as table)
        const chairTexture = new THREE.TextureLoader().load("./textures/wood.jpg");
        chairTexture.wrapS = THREE.RepeatWrapping;
        chairTexture.wrapT = THREE.RepeatWrapping;
        chairTexture.repeat.set(width, height);


        // Seat
        const seatGeometry = new THREE.BoxGeometry(width - 0.01, height, depth - 0.01);
        const seatMaterial = new THREE.MeshPhongMaterial({ color: color, map: chairTexture, side: THREE.DoubleSide });
        const seat = new THREE.Mesh(seatGeometry, seatMaterial);
        seat.position.y = legHeight + height / 2; // seat is on top of legs
        this.add(seat);
        // Backrest
        const backrestHeight = height * 5;
        const backrestGeometry = new THREE.BoxGeometry(width-0.01, backrestHeight , height + 0.01);
        const backrestMaterial = new THREE.MeshPhongMaterial({ color: color, map: chairTexture , side: THREE.DoubleSide});
        const backrest = new THREE.Mesh(backrestGeometry, backrestMaterial);
        backrest.position.set(0, legHeight + backrestHeight / 2, depth / 2 - height / 2 - 0.01); // backrest at back of seat
    
       
        //BackRest Right Edges 
        const edgesBackRest = new THREE.CylinderGeometry(0.01, 0.01, backrestHeight, 32 ,1,false, 0, Math.PI/2); 
        const edgesBackRestMesh = new THREE.Mesh(edgesBackRest,seatMaterial);
        edgesBackRestMesh.position.set(width/2 - 0.012,legHeight + backrestHeight/2, depth / 2 - 0.012)
        this.add(edgesBackRestMesh);

        //BackRest Left Edges 
        const edgesBackRestLeft = new THREE.CylinderGeometry(0.01, 0.01, backrestHeight, 32 ,1,false, 0, -Math.PI/2); 
        const edgesBackRestMeshLeft = new THREE.Mesh(edgesBackRestLeft,seatMaterial);
        edgesBackRestMeshLeft.position.set(-width/2 + 0.012,legHeight + backrestHeight/2, depth / 2 - 0.012)
        this.add(edgesBackRestMeshLeft);

        //Seat front Right Edge
        const edgesSeatFront = new THREE.CylinderGeometry(0.01, 0.01, height, 32 ,1,false, 0, 3 * Math.PI/2);
        const edgesSeatFrontMesh = new THREE.Mesh(edgesSeatFront,seatMaterial);
        edgesSeatFrontMesh.position.set(width/2 - 0.012,legHeight + height/2, -depth/2 + 0.012)
        this.add(edgesSeatFrontMesh);

        //Seat front Left Edge
        const edgesSeatFrontLeft = new THREE.CylinderGeometry(0.01, 0.01, height, 32 ,1,false, 0, -3 * Math.PI/2);
        const edgesSeatFrontMeshLeft = new THREE.Mesh(edgesSeatFrontLeft,seatMaterial);
        edgesSeatFrontMeshLeft.position.set(-width/2 + 0.012,legHeight + height/2, -depth/2 + 0.012)
        this.add(edgesSeatFrontMeshLeft);




        this.add(backrest);


        // Legs
        const legGeometry = new THREE.CylinderGeometry(legRadius, legRadius, legHeight, 16);
        const legMaterial = new THREE.MeshPhongMaterial({ color: color, map: chairTexture });

        const dxs = [-width/2 + legRadius, width/2 - legRadius];
        const dzs = [-depth/2 + legRadius, depth/2 - legRadius];

        for (let dx of dxs) {
            for (let dz of dzs) {
                const leg = new THREE.Mesh(legGeometry, legMaterial);
                leg.position.set(dx, legHeight / 2, dz); // legs are half-height above 0
                this.add(leg);
            }
        }
    }
}

export { MyChair };
